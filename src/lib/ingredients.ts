/**
 * ingredients.ts — Dizionario multilingua degli ingredienti.
 * 80+ ingredienti comuni con nomi in italiano, giapponese e inglese.
 * Supporta ricerca parziale case-insensitive e lookup bidirezionale.
 */

import type { IngredientDictionary } from "../types";

// ─── Dictionary ───────────────────────────────────────────────────────────────

export const INGREDIENT_DICTIONARY: IngredientDictionary = {
  // ── Cereali e farine ──────────────────────────────────────────────────────
  flour: {
    canonicalId: "flour",
    names: { it: ["farina", "farina 00", "farina di grano", "farina bianca"], ja: ["小麦粉", "薄力粉", "強力粉"], en: ["flour", "all-purpose flour", "plain flour", "wheat flour"] },
    defaultUnit: "g", isSolid: true,
  },
  bread_flour: {
    canonicalId: "bread_flour",
    names: { it: ["farina di forza", "farina manitoba", "farina 0"], ja: ["強力粉", "パン用粉"], en: ["bread flour", "strong flour", "manitoba flour"] },
    defaultUnit: "g", isSolid: true,
  },
  semolina: {
    canonicalId: "semolina",
    names: { it: ["semola", "semola di grano duro", "semolino"], ja: ["セモリナ粉", "デュラム粉"], en: ["semolina", "durum wheat", "semolina flour"] },
    defaultUnit: "g", isSolid: true,
  },
  rice: {
    canonicalId: "rice",
    names: { it: ["riso", "riso carnaroli", "riso arborio", "riso vialone nano", "riso basmati", "riso integrale"], ja: ["米", "ご飯", "白米", "玄米", "カルナローリ米"], en: ["rice", "arborio rice", "basmati rice", "brown rice", "white rice"] },
    defaultUnit: "g", isSolid: true,
  },
  pasta: {
    canonicalId: "pasta",
    names: { it: ["pasta", "spaghetti", "penne", "rigatoni", "fusilli", "tagliatelle", "linguine", "bucatini"], ja: ["パスタ", "スパゲッティ", "ペンネ"], en: ["pasta", "spaghetti", "penne", "rigatoni", "fusilli"] },
    defaultUnit: "g", isSolid: true,
  },
  breadcrumbs: {
    canonicalId: "breadcrumbs",
    names: { it: ["pangrattato", "pane grattugiato", "mollica di pane"], ja: ["パン粉", "ブレッドクラム"], en: ["breadcrumbs", "bread crumbs", "panko"] },
    defaultUnit: "g", isSolid: true,
  },

  // ── Latticini ─────────────────────────────────────────────────────────────
  milk: {
    canonicalId: "milk",
    names: { it: ["latte", "latte intero", "latte parzialmente scremato", "latte scremato"], ja: ["牛乳", "ミルク", "全脂乳"], en: ["milk", "whole milk", "full fat milk", "skimmed milk"] },
    defaultUnit: "ml", isSolid: false,
  },
  cream: {
    canonicalId: "cream",
    names: { it: ["panna", "panna da cucina", "panna fresca", "panna liquida", "panna da montare"], ja: ["生クリーム", "クリーム", "ホイップクリーム"], en: ["cream", "heavy cream", "whipping cream", "double cream", "single cream"] },
    defaultUnit: "ml", isSolid: false,
  },
  butter: {
    canonicalId: "butter",
    names: { it: ["burro", "burro salato", "burro non salato"], ja: ["バター", "有塩バター", "無塩バター"], en: ["butter", "salted butter", "unsalted butter"] },
    defaultUnit: "g", isSolid: true,
  },
  parmesan: {
    canonicalId: "parmesan",
    names: { it: ["parmigiano", "parmigiano reggiano", "grana padano", "parmigiano grattugiato"], ja: ["パルミジャーノ", "パルメザン", "グラナパダーノ"], en: ["parmesan", "parmigiano reggiano", "grana padano", "parmesan cheese"] },
    defaultUnit: "g", isSolid: true,
  },
  mozzarella: {
    canonicalId: "mozzarella",
    names: { it: ["mozzarella", "mozzarella di bufala", "fior di latte"], ja: ["モッツァレラ", "モッツァレッラ"], en: ["mozzarella", "mozzarella cheese", "buffalo mozzarella"] },
    defaultUnit: "g", isSolid: true,
  },
  ricotta: {
    canonicalId: "ricotta",
    names: { it: ["ricotta", "ricotta fresca", "ricotta di pecora"], ja: ["リコッタ", "リコッタチーズ"], en: ["ricotta", "ricotta cheese"] },
    defaultUnit: "g", isSolid: true,
  },
  yogurt: {
    canonicalId: "yogurt",
    names: { it: ["yogurt", "yogurt greco", "yogurt bianco", "yogurt naturale"], ja: ["ヨーグルト", "プレーンヨーグルト", "ギリシャヨーグルト"], en: ["yogurt", "greek yogurt", "plain yogurt", "natural yogurt"] },
    defaultUnit: "g", isSolid: false,
  },
  egg: {
    canonicalId: "egg",
    names: { it: ["uovo", "uova", "tuorlo", "albume"], ja: ["卵", "たまご", "玉子", "卵黄", "卵白"], en: ["egg", "eggs", "yolk", "egg yolk", "white", "egg white"] },
    defaultUnit: "", isSolid: true,
  },

  // ── Oli e grassi ──────────────────────────────────────────────────────────
  olive_oil: {
    canonicalId: "olive_oil",
    names: { it: ["olio di oliva", "olio extravergine", "olio evo", "olio extravergine di oliva"], ja: ["オリーブオイル", "エクストラバージンオリーブオイル", "オリーブ油"], en: ["olive oil", "extra virgin olive oil", "evoo"] },
    defaultUnit: "ml", isSolid: false,
  },
  vegetable_oil: {
    canonicalId: "vegetable_oil",
    names: { it: ["olio di semi", "olio di girasole", "olio di arachidi", "olio vegetale"], ja: ["植物油", "サラダ油", "ひまわり油"], en: ["vegetable oil", "sunflower oil", "canola oil", "seed oil"] },
    defaultUnit: "ml", isSolid: false,
  },

  // ── Dolcificanti ──────────────────────────────────────────────────────────
  sugar: {
    canonicalId: "sugar",
    names: { it: ["zucchero", "zucchero semolato", "zucchero bianco", "zucchero fine"], ja: ["砂糖", "上白糖", "グラニュー糖", "白砂糖"], en: ["sugar", "white sugar", "granulated sugar", "caster sugar"] },
    defaultUnit: "g", isSolid: true,
  },
  brown_sugar: {
    canonicalId: "brown_sugar",
    names: { it: ["zucchero di canna", "zucchero bruno", "zucchero grezzo"], ja: ["黒砂糖", "ブラウンシュガー", "きび砂糖"], en: ["brown sugar", "dark brown sugar", "light brown sugar", "cane sugar"] },
    defaultUnit: "g", isSolid: true,
  },
  honey: {
    canonicalId: "honey",
    names: { it: ["miele", "miele d'acacia", "miele millefiori"], ja: ["蜂蜜", "はちみつ", "ハチミツ"], en: ["honey", "acacia honey"] },
    defaultUnit: "g", isSolid: false,
  },
  powdered_sugar: {
    canonicalId: "powdered_sugar",
    names: { it: ["zucchero a velo", "zucchero impalpabile"], ja: ["粉砂糖", "シュガーパウダー", "アイシングシュガー"], en: ["powdered sugar", "icing sugar", "confectioners sugar"] },
    defaultUnit: "g", isSolid: true,
  },

  // ── Lieviti e agenti lievitanti ───────────────────────────────────────────
  yeast: {
    canonicalId: "yeast",
    names: { it: ["lievito di birra", "lievito fresco", "lievito secco attivo"], ja: ["イースト", "ドライイースト", "生イースト"], en: ["yeast", "fresh yeast", "active dry yeast", "instant yeast"] },
    defaultUnit: "g", isSolid: true,
  },
  baking_powder: {
    canonicalId: "baking_powder",
    names: { it: ["lievito in polvere", "lievito chimico", "lievito per dolci"], ja: ["ベーキングパウダー", "重曹", "膨らし粉"], en: ["baking powder"] },
    defaultUnit: "g", isSolid: true,
  },
  baking_soda: {
    canonicalId: "baking_soda",
    names: { it: ["bicarbonato", "bicarbonato di sodio"], ja: ["重曹", "炭酸水素ナトリウム"], en: ["baking soda", "bicarbonate of soda", "sodium bicarbonate"] },
    defaultUnit: "g", isSolid: true,
  },

  // ── Verdure ───────────────────────────────────────────────────────────────
  onion: {
    canonicalId: "onion",
    names: { it: ["cipolla", "cipolla bianca", "cipolla rossa", "cipolla dorata"], ja: ["玉ねぎ", "たまねぎ", "オニオン", "赤玉ねぎ"], en: ["onion", "white onion", "red onion", "yellow onion"] },
    defaultUnit: "", isSolid: true,
  },
  garlic: {
    canonicalId: "garlic",
    names: { it: ["aglio", "spicchio d'aglio", "aglio in polvere"], ja: ["にんにく", "ガーリック", "ニンニク"], en: ["garlic", "garlic clove", "garlic powder"] },
    defaultUnit: "", isSolid: true,
  },
  tomato: {
    canonicalId: "tomato",
    names: { it: ["pomodoro", "pomodori", "pomodoro pelato", "pomodorini", "passata di pomodoro", "salsa di pomodoro"], ja: ["トマト", "ミニトマト", "トマトソース", "ホールトマト"], en: ["tomato", "tomatoes", "cherry tomato", "passata", "crushed tomatoes", "canned tomatoes"] },
    defaultUnit: "g", isSolid: true,
  },
  carrot: {
    canonicalId: "carrot",
    names: { it: ["carota", "carote"], ja: ["にんじん", "人参", "キャロット"], en: ["carrot", "carrots"] },
    defaultUnit: "g", isSolid: true,
  },
  celery: {
    canonicalId: "celery",
    names: { it: ["sedano", "costola di sedano"], ja: ["セロリ", "セルリー"], en: ["celery", "celery stalk"] },
    defaultUnit: "g", isSolid: true,
  },
  zucchini: {
    canonicalId: "zucchini",
    names: { it: ["zucchina", "zucchine", "zucchino"], ja: ["ズッキーニ"], en: ["zucchini", "courgette", "zucchinis"] },
    defaultUnit: "g", isSolid: true,
  },
  eggplant: {
    canonicalId: "eggplant",
    names: { it: ["melanzana", "melanzane"], ja: ["なす", "ナス", "茄子"], en: ["eggplant", "aubergine"] },
    defaultUnit: "g", isSolid: true,
  },
  potato: {
    canonicalId: "potato",
    names: { it: ["patata", "patate", "patata a pasta gialla", "patata a pasta bianca"], ja: ["じゃがいも", "ジャガイモ", "馬鈴薯"], en: ["potato", "potatoes", "yukon gold potato"] },
    defaultUnit: "g", isSolid: true,
  },
  spinach: {
    canonicalId: "spinach",
    names: { it: ["spinaci", "spinacino"], ja: ["ほうれん草", "ホウレンソウ"], en: ["spinach", "baby spinach"] },
    defaultUnit: "g", isSolid: true,
  },
  mushroom: {
    canonicalId: "mushroom",
    names: { it: ["funghi", "fungo champignon", "porcini", "funghi misti"], ja: ["きのこ", "マッシュルーム", "しいたけ", "椎茸"], en: ["mushroom", "mushrooms", "porcini", "champignon", "shiitake"] },
    defaultUnit: "g", isSolid: true,
  },
  pepper: {
    canonicalId: "pepper",
    names: { it: ["peperone", "peperoni", "peperone rosso", "peperone giallo"], ja: ["ピーマン", "パプリカ", "赤パプリカ"], en: ["bell pepper", "capsicum", "red pepper", "yellow pepper"] },
    defaultUnit: "g", isSolid: true,
  },
  leek: {
    canonicalId: "leek",
    names: { it: ["porro", "porri"], ja: ["ポロネギ", "ポロ葱"], en: ["leek", "leeks"] },
    defaultUnit: "g", isSolid: true,
  },

  // ── Frutta ────────────────────────────────────────────────────────────────
  pear: {
    canonicalId: "pear",
    names: { it: ["pera", "pere"], ja: ["梨", "ナシ", "洋梨"], en: ["pear", "pears"] },
    defaultUnit: "g", isSolid: true,
  },
  apple: {
    canonicalId: "apple",
    names: { it: ["mela", "mele", "mela golden", "mela renetta"], ja: ["りんご", "リンゴ", "林檎"], en: ["apple", "apples", "golden apple"] },
    defaultUnit: "g", isSolid: true,
  },
  lemon: {
    canonicalId: "lemon",
    names: { it: ["limone", "succo di limone", "buccia di limone", "scorza di limone"], ja: ["レモン", "レモン果汁", "レモンの皮"], en: ["lemon", "lemon juice", "lemon zest", "lemon peel"] },
    defaultUnit: "", isSolid: true,
  },
  orange: {
    canonicalId: "orange",
    names: { it: ["arancia", "arance", "succo d'arancia", "scorza d'arancia"], ja: ["オレンジ", "オレンジジュース", "オレンジの皮"], en: ["orange", "oranges", "orange juice", "orange zest"] },
    defaultUnit: "", isSolid: true,
  },
  banana: {
    canonicalId: "banana",
    names: { it: ["banana", "banane"], ja: ["バナナ"], en: ["banana", "bananas"] },
    defaultUnit: "g", isSolid: true,
  },
  strawberry: {
    canonicalId: "strawberry",
    names: { it: ["fragola", "fragole"], ja: ["いちご", "イチゴ", "苺"], en: ["strawberry", "strawberries"] },
    defaultUnit: "g", isSolid: true,
  },

  // ── Carni ─────────────────────────────────────────────────────────────────
  chicken: {
    canonicalId: "chicken",
    names: { it: ["pollo", "petto di pollo", "coscia di pollo", "fuso di pollo", "pollo intero"], ja: ["鶏肉", "チキン", "鶏もも肉", "鶏むね肉"], en: ["chicken", "chicken breast", "chicken thigh", "chicken drumstick"] },
    defaultUnit: "g", isSolid: true,
  },
  beef: {
    canonicalId: "beef",
    names: { it: ["manzo", "carne di manzo", "macinato di manzo", "bistecca", "controfiletto"], ja: ["牛肉", "ビーフ", "牛ひき肉", "ステーキ"], en: ["beef", "ground beef", "minced beef", "steak", "beef mince"] },
    defaultUnit: "g", isSolid: true,
  },
  pork: {
    canonicalId: "pork",
    names: { it: ["maiale", "carne di maiale", "costine", "lonza", "arista"], ja: ["豚肉", "ポーク", "豚バラ", "豚ひき肉"], en: ["pork", "pork loin", "pork ribs", "pork mince"] },
    defaultUnit: "g", isSolid: true,
  },
  pancetta: {
    canonicalId: "pancetta",
    names: { it: ["pancetta", "guanciale", "bacon", "speck"], ja: ["パンチェッタ", "グアンチャーレ", "ベーコン"], en: ["pancetta", "guanciale", "bacon", "lardons"] },
    defaultUnit: "g", isSolid: true,
  },

  // ── Pesce ─────────────────────────────────────────────────────────────────
  salmon: {
    canonicalId: "salmon",
    names: { it: ["salmone", "filetto di salmone", "salmone affumicato"], ja: ["鮭", "サーモン", "スモークサーモン"], en: ["salmon", "salmon fillet", "smoked salmon"] },
    defaultUnit: "g", isSolid: true,
  },
  tuna: {
    canonicalId: "tuna",
    names: { it: ["tonno", "tonno in scatola", "filetto di tonno"], ja: ["マグロ", "ツナ", "ツナ缶"], en: ["tuna", "canned tuna", "tuna fillet"] },
    defaultUnit: "g", isSolid: true,
  },
  shrimp: {
    canonicalId: "shrimp",
    names: { it: ["gamberi", "gamberetto", "mazzancolle"], ja: ["エビ", "海老", "えび"], en: ["shrimp", "prawns", "king prawn"] },
    defaultUnit: "g", isSolid: true,
  },

  // ── Legumi ────────────────────────────────────────────────────────────────
  chickpeas: {
    canonicalId: "chickpeas",
    names: { it: ["ceci", "fagioli ceci"], ja: ["ひよこ豆", "ガルバンゾー"], en: ["chickpeas", "garbanzo beans"] },
    defaultUnit: "g", isSolid: true,
  },
  lentils: {
    canonicalId: "lentils",
    names: { it: ["lenticchie", "lenticchie rosse", "lenticchie verdi"], ja: ["レンズ豆", "レンティル"], en: ["lentils", "red lentils", "green lentils", "brown lentils"] },
    defaultUnit: "g", isSolid: true,
  },
  beans: {
    canonicalId: "beans",
    names: { it: ["fagioli", "fagioli borlotti", "fagioli cannellini", "fagioli neri"], ja: ["豆", "いんげん豆", "白インゲン豆"], en: ["beans", "borlotti beans", "cannellini beans", "black beans", "kidney beans"] },
    defaultUnit: "g", isSolid: true,
  },

  // ── Spezie ed erbe ────────────────────────────────────────────────────────
  salt: {
    canonicalId: "salt",
    names: { it: ["sale", "sale fino", "sale grosso", "sale marino"], ja: ["塩", "食塩", "海塩"], en: ["salt", "sea salt", "kosher salt", "fine salt"] },
    defaultUnit: "g", isSolid: true,
  },
  black_pepper: {
    canonicalId: "black_pepper",
    names: { it: ["pepe nero", "pepe", "pepe in grani"], ja: ["黒こしょう", "胡椒", "ブラックペッパー"], en: ["black pepper", "pepper", "ground pepper"] },
    defaultUnit: "g", isSolid: true,
  },
  basil: {
    canonicalId: "basil",
    names: { it: ["basilico", "foglie di basilico"], ja: ["バジル", "バジリコ"], en: ["basil", "fresh basil", "basil leaves"] },
    defaultUnit: "g", isSolid: true,
  },
  parsley: {
    canonicalId: "parsley",
    names: { it: ["prezzemolo", "foglie di prezzemolo"], ja: ["パセリ", "イタリアンパセリ"], en: ["parsley", "flat-leaf parsley", "curly parsley"] },
    defaultUnit: "g", isSolid: true,
  },
  rosemary: {
    canonicalId: "rosemary",
    names: { it: ["rosmarino"], ja: ["ローズマリー"], en: ["rosemary", "fresh rosemary"] },
    defaultUnit: "g", isSolid: true,
  },
  oregano: {
    canonicalId: "oregano",
    names: { it: ["origano"], ja: ["オレガノ"], en: ["oregano", "dried oregano"] },
    defaultUnit: "g", isSolid: true,
  },
  thyme: {
    canonicalId: "thyme",
    names: { it: ["timo"], ja: ["タイム"], en: ["thyme", "fresh thyme"] },
    defaultUnit: "g", isSolid: true,
  },
  chili: {
    canonicalId: "chili",
    names: { it: ["peperoncino", "peperoncino rosso", "peperoncino in polvere", "paprika piccante"], ja: ["唐辛子", "チリ", "鷹の爪"], en: ["chili", "chili pepper", "red chili", "chili flakes", "cayenne"] },
    defaultUnit: "g", isSolid: true,
  },
  cinnamon: {
    canonicalId: "cinnamon",
    names: { it: ["cannella", "stecca di cannella"], ja: ["シナモン", "シナモンスティック"], en: ["cinnamon", "cinnamon stick", "ground cinnamon"] },
    defaultUnit: "g", isSolid: true,
  },
  nutmeg: {
    canonicalId: "nutmeg",
    names: { it: ["noce moscata"], ja: ["ナツメグ"], en: ["nutmeg", "ground nutmeg"] },
    defaultUnit: "g", isSolid: true,
  },
  vanilla: {
    canonicalId: "vanilla",
    names: { it: ["vaniglia", "baccello di vaniglia", "estratto di vaniglia", "aroma di vaniglia"], ja: ["バニラ", "バニラビーンズ", "バニラエッセンス"], en: ["vanilla", "vanilla bean", "vanilla extract", "vanilla essence"] },
    defaultUnit: "g", isSolid: true,
  },
  saffron: {
    canonicalId: "saffron",
    names: { it: ["zafferano"], ja: ["サフラン"], en: ["saffron"] },
    defaultUnit: "g", isSolid: true,
  },

  // ── Liquidi / Bevande ─────────────────────────────────────────────────────
  water: {
    canonicalId: "water",
    names: { it: ["acqua", "acqua tiepida", "acqua calda", "acqua fredda"], ja: ["水", "お湯", "ぬるま湯"], en: ["water", "warm water", "cold water", "hot water"] },
    defaultUnit: "ml", isSolid: false,
  },
  wine_white: {
    canonicalId: "wine_white",
    names: { it: ["vino bianco"], ja: ["白ワイン"], en: ["white wine", "dry white wine"] },
    defaultUnit: "ml", isSolid: false,
  },
  wine_red: {
    canonicalId: "wine_red",
    names: { it: ["vino rosso"], ja: ["赤ワイン"], en: ["red wine", "dry red wine"] },
    defaultUnit: "ml", isSolid: false,
  },
  broth: {
    canonicalId: "broth",
    names: { it: ["brodo", "brodo di carne", "brodo vegetale", "brodo di pollo", "brodo di verdure"], ja: ["ブロス", "スープ", "鶏がらスープ", "野菜スープ"], en: ["broth", "stock", "chicken broth", "vegetable broth", "beef broth", "chicken stock"] },
    defaultUnit: "ml", isSolid: false,
  },

  // ── Varie ─────────────────────────────────────────────────────────────────
  cocoa: {
    canonicalId: "cocoa",
    names: { it: ["cacao", "cacao amaro in polvere"], ja: ["ココア", "カカオパウダー"], en: ["cocoa", "cocoa powder", "unsweetened cocoa"] },
    defaultUnit: "g", isSolid: true,
  },
  chocolate: {
    canonicalId: "chocolate",
    names: { it: ["cioccolato", "cioccolato fondente", "cioccolato al latte", "gocce di cioccolato"], ja: ["チョコレート", "ダークチョコレート", "板チョコ"], en: ["chocolate", "dark chocolate", "milk chocolate", "chocolate chips"] },
    defaultUnit: "g", isSolid: true,
  },
  almond: {
    canonicalId: "almond",
    names: { it: ["mandorle", "mandorla", "farina di mandorle", "mandorle tritate"], ja: ["アーモンド", "アーモンドパウダー"], en: ["almond", "almonds", "almond flour", "ground almonds"] },
    defaultUnit: "g", isSolid: true,
  },
  walnut: {
    canonicalId: "walnut",
    names: { it: ["noci", "noce"], ja: ["クルミ", "胡桃"], en: ["walnut", "walnuts"] },
    defaultUnit: "g", isSolid: true,
  },
  pine_nuts: {
    canonicalId: "pine_nuts",
    names: { it: ["pinoli"], ja: ["松の実", "パインナッツ"], en: ["pine nuts", "pignoli"] },
    defaultUnit: "g", isSolid: true,
  },
  vinegar: {
    canonicalId: "vinegar",
    names: { it: ["aceto", "aceto di vino", "aceto balsamico", "aceto di mele"], ja: ["酢", "ワインビネガー", "バルサミコ酢", "リンゴ酢"], en: ["vinegar", "wine vinegar", "balsamic vinegar", "apple cider vinegar"] },
    defaultUnit: "ml", isSolid: false,
  },
  capers: {
    canonicalId: "capers",
    names: { it: ["capperi"], ja: ["ケーパー"], en: ["capers"] },
    defaultUnit: "g", isSolid: true,
  },
  olives: {
    canonicalId: "olives",
    names: { it: ["olive", "olive nere", "olive verdi", "olive taggiasche"], ja: ["オリーブ", "ブラックオリーブ", "グリーンオリーブ"], en: ["olives", "black olives", "green olives", "kalamata olives"] },
    defaultUnit: "g", isSolid: true,
  },
  anchovies: {
    canonicalId: "anchovies",
    names: { it: ["acciughe", "alici", "alici sott'olio"], ja: ["アンチョビ"], en: ["anchovies", "anchovy fillets", "canned anchovies"] },
    defaultUnit: "g", isSolid: true,
  },
  tomato_paste: {
    canonicalId: "tomato_paste",
    names: { it: ["concentrato di pomodoro", "doppio concentrato"], ja: ["トマトペースト", "トマトピューレ"], en: ["tomato paste", "tomato puree", "tomato concentrate"] },
    defaultUnit: "g", isSolid: false,
  },
  cornstarch: {
    canonicalId: "cornstarch",
    names: { it: ["amido di mais", "maizena", "fecola di patate", "fecola"], ja: ["コーンスターチ", "片栗粉", "じゃがいも澱粉"], en: ["cornstarch", "corn starch", "cornflour", "potato starch"] },
    defaultUnit: "g", isSolid: true,
  },
};

