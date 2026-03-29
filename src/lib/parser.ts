/**
 * parser.ts — Smart Paste Parser v2.
 * Fix: qty+unit concatenati (200g, 1.5kg), sezione detection migliorata.
 */

import type { ParsedResult, RawIngredient, RecipeLanguage } from "../types";
import {
  parseFraction,
  stripApproximation,
  convertUnit,
  classifyUnit,
  VOLUME_TO_ML,
  WEIGHT_TO_G,
  ITALIAN_VOLUME_TO_ML,
} from "./conversions";
import { findCanonicalId, isSolidIngredient } from "./ingredients";

// ─── Tipi interni ─────────────────────────────────────────────────────────────

interface Line {
  raw: string;
  clean: string;
  index: number;
}

interface DetectedSections {
  titleLines: Line[];
  yieldLines: Line[];
  timeLines: Line[];
  ingredientLines: Line[];
  stepLines: Line[];
}

// ─── Detect language ──────────────────────────────────────────────────────────

function detectLanguage(text: string): RecipeLanguage {
  if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) return "ja";
  const itWords = /\b(ingredienti|preparazione|porzioni|ricetta|forno|cuocere|aggiungere|mescolare|versare|unire|sbattere|grattugiare|preriscaldare|amalgamare)\b/i;
  if (itWords.test(text)) return "it";
  return "en";
}

// ─── Tokenizer ────────────────────────────────────────────────────────────────

function tokenize(text: string): Line[] {
  return text
    .split(/\r?\n/)
    .map((raw, index) => ({
      raw,
      clean: raw.replace(/\t/g, " ").replace(/\s{2,}/g, " ").trim(),
      index,
    }))
    .filter((l) => l.clean.length > 0);
}

// ─── Costanti sezioni ─────────────────────────────────────────────────────────

