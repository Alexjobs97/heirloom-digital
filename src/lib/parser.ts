/**
 * parser.ts — Smart Paste Parser v3.
 * Aggiunge: rilevamento blocchi === IT === / === JP === (output Gemini).
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

// ─── Bilingual split ─────────────────────────────────────────────────────────

/**
 * Riconosce blocchi === IT === e === JP === nel testo (output Gemini).
 * Ritorna { it, ja } oppure null se non ci sono marker.
 */
function splitBilingualSections(text: string): { it: string; ja: string } | null {
  const itRe = /===\s*IT\s*===/i;
  const jaRe = /===\s*JP\s*===/i;
  const hasIt = itRe.test(text);
  const hasJa = jaRe.test(text);
  if (!hasIt && !hasJa) return null;

  let itSection = "";
  let jaSection = "";

  if (hasIt && hasJa) {
    const itStart = text.search(itRe);
    const jaStart = text.search(jaRe);
    if (itStart < jaStart) {
      const afterIt  = text.slice(text.indexOf("\n", itStart) + 1);
      const jaInAfter = afterIt.search(jaRe);
      itSection = afterIt.slice(0, jaInAfter).trim();
      jaSection = afterIt.slice(afterIt.indexOf("\n", jaInAfter) + 1).trim();
    } else {
      const afterJa  = text.slice(text.indexOf("\n", jaStart) + 1);
      const itInAfter = afterJa.search(itRe);
      jaSection = afterJa.slice(0, itInAfter).trim();
      itSection = afterJa.slice(afterJa.indexOf("\n", itInAfter) + 1).trim();
    }
  } else if (hasIt) {
    const pos = text.search(itRe);
    itSection = text.slice(text.indexOf("\n", pos) + 1).trim();
  } else {
    const pos = text.search(jaRe);
    jaSection = text.slice(text.indexOf("\n", pos) + 1).trim();
  }

  return { it: itSection, ja: jaSection };
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

// ─── Strip decorative Gemini lines ───────────────────────────────────────────

function stripGeminiDecorations(lines: Line[]): Line[] {
  return lines
    .filter((l) => !/^[─\-─═━=─✦]+$/.test(l.clean))
    .map((l) => ({
      ...l,
      clean: l.clean
        .replace(/^🍽️\s*/, "")
        .replace(/^👥\s*/, "")
        .replace(/^⏱\s*/, "")
        .trim(),
    }))
    .filter((l) => l.clean.length > 0);
}

// ─── Section constants ────────────────────────────────────────────────────────

const INGREDIENT_HEADERS =
  /^(ingredient[si]?|what you('ll| will)? need|ingredienti|occorrente|serve[rà]|cosa (ti |vi )?serve|lista della spesa|材料|食材):?\s*$/i;

const STEP_HEADERS =
  /^(instruction[s]?|direction[s]?|method|preparation|procedure|steps?|how to (make|prepare)|procedimento|preparazione|istruzioni|svolgimento|passo a passo|come si (fa|prepara)|procedura|modo di (fare|preparare)|作り方|手順):?\s*$/i;

const YIELD_RE =
  /\b(serves?|servings?|yield[s]?|portions?|porzioni|dosi?|persone|per\s+\d|分量|人前|人分)\b|\b(\d+)\s*(persone|porzioni|porzione|dose|dosi|人前|人分)\b|\b(makes?|yields?)\s+(\d+)/i;

const TIME_RE =
  /\b(prep(aration)?\s*time|cook(ing)?\s*time|total\s*time|tempo\s*(totale|preparazione|cottura)|時間)|\b\d+\s*(h|hr[s]?|hour[s]?|ore|ora|min(?:ut[ei]s?)?|minuti?|分)\b/i;

const NUMBERED_RE = /^\d+[.)]\s+/;
const BULLET_RE   = /^[-•*·▪▸→✓✔]\s+/;

const ALL_UNIT_KEYS = [
  ...Object.keys(VOLUME_TO_ML),
  ...Object.keys(WEIGHT_TO_G),
  ...Object.keys(ITALIAN_VOLUME_TO_ML),
  "q.b.", "qb", "a piacere", "適量",
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

const COOKING_VERBS =
  /\b(mescola|aggiungi|cuoci|porta|versa|taglia|unisci|scalda|lascia|togli|incorpora|frulla|sbatti|grattugia|inforna|rosola|soffriggi|preriscalda|amalgama|impasta|stendi|copri|riposa|sgocciola|scola|trita|affetta|pela|gratta|spolvera|condisci|decora|servi|mix|add|cook|heat|stir|pour|bake|boil|simmer|roast|fry|chop|blend|whisk|combine|place|remove|transfer|preheat|season|serve|fold|knead|drain|slice|peel|grate|sprinkle|炒め|茹で|加え|混ぜ|煮|焼|切|入れ)\b/i;

// ─── Section detector ─────────────────────────────────────────────────────────

function looksLikeIngredient(line: Line): boolean {
  const c = line.clean;
  if (c.length > 100) return false;
  if (/^[\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/.test(c) && !/^\d+\.\s/.test(c)) return true;
  if (BULLET_RE.test(c) && c.length < 80) return true;
  if (UNIT_RE.test(c) && !COOKING_VERBS.test(c) && c.length < 80) return true;
  return false;
}

function looksLikeStep(line: Line): boolean {
  const c = line.clean;
  if (NUMBERED_RE.test(c) && c.length > 15) return true;
  if (c.length > 60 && COOKING_VERBS.test(c)) return true;
  if (c.length > 80 && /^[A-ZÁÉÍÓÚ\u3041-\u30FF\u4E00-\u9FAF]/.test(c)) return true;
  return false;
}

function detectSections(lines: Line[]): DetectedSections {
  const out: DetectedSections = {
    titleLines: [], yieldLines: [], timeLines: [],
    ingredientLines: [], stepLines: [],
  };

  type Mode = "unknown" | "ingredients" | "steps";
  let mode: Mode = "unknown";
  let titleDone = false;

  const hasExplicitHeaders = lines.some(
    (l) => INGREDIENT_HEADERS.test(l.clean) || STEP_HEADERS.test(l.clean)
  );

  for (const line of lines) {
    const c = line.clean;
    if (!titleDone && !INGREDIENT_HEADERS.test(c) && !STEP_HEADERS.test(c) &&
        !NUMBERED_RE.test(c) && !YIELD_RE.test(c)) {
      out.titleLines.push(line);
      titleDone = true;
      continue;
    }
    titleDone = true;

    if (INGREDIENT_HEADERS.test(c)) { mode = "ingredients"; continue; }
    if (STEP_HEADERS.test(c))       { mode = "steps";       continue; }

    if (YIELD_RE.test(c)) out.yieldLines.push(line);
    if (TIME_RE.test(c))  out.timeLines.push(line);

    if (mode === "ingredients") {
      if (hasExplicitHeaders && looksLikeStep(line) && !looksLikeIngredient(line)) {
        mode = "steps";
        out.stepLines.push(line);
      } else {
        out.ingredientLines.push(line);
      }
      continue;
    }
    if (mode === "steps") { out.stepLines.push(line); continue; }

    if (looksLikeIngredient(line))  out.ingredientLines.push(line);
    else if (looksLikeStep(line))   out.stepLines.push(line);
  }

  return out;
}

// ─── Ingredient extractor ─────────────────────────────────────────────────────

function extractIngredientParts(raw: string): { qty: number | string; unit: string; name: string } {
  let s = raw.replace(/^[-•*·▪▸→✓✔]\s*/, "").trim();
  s = s.replace(/^\d+[.)]\s+/, "");

  if (/\bq\.?\s*b\.?\b|a\s+piacere|a\s+gusto|as\s+needed|to\s+taste|quanto\s+basta|適量/i.test(s)) {
    const name = s
      .replace(/,?\s*(q\.?\s*b\.?\b|a\s+piacere|a\s+gusto|as\s+needed|to\s+taste|quanto\s+basta|適量)/gi, "")
      .replace(/^[-–]\s*/, "").trim();
    return { qty: "q.b.", unit: "", name: name || s };
  }

  s = stripApproximation(s);

  const ATTACHED = /^([\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞][\d.,/\s½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]*?)([a-zA-Zàèéìòùç]+\.?)(\s+.+)?$/i;
  const ma = ATTACHED.exec(s);
  if (ma) {
    const rawQty = ma[1].trim(); const rawUnit = ma[2].trim(); const rawName = (ma[3] ?? "").trim();
    if (classifyUnit(rawUnit) !== "unknown" && rawName) {
      const parsedQty = parseFraction(rawQty);
      return { qty: parsedQty !== null ? parsedQty : rawQty, unit: rawUnit, name: rawName.replace(/^(di|d'|of)\s+/i, "").trim() };
    }
  }

  const SPACED = /^([\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞][\d\s.,/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞-]*?)\s+([a-zA-Zàèéìòùç]+\.?)\s+(.+)$/i;
  const mb = SPACED.exec(s);
  if (mb) {
    const rawQty = mb[1].trim(); const rawUnit = mb[2].trim(); const rawName = mb[3].trim();
    if (classifyUnit(rawUnit) !== "unknown") {
      const parsedQty = parseFraction(rawQty);
      return { qty: parsedQty !== null ? parsedQty : rawQty, unit: rawUnit, name: rawName.replace(/^(di|d'|of)\s+/i, "").trim() };
    }
    const parsedQty = parseFraction(rawQty);
    return { qty: parsedQty !== null ? parsedQty : rawQty, unit: "", name: `${rawUnit} ${rawName}`.replace(/^(di|d'|of)\s+/i, "").trim() };
  }

  const NO_UNIT = /^([\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞][\d\s.,/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞-]*?)\s+(.+)$/i;
  const mc = NO_UNIT.exec(s);
  if (mc) {
    const rawQty = mc[1].trim();
    const parsedQty = parseFraction(rawQty);
    return { qty: parsedQty !== null ? parsedQty : rawQty, unit: "", name: mc[2].trim().replace(/^(di|d'|of)\s+/i, "") };
  }

  return { qty: "", unit: "", name: s };
}

function processIngredient(line: Line, lang: RecipeLanguage): RawIngredient {
  const { qty, unit, name } = extractIngredientParts(line.clean);
  if (typeof qty === "string") {
    return { raw: line.raw, qty, unit: "", name, canonicalId: findCanonicalId(name, lang === "ja" ? "ja" : lang === "en" ? "en" : "it") ?? "" };
  }
  const numQty = qty ?? 0;
  const converted = unit ? convertUnit(numQty, unit) : null;
  const finalQty  = converted ? converted.qty  : numQty;
  const finalUnit = converted ? converted.unit  : ("" as const);
  const canonicalId = findCanonicalId(name, lang === "ja" ? "ja" : lang === "en" ? "en" : "it") ?? "";
  const ambiguous = converted?.unit === "ml" && converted.wasConverted && canonicalId !== "" && isSolidIngredient(canonicalId);
  return { raw: line.raw, qty: finalQty, unit: finalUnit, name, canonicalId,
    convertedQty: converted?.wasConverted ? finalQty : undefined,
    convertedUnit: converted?.wasConverted ? finalUnit : undefined, ambiguous };
}

// ─── Step extractor ───────────────────────────────────────────────────────────

export const TIMER_REGEX =
  /(\d+(?:[.,]\d+)?)\s*(?:[-–]|to|a)?\s*(?:\d+\s*)?(?:–)?\s*(min(?:ut[ei]s?)?|minuti?|minut[eo]|ore?|hour[s]?|\bh\b|secondi?|second[s]?|\bsec\b|分|秒)/gi;

function cleanStep(s: string): string {
  return s.replace(/^\d+[.)]\s*/, "").replace(/^[-•*·]\s*/, "").trim();
}

function extractSteps(lines: Line[]): string[] {
  if (lines.length === 0) return [];
  if (lines.filter((l) => NUMBERED_RE.test(l.clean)).length >= lines.length / 2) {
    return lines.map((l) => cleanStep(l.clean)).filter((s) => s.length > 5);
  }
  const steps: string[] = [];
  let buf = "";
  for (const line of lines) {
    const c = cleanStep(line.clean);
    if (!c) continue;
    const startsNew = /^[A-ZÁÉÍÓÚ\u3041-\u30FF\u4E00-\u9FAF]/.test(c) && buf.length > 0 && /[.!?。！？]$/.test(buf.trimEnd());
    if (startsNew) { steps.push(buf.trim()); buf = c; }
    else buf = buf ? `${buf} ${c}` : c;
  }
  if (buf.trim()) steps.push(buf.trim());
  return steps.filter((s) => s.length > 5);
}

// ─── Yield + time ─────────────────────────────────────────────────────────────

function extractYield(lines: Line[]): number {
  for (const line of lines) {
    const m = /(\d+)\s*(persone|porzioni|porzione|persona|servings?|portions?|yields?|dosi?|人前|人分)/.exec(line.clean);
    if (m) return parseInt(m[1]);
    const m2 = /\bpe?r?\s+(\d+)\b/i.exec(line.clean);
    if (m2) return parseInt(m2[1]);
    const m3 = /\b(\d+)\b/.exec(line.clean);
    if (m3) return parseInt(m3[1]);
  }
  return 4;
}

function extractTime(lines: Line[]): { total: number; prep?: number; cook?: number } {
  let prep: number | undefined; let cook: number | undefined; let total: number | undefined;
  const toMin = (val: number, unit: string): number =>
    /^h/i.test(unit) && !/min/i.test(unit) ? val * 60 : val;
  for (const line of lines) {
    const c = line.clean.toLowerCase();
    const matches = [...c.matchAll(/(\d+)\s*(h(?:r|our)?s?|or[ae]|min(?:ut[ei]s?)?|minut[eo]|分)/gi)];
    for (const tm of matches) {
      const val = toMin(parseInt(tm[1]), tm[2]);
      if (/prep|prepara/i.test(c))            prep  = (prep  ?? 0) + val;
      else if (/cook|cottura|cotto/i.test(c)) cook  = (cook  ?? 0) + val;
      else                                     total = (total ?? 0) + val;
    }
  }
  return { total: total ?? (prep ?? 0) + (cook ?? 0), prep, cook };
}

// ─── Core single-block parse ──────────────────────────────────────────────────

function parseSingleBlock(text: string, lang: RecipeLanguage) {
  const rawLines = tokenize(text);
  const lines    = stripGeminiDecorations(rawLines);
  const sections = detectSections(lines);

  const title = (sections.titleLines[0] ?? lines[0])?.clean
    .replace(/^#+\s*/, "").replace(/^ricetta:\s*/i, "").trim().slice(0, 120) ?? "Nuova ricetta";

  const { total, prep, cook } = extractTime(sections.timeLines);
  const yieldCount = extractYield(sections.yieldLines);
  const ingredients = sections.ingredientLines.map((l) => processIngredient(l, lang)).filter((i) => i.name.length > 0);
  const steps    = extractSteps(sections.stepLines);
  const warnings = ingredients.filter((i) => i.ambiguous).map((i) => `"${i.name}" è un solido dato in volume. Verifica.`);

  const tags: string[] = [];
  if (lang === "it") tags.push("italiana");
  else if (lang === "en") tags.push("internazionale");
  else if (lang === "ja") tags.push("giapponese");
  if (total > 0 && total <= 30) tags.push("veloce");
  if (total > 90) tags.push("elaborata");

  return { title, yield: yieldCount, totalTime: total, prepTime: prep, cookTime: cook, ingredients, steps, tags, warnings };
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export function parseRecipe(text: string): ParsedResult {
  if (!text.trim()) {
    return { title: "Nuova ricetta", yield: 4, totalTime: 0, ingredients: [], steps: [], tags: [], language: "it", warnings: ["Nessun contenuto da analizzare"], isBilingual: false };
  }

  // Prova split bilingue
  const bilingual = splitBilingualSections(text);
  if (bilingual && (bilingual.it || bilingual.ja)) {
    const itBlock = bilingual.it ? parseSingleBlock(bilingual.it, "it") : parseSingleBlock(bilingual.ja, "ja");
    const jaBlock = bilingual.ja ? parseSingleBlock(bilingual.ja, "ja") : null;

    return {
      ...itBlock,
      language:    "it",
      isBilingual: !!jaBlock,
      ja: jaBlock ? { title: jaBlock.title, ingredients: jaBlock.ingredients, steps: jaBlock.steps } : undefined,
    };
  }

  // Parsing standard
  const lang   = detectLanguage(text);
  const result = parseSingleBlock(text, lang);
  return { ...result, language: lang, isBilingual: false };
}