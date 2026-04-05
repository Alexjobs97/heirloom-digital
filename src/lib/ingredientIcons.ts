/**
 * Ingredient image utilities using Spoonacular CDN.
 * 
 * SUSTAINABLE SOLUTION - No local PNG storage needed!
 * Spoonacular provides free ingredient images via CDN (no API key required for images).
 * 
 * Usage: getIngredientImageUrl("pomodoro") => "https://spoonacular.com/cdn/ingredients_100x100/tomato.png"
 */

const SPOONACULAR_CDN = "https://spoonacular.com/cdn/ingredients_100x100";

// Map Italian/Japanese ingredient names to Spoonacular-compatible English names
const INGREDIENT_MAP: Record<string, string> = {
  // Italian basics
  "pomodoro": "tomato", "pomodori": "tomatoes", "cipolla": "onion", "cipolle": "onion",
  "aglio": "garlic", "olio d'oliva": "olive-oil", "olio di oliva": "olive-oil", "olio evo": "olive-oil",
  "sale": "salt", "pepe": "pepper", "pepe nero": "black-pepper", "burro": "butter",
  "farina": "flour", "farina 00": "flour", "zucchero": "sugar", "uova": "egg", "uovo": "egg",
  "latte": "milk", "acqua": "water", "panna": "cream", "panna fresca": "heavy-cream",
  
  // Italian cheeses
  "parmigiano": "parmesan", "parmigiano reggiano": "parmesan", "pecorino": "pecorino",
  "pecorino romano": "pecorino", "mozzarella": "mozzarella", "ricotta": "ricotta",
  "mascarpone": "mascarpone", "gorgonzola": "gorgonzola", "grana padano": "parmesan",
  "fontina": "fontina", "taleggio": "taleggio", "provolone": "provolone",
  
  // Italian herbs & spices
  "basilico": "basil", "prezzemolo": "parsley", "rosmarino": "rosemary", "origano": "oregano",
  "timo": "thyme", "salvia": "sage", "alloro": "bay-leaves", "maggiorana": "marjoram",
  "menta": "mint", "erba cipollina": "chives", "peperoncino": "red-pepper-flakes",
  "noce moscata": "nutmeg", "cannella": "cinnamon", "chiodi di garofano": "cloves",
  "zafferano": "saffron", "curcuma": "turmeric", "zenzero": "ginger",
  
  // Italian vegetables
  "carota": "carrot", "carote": "carrots", "sedano": "celery", "patata": "potato", "patate": "potatoes",
  "zucchina": "zucchini", "zucchine": "zucchini", "melanzana": "eggplant", "melanzane": "eggplant",
  "peperone": "bell-pepper", "peperoni": "bell-pepper", "spinaci": "spinach",
  "funghi": "mushrooms", "fungo": "mushroom", "porcini": "porcini-mushrooms",
  "carciofi": "artichoke", "carciofo": "artichoke", "asparagi": "asparagus",
  "broccoli": "broccoli", "cavolfiore": "cauliflower", "cavolo": "cabbage",
  "finocchio": "fennel", "radicchio": "radicchio", "rucola": "arugula",
  "lattuga": "lettuce", "piselli": "peas", "fagiolini": "green-beans",
  "fagioli": "white-beans", "ceci": "chickpeas", "lenticchie": "lentils",
  
  // Italian pasta & grains
  "pasta": "pasta", "spaghetti": "spaghetti", "penne": "penne", "rigatoni": "rigatoni",
  "fusilli": "fusilli", "farfalle": "farfalle", "tagliatelle": "tagliatelle",
  "lasagne": "lasagna-noodles", "gnocchi": "gnocchi", "riso": "rice",
  "riso arborio": "arborio-rice", "riso carnaroli": "arborio-rice",
  "pane": "bread", "pangrattato": "breadcrumbs", "polenta": "polenta",
  
  // Italian meats
  "pollo": "chicken", "petto di pollo": "chicken-breast", "manzo": "beef",
  "maiale": "pork", "vitello": "veal", "agnello": "lamb", "coniglio": "rabbit",
  "pancetta": "pancetta", "guanciale": "pancetta", "prosciutto": "ham",
  "prosciutto cotto": "ham", "prosciutto crudo": "prosciutto",
  "speck": "speck", "salsiccia": "italian-sausage", "salame": "salami",
  "mortadella": "mortadella", "bresaola": "bresaola",
  
  // Italian seafood
  "pesce": "fish", "salmone": "salmon", "tonno": "tuna", "merluzzo": "cod",
  "branzino": "sea-bass", "orata": "sea-bream", "sogliola": "sole",
  "gamberi": "shrimp", "gamberetti": "shrimp", "scampi": "langoustine",
  "vongole": "clams", "cozze": "mussels", "calamari": "squid",
  "polpo": "octopus", "acciughe": "anchovies", "baccalà": "salt-cod",
  
  // Italian fruits
  "limone": "lemon", "limoni": "lemons", "arancia": "orange", "arance": "oranges",
  "mela": "apple", "mele": "apples", "pera": "pear", "pere": "pears",
  "fragola": "strawberry", "fragole": "strawberries", "lamponi": "raspberries",
  "mirtilli": "blueberries", "uva": "grapes", "fichi": "figs", "fico": "fig",
  "pesca": "peach", "pesche": "peaches", "albicocca": "apricot", "ciliegia": "cherry",
  "banana": "banana", "ananas": "pineapple", "melone": "melon", "anguria": "watermelon",
  
  // Italian pantry
  "vino bianco": "white-wine", "vino rosso": "red-wine", "aceto": "vinegar",
  "aceto balsamico": "balsamic-vinegar", "brodo": "chicken-broth",
  "brodo di pollo": "chicken-broth", "brodo vegetale": "vegetable-broth",
  "dado": "bouillon-cubes", "passata": "tomato-sauce", "passata di pomodoro": "tomato-sauce",
  "pelati": "canned-tomatoes", "pomodori pelati": "canned-tomatoes",
  "concentrato": "tomato-paste", "concentrato di pomodoro": "tomato-paste",
  "capperi": "capers", "olive": "olives", "olive nere": "black-olives",
  "olive verdi": "green-olives", "pinoli": "pine-nuts", "noci": "walnuts",
  "mandorle": "almonds", "nocciole": "hazelnuts", "pistacchi": "pistachios",
  "senape": "mustard", "maionese": "mayonnaise", "miele": "honey",
  "lievito": "yeast", "lievito di birra": "yeast", "bicarbonato": "baking-soda",
  "cacao": "cocoa-powder", "cioccolato": "chocolate", "cioccolato fondente": "dark-chocolate",
  "vaniglia": "vanilla", "estratto di vaniglia": "vanilla-extract",
  
  // Japanese common ingredients
  "トマト": "tomato", "玉ねぎ": "onion", "にんにく": "garlic", "オリーブオイル": "olive-oil",
  "塩": "salt", "こしょう": "pepper", "バター": "butter", "小麦粉": "flour",
  "砂糖": "sugar", "卵": "egg", "牛乳": "milk", "パルメザン": "parmesan",
  "バジル": "basil", "パセリ": "parsley", "人参": "carrot", "じゃがいも": "potato",
  "ズッキーニ": "zucchini", "なす": "eggplant", "ほうれん草": "spinach",
  "きのこ": "mushroom", "米": "rice", "パスタ": "pasta", "パン": "bread",
  "鶏肉": "chicken", "牛肉": "beef", "豚肉": "pork", "魚": "fish",
  "えび": "shrimp", "レモン": "lemon", "りんご": "apple", "生クリーム": "cream",
};