const INGREDIENT_HEADERS = /^(ingredient[si]?|what you('ll| will)? need|ingredienti|occorrente|serve[rà]|cosa (ti |vi )?serve|lista della spesa):?\s*$/i;

const STEP_HEADERS = /^(instruction[s]?|direction[s]?|method|preparation|procedure|steps?|how to (make|prepare)|procedimento|preparazione|istruzioni|svolgimento|passo a passo|come si (fa|prepara|fa)|procedura|modo di (fare|preparare)):?\s*$/i;

const YIELD_RE = /\b(serves?|servings?|yield[s]?|portions?|porzioni|dosi?|persone|per\s+\d)\b|\b(\d+)\s*(persone|porzioni|porzione|dose|dosi)\b|\b(makes?|yields?)\s+(\d+)/i;

const TIME_RE = /\b(prep(aration)?\s*time|cook(ing)?\s*time|total\s*time|tempo\s*(totale|preparazione|cottura))|\b\d+\s*(h|hr[s]?|hour[s]?|ore|ora|min(?:ut[ei]s?)?|minuti?)\b/i;

const NUMBERED_RE = /^\d+[.)]\s+/;
const BULLET_RE   = /^[-•*·▪▸→✓✔]\s+/;

// Tutte le unità note per il pattern matching
const ALL_UNIT_KEYS = [
  ...Object.keys(VOLUME_TO_ML),
  ...Object.keys(WEIGHT_TO_G),
  ...Object.keys(ITALIAN_VOLUME_TO_ML),
  "q.b.", "qb", "a piacere",
  "spicchio", "spicchi", "fetta", "fette", "foglia", "foglie",
  "mazzetto", "mazzetti", "rametto", "rametti", "pizzico", "pizzichi",
  "noce", "noci", "gocce", "cucchiaio", "cucchiaini",
];

const UNIT_RE = new RegExp(
  `\\b(${ALL_UNIT_KEYS
    .map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "i"
);

const COOKING_VERBS = /\b(mescola|aggiungi|cuoci|porta|versa|taglia|unisci|scalda|lascia|togli|incorpora|frulla|sbatti|grattugia|inforna|rosola|soffriggi|preriscalda|amalgama|impasta|stendi|copri|riposa|sgocciola|scola|trita|affetta|pela|gratta|spolvera|condisci|decora|servi|mix|add|cook|heat|stir|pour|bake|boil|simmer|roast|fry|chop|blend|whisk|combine|place|remove|transfer|preheat|season|serve|fold|knead|drain|slice|peel|grate|sprinkle)\b/i;

// ─── Section Detector (migliorato) ───────────────────────────────────────────

/**
 * Una riga è probabilmente un ingrediente se:
 * - inizia con un numero (non seguito da ".")  → "200g farina", "3 uova"
 * - inizia con una frazione unicode             → "½ cup latte"
 * - inizia con un bullet e non è una frase lunga
 * - contiene un'unità di misura nota e non è troppo lunga
 */
function looksLikeIngredient(line: Line): boolean {
  const c = line.clean;

  // Troppo lunga per essere un ingrediente (> 100 char → quasi certamente un passo)
  if (c.length > 100) return false;

  // Inizia con numero non seguito da punto (evita "1. Preriscaldare")
  if (/^[\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/.test(c) && !/^\d+\.\s/.test(c)) return true;

  // Bullet + contenuto breve con unità
  if (BULLET_RE.test(c) && c.length < 80) return true;

  // Contiene un'unità di misura nota + non ha verbi di cottura
  if (UNIT_RE.test(c) && !COOKING_VERBS.test(c) && c.length < 80) return true;

  return false;
}

/**
 * Una riga è probabilmente un passo se:
 * - è numerata ("1. Preriscaldare...")
 * - è una frase lunga con verbi di cottura
 * - inizia con maiuscola ed è > 60 caratteri
 */
function looksLikeStep(line: Line): boolean {
  const c = line.clean;
  if (NUMBERED_RE.test(c) && c.length > 15) return true;
  if (c.length > 60 && COOKING_VERBS.test(c)) return true;
  if (c.length > 80 && /^[A-ZÁÉÍÓÚ]/.test(c)) return true;
  return false;
}

function detectSections(lines: Line[]): DetectedSections {
  const out: DetectedSections = {
    titleLines: [],
    yieldLines: [],
    timeLines: [],
    ingredientLines: [],
    stepLines: [],
  };

  type Mode = "unknown" | "ingredients" | "steps";
  let mode: Mode = "unknown";
  let titleDone = false;

  // Prima passata: cerca se ci sono header espliciti
  const hasExplicitHeaders = lines.some(
    (l) => INGREDIENT_HEADERS.test(l.clean) || STEP_HEADERS.test(l.clean)
  );

  for (const line of lines) {
    const c = line.clean;

    // Titolo: prima riga utile
    if (!titleDone && !INGREDIENT_HEADERS.test(c) && !STEP_HEADERS.test(c) && !NUMBERED_RE.test(c) && !YIELD_RE.test(c)) {
      out.titleLines.push(line);
      titleDone = true;
      continue;
    }
    titleDone = true;

    // Header espliciti di sezione
    if (INGREDIENT_HEADERS.test(c)) { mode = "ingredients"; continue; }
    if (STEP_HEADERS.test(c))       { mode = "steps";       continue; }

    // Porzioni e tempo (sempre raccolti)
    if (YIELD_RE.test(c)) out.yieldLines.push(line);
    if (TIME_RE.test(c))  out.timeLines.push(line);

    // Assegnazione esplicita
    if (mode === "ingredients") {
      // Interrompi se incontra una riga chiaramente da "step" in modalità ingredienti
      if (hasExplicitHeaders && looksLikeStep(line) && !looksLikeIngredient(line)) {
        mode = "steps";
        out.stepLines.push(line);
      } else {
        out.ingredientLines.push(line);
      }
      continue;
    }

    if (mode === "steps") {
      out.stepLines.push(line);
      continue;
    }

    // Modalità euristica (nessun header trovato)
    if (looksLikeIngredient(line)) {
      out.ingredientLines.push(line);
    } else if (looksLikeStep(line)) {
      out.stepLines.push(line);
    }
    // Righe ambigue: ignorate (titolo, note, ecc.)
  }

  return out;
}

// ─── Quantity Extractor v2 (fix 200g, 1.5kg, ecc.) ───────────────────────────

/**
 * Tenta di parsare una riga ingrediente estraendo qty, unit, name.
 *
 * Gestisce esplicitamente:
 *   "200g farina"        → qty:200,  unit:"g",   name:"farina"
 *   "200 g farina"       → qty:200,  unit:"g",   name:"farina"
 *   "1.5 kg patate"      → qty:1.5,  unit:"kg",  name:"patate"
 *   "2 cucchiai di olio" → qty:2,    unit:"",    name:"olio"  (cucchiai → ml in convertUnit)
 *   "½ cup latte"        → qty:0.5,  unit:"cup", name:"latte"
 *   "3 uova"             → qty:3,    unit:"",    name:"uova"
 *   "q.b. sale"          → qty:"q.b.", unit:"",  name:"sale"
 */
function extractIngredientParts(raw: string): {
  qty: number | string;
  unit: string;
  name: string;
} {
  // Rimuovi bullet e numerazione lista
  let s = raw.replace(/^[-•*·▪▸→✓✔]\s*/, "").trim();
  s = s.replace(/^\d+[.)]\s+/, "");

  // q.b. / a piacere / to taste
  if (/\bq\.?\s*b\.?\b|a\s+piacere|a\s+gusto|as\s+needed|to\s+taste|quanto\s+basta/i.test(s)) {
    const name = s
      .replace(/,?\s*(q\.?\s*b\.?\b|a\s+piacere|a\s+gusto|as\s+needed|to\s+taste|quanto\s+basta)/gi, "")
      .replace(/^[-–]\s*/, "")
      .trim();
    return { qty: "q.b.", unit: "", name: name || s };
  }

  s = stripApproximation(s);

  // ── Strategia 1: numero + unità ATTACCATI (200g, 1.5kg, 250ml) ────────────
  // Regex: cattura numero immediatamente seguito da lettere (unità)
  const ATTACHED = /^([\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞][\d.,/\s½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]*?)([a-zA-Zàèéìòùç]+\.?)(\s+.+)?$/i;
  const ma = ATTACHED.exec(s);
  if (ma) {
    const rawQty   = ma[1].trim();
    const rawUnit  = ma[2].trim();
    const rawName  = (ma[3] ?? "").trim();

    const unitClass = classifyUnit(rawUnit);
    if (unitClass !== "unknown" && rawName) {
      // Unità riconosciuta e c'è un nome dopo → valido
      const parsedQty = parseFraction(rawQty);
      // Rimuovi connettivi iniziali dal nome
      const cleanName = rawName.replace(/^(di|d'|of)\s+/i, "").trim();
      return {
        qty:  parsedQty !== null ? parsedQty : rawQty,
        unit: rawUnit,
        name: cleanName,
      };
    }
  }

  // ── Strategia 2: numero SPAZIO unità SPAZIO nome ──────────────────────────
  // "200 g farina", "2 cucchiai olio", "½ cup latte"
  const SPACED = /^([\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞][\d\s.,/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞-]*?)\s+([a-zA-Zàèéìòùç]+\.?)\s+(.+)$/i;
  const mb = SPACED.exec(s);
  if (mb) {
    const rawQty  = mb[1].trim();
    const rawUnit = mb[2].trim();
    const rawName = mb[3].trim();

    const unitClass = classifyUnit(rawUnit);
    if (unitClass !== "unknown") {
      const parsedQty = parseFraction(rawQty);
      const cleanName = rawName.replace(/^(di|d'|of)\s+/i, "").trim();
      return {
        qty:  parsedQty !== null ? parsedQty : rawQty,
        unit: rawUnit,
        name: cleanName,
      };
    }
    // L'unità non è riconosciuta → rawUnit fa parte del nome
    const parsedQty = parseFraction(rawQty);
    return {
      qty:  parsedQty !== null ? parsedQty : rawQty,
      unit: "",
      name: `${rawUnit} ${rawName}`.replace(/^(di|d'|of)\s+/i, "").trim(),
    };
  }

  // ── Strategia 3: solo numero + nome (senza unità) "3 uova", "2 spicchi aglio"
  const NO_UNIT = /^([\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞][\d\s.,/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞-]*?)\s+(.+)$/i;
  const mc = NO_UNIT.exec(s);
  if (mc) {
    const rawQty  = mc[1].trim();
    const rawName = mc[2].trim().replace(/^(di|d'|of)\s+/i, "");
    const parsedQty = parseFraction(rawQty);
    return {
      qty:  parsedQty !== null ? parsedQty : rawQty,
      unit: "",
      name: rawName,
    };
  }

  // Fallback: tutta la riga come nome, qty vuota
  return { qty: "", unit: "", name: s };
}

// ─── Unit Converter + Normalize ───────────────────────────────────────────────

function processIngredient(line: Line, lang: RecipeLanguage): RawIngredient {
  const { qty, unit, name } = extractIngredientParts(line.clean);

  if (typeof qty === "string") {
    const canonicalId = findCanonicalId(name, lang === "ja" ? "ja" : lang === "en" ? "en" : "it") ?? "";
    return { raw: line.raw, qty, unit: "", name, canonicalId };
  }

  const numQty    = qty ?? 0;
  const converted = unit ? convertUnit(numQty, unit) : null;

  const finalQty  = converted ? converted.qty  : numQty;
  const finalUnit = converted ? converted.unit  : ("" as const);

  const canonicalId = findCanonicalId(name, lang === "ja" ? "ja" : lang === "en" ? "en" : "it") ?? "";
  const ambiguous   =
    converted?.unit === "ml" &&
    converted.wasConverted &&
    canonicalId !== "" &&
    isSolidIngredient(canonicalId);

  return {
    raw:           line.raw,
    qty:           finalQty,
    unit:          finalUnit,
    name,
    canonicalId,
    convertedQty:  converted?.wasConverted ? finalQty  : undefined,
    convertedUnit: converted?.wasConverted ? finalUnit : undefined,
    ambiguous,
  };
}

// ─── Step Extractor ───────────────────────────────────────────────────────────

export const TIMER_REGEX =
  /(\d+(?:[.,]\d+)?)\s*(?:[-–]|to|a)?\s*(?:\d+\s*)?(?:–)?\s*(min(?:ut[ei]s?)?|minuti?|minut[eo]|ore?|hour[s]?|\bh\b|secondi?|second[s]?|\bsec\b)/gi;

function cleanStep(s: string): string {
  return s.replace(/^\d+[.)]\s*/, "").replace(/^[-•*·]\s*/, "").trim();
}

function extractSteps(lines: Line[]): string[] {
  if (lines.length === 0) return [];

  // Se la maggioranza è numerata, preserva l'ordine
  if (lines.filter((l) => NUMBERED_RE.test(l.clean)).length >= lines.length / 2) {
    return lines.map((l) => cleanStep(l.clean)).filter((s) => s.length > 5);
  }

  // Altrimenti accorpa righe in step
  const steps: string[] = [];
  let buf = "";

  for (const line of lines) {
    const c = cleanStep(line.clean);
    if (!c) continue;
    const startsNew =
      /^[A-ZÁÉÍÓÚ]/.test(c) && buf.length > 0 && /[.!?]$/.test(buf.trimEnd());
    if (startsNew) { steps.push(buf.trim()); buf = c; }
    else buf = buf ? `${buf} ${c}` : c;
  }
  if (buf.trim()) steps.push(buf.trim());

  return steps.filter((s) => s.length > 5);
}

// ─── Yield + Time ─────────────────────────────────────────────────────────────

function extractYield(lines: Line[]): number {
  for (const line of lines) {
    const m = /(\d+)\s*(persone|porzioni|porzione|persona|servings?|portions?|yields?|dosi?)/.exec(line.clean);
    if (m) return parseInt(m[1]);
    const m2 = /\bpe?r?\s+(\d+)\b/i.exec(line.clean);
    if (m2) return parseInt(m2[1]);
    const m3 = /\b(\d+)\b/.exec(line.clean);
    if (m3) return parseInt(m3[1]);
  }
  return 4;
}

function extractTime(lines: Line[]): { total: number; prep?: number; cook?: number } {
  let prep: number | undefined;
  let cook: number | undefined;
  let total: number | undefined;

  const toMin = (val: number, unit: string): number =>
    /^h/i.test(unit) && !/min/i.test(unit) ? val * 60 : val;

  for (const line of lines) {
    const c = line.clean.toLowerCase();
    const matches = [...c.matchAll(/(\d+)\s*(h(?:r|our)?s?|or[ae]|min(?:ut[ei]s?)?|minut[eo])/gi)];
    for (const tm of matches) {
      const val = toMin(parseInt(tm[1]), tm[2]);
      if (/prep|prepara/i.test(c))         prep  = (prep  ?? 0) + val;
      else if (/cook|cottura|cotto/i.test(c)) cook  = (cook  ?? 0) + val;
      else if (/total[e]?/i.test(c))       total = (total ?? 0) + val;
      else                                  total = (total ?? 0) + val;
    }
  }
  return { total: total ?? (prep ?? 0) + (cook ?? 0), prep, cook };
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export function parseRecipe(text: string): ParsedResult {
  if (!text.trim()) {
    return { title: "Nuova ricetta", yield: 4, totalTime: 0, ingredients: [], steps: [], tags: [], language: "it", warnings: ["Nessun contenuto da analizzare"] };
  }

  const lang     = detectLanguage(text);
  const lines    = tokenize(text);
  const sections = detectSections(lines);

  const title    = (sections.titleLines[0] ?? lines[0])?.clean
    .replace(/^#+\s*/, "").replace(/^ricetta:\s*/i, "").trim().slice(0, 120) ?? "Nuova ricetta";

  const { total, prep, cook } = extractTime(sections.timeLines);
  const yieldCount = extractYield(sections.yieldLines);

  const ingredients = sections.ingredientLines
    .map((l) => processIngredient(l, lang))
    .filter((i) => i.name.length > 0);

  const steps    = extractSteps(sections.stepLines);
  const warnings = ingredients
    .filter((i) => i.ambiguous)
    .map((i) => `"${i.name}" è un solido dato in volume (ml). Verifica la quantità.`);

  const tags: string[] = [];
  if (lang === "it") tags.push("italiana");
  else if (lang === "en") tags.push("internazionale");
  else if (lang === "ja") tags.push("giapponese");
  if (total > 0 && total <= 30) tags.push("veloce");
  if (total > 90) tags.push("elaborata");

  return { title, yield: yieldCount, totalTime: total, prepTime: prep, cookTime: cook, ingredients, steps, tags, language: lang, warnings };
}
