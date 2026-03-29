/**
 * io-enhanced.ts — Funzioni avanzate per export/import ricette.
 * Include: export come testo formattato, import da URL, gestione immagini.
 */

import type { Recipe } from "../types";

// ─── Export come testo formattato per clipboard ──────────────────────────────

export function formatRecipeAsText(recipe: Recipe, appName = "The Heirloom Digital"): string {
  const lines: string[] = [];
  
  // Titolo
  lines.push(`🍳 ${recipe.title}`);
  lines.push("=".repeat(recipe.title.length + 4));
  lines.push("");
  
  // Meta informazioni
  const meta: string[] = [];
  if (recipe.yield) meta.push(`${recipe.yield} porzioni`);
  if (recipe.totalTime > 0) meta.push(`${recipe.totalTime} min`);
  if (recipe.prepTime) meta.push(`prep: ${recipe.prepTime} min`);
  if (recipe.cookTime) meta.push(`cottura: ${recipe.cookTime} min`);
  if (meta.length > 0) {
    lines.push(`⏱️  ${meta.join(" • ")}`);
    lines.push("");
  }
  
  // Ingredienti
  lines.push("🛒 INGREDIENTI");
  lines.push("-".repeat(12));
  for (const ing of recipe.ingredients) {
    const qty = typeof ing.qty === "number" 
      ? (Number.isInteger(ing.qty) ? String(ing.qty) : ing.qty.toFixed(2).replace(/\.?0+$/, ''))
      : ing.qty;
    const unit = ing.unit ? ` ${ing.unit}` : "";
    const note = ing.note ? ` (${ing.note})` : "";
    lines.push(`• ${qty}${unit} ${ing.displayName}${note}`);
  }
  lines.push("");
  
  // Procedimento
  lines.push("👨‍🍳 PROCEDIMENTO");
  lines.push("-".repeat(14));
  recipe.steps.forEach((step, i) => {
    lines.push(`${i + 1}. ${step}`);
  });
  lines.push("");
  
  // Note
  if (recipe.notes) {
    lines.push("📝 NOTE");
    lines.push("-".repeat(6));
    lines.push(recipe.notes);
    lines.push("");
  }
  
  // Fonte
  if (recipe.source) {
    lines.push(`🔗 Fonte: ${recipe.source}`);
    lines.push("");
  }
  
  // Tags
  if (recipe.tags.length > 0) {
    lines.push(`🏷️  Tag: ${recipe.tags.join(", ")}`);
    lines.push("");
  }
  
  // Footer
  lines.push(`---`);
  lines.push(`Esportato da ${appName}`);
  
  return lines.join("\n");
}

export async function copyRecipeToClipboard(recipe: Recipe): Promise<void> {
  const text = formatRecipeAsText(recipe);
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback per browser vecchi
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// ─── Import da URL (fetch HTML e estrazione testo) ───────────────────────────

export async function fetchRecipeFromUrl(url: string): Promise<string> {
  // Usa un proxy CORS se necessario (es. allorigins.win)
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error("Impossibile recuperare l'URL");
  }
  
  const data = await response.json();
  const html = data.contents as string;
  
  // Estrai il testo dal HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  // Rimuovi script, style, nav, footer, header
  doc.querySelectorAll("script, style, nav, footer, header, aside, .ad, .advertisement").forEach(el => el.remove());
  
  // Estrai il testo principale
  let text = doc.body.textContent || "";
  
  // Pulisci whitespace multipli
  text = text.replace(/\s+/g, " ").trim();
  
  return text;
}

// ─── Gestione immagini (upload e preview) ────────────────────────────────────

export interface ImageUploadResult {
  dataUrl: string;
  width: number;
  height: number;
  size: number;
}

export async function uploadImage(file: File, maxSizeMB = 2): Promise<ImageUploadResult> {
  // Controlla dimensione
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    throw new Error(`Immagine troppo grande. Massimo ${maxSizeMB}MB.`);
  }
  
  // Controlla tipo
  if (!file.type.startsWith("image/")) {
    throw new Error("Il file deve essere un'immagine.");
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          dataUrl: e.target?.result as string,
          width: img.width,
          height: img.height,
          size: file.size,
        });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function loadImageFromUrl(url: string): Promise<ImageUploadResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      // Crea canvas per convertire in data URL
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Impossibile creare canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      
      resolve({
        dataUrl: canvas.toDataURL("image/jpeg", 0.85),
        width: img.width,
        height: img.height,
        size: Math.round((canvas.toDataURL("image/jpeg", 0.85).length * 3) / 4),
      });
    };
    
    img.onerror = () => reject(new Error("Impossibile caricare immagine dall'URL"));
    img.src = url;
  });
}

// ─── Ottimizzazione immagine (resize e compressione) ─────────────────────────

export async function optimizeImage(
  dataUrl: string,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Calcola nuove dimensioni mantenendo aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Impossibile creare canvas"));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// ─── Export tutte le ricette come JSON (backup completo) ─────────────────────

export interface BackupData {
  version: number;
  exportedAt: string;
  appVersion: string;
  recipeCount: number;
  recipes: Recipe[];
}

export async function exportAllRecipesBackup(recipes: Recipe[]): Promise<void> {
  const backup: BackupData = {
    version: 2,
    exportedAt: new Date().toISOString(),
    appVersion: "2.0.0",
    recipeCount: recipes.length,
    recipes,
  };
  
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `heirloom_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function validateBackup(data: unknown): data is BackupData {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.version === "number" &&
    Array.isArray(obj.recipes) &&
    obj.recipes.every((r: unknown) => 
      r && typeof r === "object" && 
      "id" in r && "title" in r && "ingredients" in r && "steps" in r
    )
  );
}