// Canonical IDs that map directly (snake_case to hyphen)
const CANONICAL_DIRECT_MAP: Record<string, string> = {
  "olive_oil": "olive-oil",
  "black_pepper": "black-pepper",
  "tomato_paste": "tomato-paste",
  "tomato_sauce": "tomato-sauce",
  "heavy_cream": "heavy-cream",
  "sour_cream": "sour-cream",
  "cream_cheese": "cream-cheese",
  "bay_leaves": "bay-leaves",
  "red_pepper_flakes": "red-pepper-flakes",
  "balsamic_vinegar": "balsamic-vinegar",
  "white_wine": "white-wine",
  "red_wine": "red-wine",
  "chicken_broth": "chicken-broth",
  "vegetable_broth": "vegetable-broth",
  "beef_broth": "beef-broth",
  "pine_nuts": "pine-nuts",
  "cocoa_powder": "cocoa-powder",
  "baking_soda": "baking-soda",
  "baking_powder": "baking-powder",
  "vanilla_extract": "vanilla-extract",
  "dark_chocolate": "dark-chocolate",
  "milk_chocolate": "milk-chocolate",
  "white_chocolate": "white-chocolate",
  "bell_pepper": "bell-pepper",
  "green_beans": "green-beans",
  "cherry_tomatoes": "cherry-tomatoes",
  "sun_dried_tomatoes": "sun-dried-tomatoes",
  "italian_sausage": "italian-sausage",
  "chicken_breast": "chicken-breast",
  "ground_beef": "ground-beef",
  "arborio_rice": "arborio-rice",
};

/**
 * Get the Spoonacular CDN URL for an ingredient image.
 * Automatically translates Italian/Japanese to English.
 */
export function getIngredientImageUrl(displayName: string, canonicalId?: string): string | null {
  // 1. Try canonical ID mapping first
  if (canonicalId) {
    const mapped = CANONICAL_DIRECT_MAP[canonicalId];
    if (mapped) {
      return `${SPOONACULAR_CDN}/${mapped}.png`;
    }
    // Try direct canonical (replace _ with -)
    const urlName = canonicalId.replace(/_/g, "-");
    return `${SPOONACULAR_CDN}/${urlName}.png`;
  }
  
  // 2. Try translation map
  const normalized = displayName.toLowerCase().trim();
  const translated = INGREDIENT_MAP[normalized];
  if (translated) {
    return `${SPOONACULAR_CDN}/${translated}.png`;
  }
  
  // 3. Try as-is for English ingredients
  const urlSafe = normalized.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (urlSafe.length > 2) {
    return `${SPOONACULAR_CDN}/${urlSafe}.png`;
  }
  
  return null;
}

/**
 * Fallback colors for ingredients without images
 */
const FALLBACK_COLORS = [
  { bg: "#FFECD2", text: "#8B5A2B" }, // Warm peach
  { bg: "#D4EDDA", text: "#2D5A3D" }, // Fresh green  
  { bg: "#FFF3CD", text: "#856404" }, // Butter yellow
  { bg: "#E2D4F0", text: "#5A3D7A" }, // Soft lavender
  { bg: "#D4E5F7", text: "#2D5A7A" }, // Cool sky
  { bg: "#F5E6D3", text: "#6B5344" }, // Warm sand
  { bg: "#FFE4E1", text: "#8B4A4A" }, // Soft coral
  { bg: "#E8F5E9", text: "#4A6B4A" }, // Mint green
];

export function getIngredientFallbackStyle(name: string) {
  const idx = name.charCodeAt(0) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[idx];
}
