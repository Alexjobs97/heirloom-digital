/**
 * placeholderColor.ts — Colore placeholder condiviso tra RecipeCard, EditRecipePage, RecipeDetailPage.
 * Flat, nessun gradiente, nessuna lettera.
 */

// Day mode — 20 colori vivaci e moderni
export const COLORS_DAY = [
  "#F0A830","#E8345A","#35A3A2","#4092FF","#E8702A",
  "#5BAD72","#C45AA8","#3AB8D0","#D4A020","#E85070",
  "#2EC4B6","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4",
  "#FFEAA7","#DDA0DD","#98D8C8","#F7DC6F","#BB8FCE",
];

// Night mode — jewel tones profondi
export const COLORS_NIGHT = [
  "#B8710A","#8A1830","#0E7A79","#1848A8","#A84010",
  "#287A40","#782050","#0A6888","#907010","#881038",
  "#0E7A70","#882020","#1A7070","#1858A0","#287050",
  "#888020","#681868","#286858","#887020","#582870",
];

export function getPlaceholderColor(title: string, dark = false): string {
  const colors = dark ? COLORS_NIGHT : COLORS_DAY;
  const hash   = [...title.toLowerCase()].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  return colors[Math.abs(hash) % colors.length];
}
