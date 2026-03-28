/**
 * parser.ts — Smart Paste Parser.
 * Pipeline: tokenize → detectSections → extractQuantities →
 *           convertUnits → extractSteps + normalizeIngredients.
 * Tutto sincrono, solo regex ed euristiche. Nessuna AI.
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

// ─── Step 0 — Detect language ─────────────────────────────────────────────────

function detectLanguage(text: string): RecipeLanguage {
  if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) return "ja";
  const itWords =
    /\b(ingredienti|preparazione|porzioni|ricetta|minuti|forno|cuocere|aggiungere|mescolare|versare|unire|sbattere|grattugiare)\b/i;
  if (itWords.test(text)) return "it";
  return "en";
}

// ─── Step 1 — Tokenizer ───────────────────────────────────────────────────────

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

// ─── Step 2 — Section Detector ────────────────────────────────────────────────

const INGREDIENT_HEADERS =
  /^(ingredient[si]?|what you('ll| will)? need|you('ll| will)? need|ingredienti|occorrente|serve[rà]):?\s*$/i;

const STEP_HEADERS =
  /^(instruction[s]?|direction[s]?|method|preparation|procedure|steps?|how to (make|prepare)|procedimento|preparazione|istruzioni|svolgimento|passo a passo|come si (fa|prepara)):?\s*$/i;

const YIELD_RE =
  /\b(serves?|servings?|yield[s]?|portions?|porzioni|dosi?|persone|per\s+\d)\b|\b(\d+)\s*(persone|porzioni|porzione|dose|dosi)\b|\b(makes?|yields?)\s+(\d+)/i;

const TIME_RE =
  /\b(prep(aration)?\s*time|cook(ing)?\s*time|total\s*time|tempo\s*(totale|preparazione|cottura))|\b\d+\s*(h|hr[s]?|hour[s]?|ore|ora|min(?:ut[ei]s?)?|minuti?)\b/i;

const ALL_UNIT_KEYS = [
  ...Object.keys(VOLUME_TO_ML),
  ...Object.keys(WEIGHT_TO_G),
  ...Object.keys(ITALIAN_VOLUME_TO_ML),
  "q.b.", "qb", "a piacere",
  "spicchio", "spicchi", "fetta", "fette", "foglia", "foglie",
  "mazzetto", "mazzetti", "rametto", "rametti", "pizzico", "pizzichi",
];

const UNIT_RE = new RegExp(
  `\\b(${ALL_UNIT_KEYS
    .map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "i"
);

const QUANTITY_START = /^[\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/;
const BULLET_RE = /^[-•*·▪▸→✓✔]\s+/;
const NUMBERED_RE = /^\d+[.)]\s+/;
const COOKING_VERBS =
  /\b(mescola|aggiungi|cuoci|porta|versa|taglia|unisci|scalda|lascia|togli|incorpora|frulla|sbatti|grattugia|inforna|rosola|soffriggi|mix|add|cook|heat|stir|pour|bake|boil|simmer|roast|fry|chop|blend|whisk|combine|place|remove|transfer|preheat|season|serve|fold|knead)\b/i;

function looksLikeIngredient(line: Line): boolean {
  const c = line.clean;
  if (QUANTITY_START.test(c) && !NUMBERED_RE.test(c)) return true;
  if (BULLET_RE.test(c) && (UNIT_RE.test(c) || c.replace(BULLET_RE, "").length < 60)) return true;
  return false;
}

function looksLikeStep(line: Line): boolean {
  const c = line.clean;
  if (NUMBERED_RE.test(c) && c.length > 20) return true;
  if (c.length > 50 && COOKING_VERBS.test(c)) return true;
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

  for (const line of lines) {
    const c = line.clean;

    // Titolo: prima riga utile che non sia un header di sezione o numerazione
    if (
      !titleDone &&
      !INGREDIENT_HEADERS.test(c) &&
      !STEP_HEADERS.test(c) &&
      !NUMBERED_RE.test(c)
    ) {
      out.titleLines.push(line);
      titleDone = true;
      continue;
    }
    titleDone = true;

    // Header sezione
    if (INGREDIENT_HEADERS.test(c)) { mode = "ingredients"; continue; }
    if (STEP_HEADERS.test(c))       { mode = "steps";       continue; }

    // Porzioni / Tempo (sempre raccolti indipendentemente dalla modalità)
    if (YIELD_RE.test(c)) out.yieldLines.push(line);
    if (TIME_RE.test(c))  out.timeLines.push(line);

    // Assegnazione alla sezione
    if (mode === "ingredients") {
      out.ingredientLines.push(line);
    } else if (mode === "steps") {
      out.stepLines.push(line);
    } else {
      // Modalità euristica
      if (looksLikeIngredient(line))    out.ingredientLines.push(line);
      else if (looksLikeStep(line))     out.stepLines.push(line);
    }
  }

  return out;
}

// ─── Step 3 — Quantity Extractor ──────────────────────────────────────────────

function extractIngredientParts(raw: string): {
  qty: number | string;
  unit: string;
  name: string;
} {
  // Rimuovi bullet
  let s = raw.replace(/^[-•*·▪▸→✓✔]\s*/, "").trim();
  // Rimuovi numerazione lista (es "1. sale" non è qty)
  s = s.replace(/^\d+[.)]\s+/, "");

  // q.b. / a piacere / to taste
  if (/\bq\.?\s*b\.?\b|a\s+piacere|a\s+gusto|as\s+needed|to\s+taste/i.test(s)) {
    const name = s
      .replace(/,?\s*(q\.?\s*b\.?\b|a\s+piacere|a\s+gusto|as\s+needed|to\s+taste)/gi, "")
      .replace(/^[-–]\s*/, "")
      .trim();
    return { qty: "q.b.", unit: "", name: name || s };
  }

  s = stripApproximation(s);

  // Regex: [qty] [unit] [di/of] name
  const QTY_PART =
    "(?<qty>[\\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞][\\d\\s./½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞,-]*?)?";
  const UNIT_PART =
    "(?<unit>fl\\.?\\s*oz\\.?|[a-zA-Zàèéìòùç]+\\.?)";
  const CONNECTOR = "(?:\\s+(?:di|d'|of)\\s+|\\s*[-–]\\s*)?";
  const NAME_PART = "(?<n>.+?)$";

  const FULL_RE = new RegExp(
    `^${QTY_PART}\\s*${UNIT_PART}?\\s*${CONNECTOR}${NAME_PART}`,
    "i"
  );

  const m = FULL_RE.exec(s);
  if (!m?.groups) return { qty: "", unit: "", name: s };

  const rawQty  = (m.groups.qty  ?? "").trim();
  const rawUnit = (m.groups.unit ?? "").trim();
  const rawName = (m.groups.n   ?? "").trim();

  const unitClass  = classifyUnit(rawUnit);
  const validUnit  = unitClass !== "unknown" ? rawUnit : "";
  const namePrefix = unitClass === "unknown" && rawUnit ? `${rawUnit} ` : "";
  const name       = `${namePrefix}${rawName}`.trim() || s;

  const parsedQty = rawQty ? parseFraction(rawQty) : null;

  return {
    qty:  parsedQty !== null ? parsedQty : rawQty || "",
    unit: validUnit,
    name,
  };
}

