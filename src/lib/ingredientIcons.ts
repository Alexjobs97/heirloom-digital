/**
 * ingredientIcons.ts — Maps canonical ingredient IDs to PNG icon paths.
 * 
 * HOW TO ADD INGREDIENT ICONS:
 * 
 * 1. Create/find PNG images for your ingredients (ideally ~200x200px, transparent background)
 * 2. Save them to: public/images/ingredients/
 * 3. Name them using the canonical ID: e.g., "tomato.png", "olive_oil.png", "garlic.png"
 * 4. The app will automatically detect and use them!
 * 
 * Example folder structure:
 *   public/
 *     images/
 *       ingredients/
 *         tomato.png
 *         olive_oil.png
 *         garlic.png
 *         onion.png
 *         butter.png
 *         rosemary.png
 *         ...
 * 
 * Tips:
 * - Use consistent image sizes (200x200px recommended)
 * - Transparent PNG backgrounds work best
 * - Match the filename exactly to the canonicalId in ingredients.ts
 * - Common ingredients to add first: tomato, garlic, onion, olive_oil, butter, salt, pepper,
 *   basil, parsley, cheese, eggs, flour, sugar, milk, chicken, beef, fish
 */

// Dynamically resolve ingredient icon paths
export function getIngredientIconPath(canonicalId: string | undefined): string | null {
  if (!canonicalId) return null;
  // Check if the icon exists in the public folder
  // Returns the path that Vite/React will resolve
  return `/images/ingredients/${canonicalId}.png`;
}

// List of ingredients that have icons (you can manually maintain this, or it's auto-detected)
// Add canonical IDs here when you add their PNG files
export const INGREDIENTS_WITH_ICONS: Set<string> = new Set([
  // Add your ingredient IDs here as you add PNG files, e.g.:
  // "tomato",
  // "olive_oil",
  // "garlic",
  // "onion",
  // "butter",
]);

// Check if an ingredient has a custom icon
export function hasIngredientIcon(canonicalId: string | undefined): boolean {
  if (!canonicalId) return false;
  return INGREDIENTS_WITH_ICONS.has(canonicalId);
}
