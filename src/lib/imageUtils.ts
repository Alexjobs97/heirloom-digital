/**
 * imageUtils.ts — Compressione immagini lato client prima del salvataggio.
 *
 * Riduce le foto a max 900px (lato lungo) e qualità JPEG 72%.
 * Una foto da 5 MB diventa ~60-120 KB — 50x più leggera.
 * Questo rende lo scrolling fluido anche con 100+ ricette.
 */

const MAX_SIZE = 900;   // px lato lungo
const QUALITY  = 0.72;  // JPEG quality (0–1)

/**
 * Comprime un file immagine e ritorna una data URL JPEG compressa.
 * Usa un canvas off-screen — zero dipendenze esterne.
 */
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width: w, height: h } = img;
      let nw = w, nh = h;

      // Scala proporzionalmente se supera MAX_SIZE
      if (w > MAX_SIZE || h > MAX_SIZE) {
        if (w >= h) { nw = MAX_SIZE; nh = Math.round(h * MAX_SIZE / w); }
        else        { nh = MAX_SIZE; nw = Math.round(w * MAX_SIZE / h); }
      }

      const canvas = document.createElement("canvas");
      canvas.width  = nw;
      canvas.height = nh;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas non disponibile")); return; }

      ctx.drawImage(img, 0, 0, nw, nh);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Immagine non valida")); };
    img.src = url;
  });
}

/**
 * Stima la dimensione di una data URL in KB.
 */
export function dataUrlSizeKB(dataUrl: string): number {
  // base64 → ~75% dell'originale + overhead header
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.round((base64.length * 0.75) / 1024);
}