// ─── Step 4 — Unit Converter + Normalize ─────────────────────────────────────

function processIngredient(line: Line, lang: RecipeLanguage): RawIngredient {
  const { qty, unit, name } = extractIngredientParts(line.clean);

  // Quantità testuale (q.b., ecc.) — nessuna conversione
  if (typeof qty === "string") {
    const canonicalId =
      findCanonicalId(name, lang === "ja" ? "ja" : lang === "en" ? "en" : "it") ?? "";
    return { raw: line.raw, qty, unit: "", name, canonicalId };
  }

  const numQty   = qty ?? 0;
  const converted = unit ? convertUnit(numQty, unit) : null;

  const finalQty  = converted ? converted.qty  : numQty;
  const finalUnit = converted ? converted.unit  : ("" as const);

  const canonicalId =
    findCanonicalId(name, lang === "ja" ? "ja" : lang === "en" ? "en" : "it") ?? "";

  // Warning: solido dato in volume (es. 240ml farina dopo conversione da cup)
  const ambiguous =
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

// ─── Step 5 — Step Extractor ──────────────────────────────────────────────────

/** Regex esportata — usata da CookingMode per trovare timer nel testo */
export const TIMER_REGEX =
  /(\d+(?:[.,]\d+)?)\s*(?:[-–]|to|a)?\s*(?:\d+\s*)?(?:–)?\s*(min(?:ut[ei]s?)?|minuti?|minut[eo]|ore?|hour[s]?|\bh\b|secondi?|second[s]?|\bsec\b)/gi;

function cleanStep(s: string): string {
  return s.replace(/^\d+[.)]\s*/, "").replace(/^[-•*·]\s*/, "").trim();
}