// ─── Lookup helpers ───────────────────────────────────────────────────────────

type SupportedLang = "it" | "ja" | "en";

/**
 * Dato un testo (nome ingrediente), ritorna il canonicalId se trovato.
 * Ricerca case-insensitive e parziale.
 */
export function findCanonicalId(
  text: string,
  lang: SupportedLang = "it"
): string | null {
  const q = text.toLowerCase().trim();
  if (!q) return null;

  for (const [id, entry] of Object.entries(INGREDIENT_DICTIONARY)) {
    const names = entry.names[lang] ?? entry.names.en;
    for (const name of names) {
      if (name.toLowerCase().includes(q) || q.includes(name.toLowerCase())) {
        return id;
      }
    }
  }

  // Fallback: cerca in tutte le lingue
  for (const [id, entry] of Object.entries(INGREDIENT_DICTIONARY)) {
    for (const langNames of Object.values(entry.names)) {
      for (const name of langNames) {
        if (name.toLowerCase().includes(q) || q.includes(name.toLowerCase())) {
          return id;
        }
      }
    }
  }

  return null;
}

/**
 * Dato un canonicalId, ritorna il nome nella lingua desiderata.
 */
export function getIngredientName(
  canonicalId: string,
  lang: SupportedLang = "it"
): string {
  const entry = INGREDIENT_DICTIONARY[canonicalId];
  if (!entry) return canonicalId;
  const names = entry.names[lang] ?? entry.names.en;
  return names[0] ?? canonicalId;
}

/**
 * Ritorna true se l'ingrediente è un solido (utile per warning conversioni).
 */
export function isSolidIngredient(canonicalId: string): boolean {
  return INGREDIENT_DICTIONARY[canonicalId]?.isSolid ?? true;
}

/**
 * Lista di tutti i canonicalId che corrispondono a una query (multilingua).
 */
export function searchIngredients(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return Object.entries(INGREDIENT_DICTIONARY)
    .filter(([, entry]) => {
      for (const names of Object.values(entry.names)) {
        if (names.some((n) => n.toLowerCase().includes(q))) return true;
      }
      return false;
    })
    .map(([id]) => id);
}