function extractSteps(lines: Line[]): string[] {
  if (lines.length === 0) return [];

  // Già numerati → preserva ordine direttamente
  if (lines.filter((l) => NUMBERED_RE.test(l.clean)).length > lines.length / 2) {
    return lines.map((l) => cleanStep(l.clean)).filter((s) => s.length > 5);
  }

  // Accorpa frammenti in step interi
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

// ─── Yield ────────────────────────────────────────────────────────────────────

function extractYield(lines: Line[]): number {
  for (const line of lines) {
    const m =
      /(\d+)\s*(persone|porzioni|porzione|persona|servings?|portions?|yields?|dosi?)/.exec(
        line.clean
      );
    if (m) return parseInt(m[1]);
    const m2 = /\bpe?r?\s+(\d+)\b/i.exec(line.clean);
    if (m2) return parseInt(m2[1]);
    const m3 = /\b(\d+)\b/.exec(line.clean);
    if (m3) return parseInt(m3[1]);
  }
  return 4;
}

// ─── Tempo ────────────────────────────────────────────────────────────────────

function extractTime(lines: Line[]): {
  total: number;
  prep?: number;
  cook?: number;
} {
  let prep: number | undefined;
  let cook: number | undefined;
  let total: number | undefined;

  const toMinutes = (val: number, unit: string): number =>
    /^h/i.test(unit) && !/min/i.test(unit) ? val * 60 : val;

  for (const line of lines) {
    const c = line.clean.toLowerCase();
    const matches = [
      ...c.matchAll(/(\d+)\s*(h(?:r|our)?s?|or[ae]|min(?:ut[ei]s?)?|minut[eo])/gi),
    ];
    for (const tm of matches) {
      const val = toMinutes(parseInt(tm[1]), tm[2]);
      if (/prep|prepara/i.test(c))        prep  = (prep  ?? 0) + val;
      else if (/cook|cottura|cotto/i.test(c)) cook  = (cook  ?? 0) + val;
      else if (/total[e]?/i.test(c))      total = (total ?? 0) + val;
      else                                 total = (total ?? 0) + val;
    }
  }

  return { total: total ?? (prep ?? 0) + (cook ?? 0), prep, cook };
}

// ─── Titolo ───────────────────────────────────────────────────────────────────

function extractTitle(titleLines: Line[], allLines: Line[]): string {
  const src = titleLines[0] ?? allLines[0];
  if (!src) return "Nuova ricetta";
  return src.clean
    .replace(/^#+\s*/, "")
    .replace(/^ricetta:\s*/i, "")
    .trim()
    .slice(0, 120);
}

// ─── Tag automatici ───────────────────────────────────────────────────────────

function autoTags(totalTime: number, lang: RecipeLanguage): string[] {
  const tags: string[] = [];
  if (lang === "it") tags.push("italiana");
  else if (lang === "en") tags.push("internazionale");
  else if (lang === "ja") tags.push("giapponese");
  if (totalTime > 0 && totalTime <= 30) tags.push("veloce");
  if (totalTime > 90) tags.push("elaborata");
  return tags;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

/**
 * Analizza un testo libero di ricetta → ParsedResult strutturata.
 * Client-side, sincrono, zero dipendenze esterne.
 */
export function parseRecipe(text: string): ParsedResult {
  if (!text.trim()) {
    return {
      title: "Nuova ricetta",
      yield: 4,
      totalTime: 0,
      ingredients: [],
      steps: [],
      tags: [],
      language: "it",
      warnings: ["Nessun contenuto da analizzare"],
    };
  }

  const lang     = detectLanguage(text);
  const lines    = tokenize(text);
  const sections = detectSections(lines);

  const title         = extractTitle(sections.titleLines, lines);
  const { total, prep, cook } = extractTime(sections.timeLines);
  const yieldCount    = extractYield(sections.yieldLines);

  const ingredients = sections.ingredientLines
    .map((l) => processIngredient(l, lang))
    .filter((i) => i.name.length > 0);

  const steps    = extractSteps(sections.stepLines);
  const tags     = autoTags(total, lang);
  const warnings = ingredients
    .filter((i) => i.ambiguous)
    .map(
      (i) =>
        `"${i.name}" è un solido dato in volume (ml dopo conversione). Verifica la quantità.`
    );

  return {
    title,
    yield:     yieldCount,
    totalTime: total,
    prepTime:  prep,
    cookTime:  cook,
    ingredients,
    steps,
    tags,
    language:  lang,
    warnings,
  };
}
