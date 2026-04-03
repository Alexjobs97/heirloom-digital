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
    names: { it: ["farina", "farina 00", "farina di grano", "farina bianca", "farina tipo 00", "farina per dolci"], ja: ["小麦粉", "薄力粉", "強力粉", "中力粉", "コムギコ"], en: ["flour", "all-purpose flour", "plain flour", "wheat flour", "pastry flour"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 364, grassi: 1.2, grassi_saturi: 0.2, carboidrati: 76, zuccheri: 0.3, proteine: 10, fibre: 2.7, sale: 0.01, extra: { ferro_mg: 1.2 } },
  },
  bread_flour: {
    canonicalId: "bread_flour",
    names: { it: ["farina di forza", "farina manitoba", "farina 0", "farina per pane"], ja: ["強力粉", "パン用粉", "ブレッドフラワー"], en: ["bread flour", "strong flour", "manitoba flour"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 368, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 74, zuccheri: 0.4, proteine: 13, fibre: 3.1, sale: 0.01, extra: { ferro_mg: 1.5 } },
  },
  cake_flour: {
    canonicalId: "cake_flour",
    names: { it: ["farina per dolci", "farina debole", "farina per torte"], ja: ["薄力粉", "ケーキ用粉", "菓子用粉"], en: ["cake flour", "soft flour", "pastry flour"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 358, grassi: 0.9, grassi_saturi: 0.1, carboidrati: 78, zuccheri: 0.2, proteine: 8, fibre: 2.1, sale: 0.01 },
  },
  whole_wheat_flour: {
    canonicalId: "whole_wheat_flour",
    names: { it: ["farina integrale", "farina di grano intero"], ja: ["全粒粉", "全粒小麦粉"], en: ["whole wheat flour", "wholemeal flour", "brown flour"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 340, grassi: 2.5, grassi_saturi: 0.4, carboidrati: 72, zuccheri: 0.5, proteine: 13, fibre: 12, sale: 0.02, extra: { magnesio_mg: 120, ferro_mg: 3.6 } },
  },
  rye_flour: {
    canonicalId: "rye_flour",
    names: { it: ["farina di segale", "segale macinata"], ja: ["ライ麦粉", "ライフラワー"], en: ["rye flour", "rye meal"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 335, grassi: 1.8, grassi_saturi: 0.3, carboidrati: 75, zuccheri: 0.6, proteine: 10, fibre: 15, sale: 0.02, extra: { potassio_mg: 450 } },
  },
  semolina: {
    canonicalId: "semolina",
    names: { it: ["semola", "semola di grano duro", "semolino", "semola rimacinata"], ja: ["セモリナ粉", "デュラム粉", "セミョリーナ"], en: ["semolina", "durum wheat", "semolina flour"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 360, grassi: 1.1, grassi_saturi: 0.2, carboidrati: 77, zuccheri: 0.3, proteine: 12, fibre: 3.9, sale: 0.01, extra: { ferro_mg: 1.8 } },
  },
  rice: {
    canonicalId: "rice",
    names: { it: ["riso", "riso carnaroli", "riso arborio", "riso vialone nano", "riso basmati", "riso integrale"], ja: ["米", "ご飯", "白米", "玄米", "カルナローリ米", "バスマティ米"], en: ["rice", "arborio rice", "basmati rice", "brown rice", "white rice"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 358, grassi: 0.7, grassi_saturi: 0.2, carboidrati: 80, zuccheri: 0.1, proteine: 7, fibre: 1.3, sale: 0.01 },
  },
  sushi_rice: {
    canonicalId: "sushi_rice",
    names: { it: ["riso per sushi", "riso giapponese", "riso glutinoso"], ja: ["寿司米", "ジャポニカ米", "酢飯", "短粒米"], en: ["sushi rice", "japanese rice", "short-grain rice"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 355, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 81, zuccheri: 0.1, proteine: 6.5, fibre: 0.8, sale: 0.01 },
  },
  glutinous_rice: {
    canonicalId: "glutinous_rice",
    names: { it: ["riso glutinoso", "riso appiccicoso", "riso dolce"], ja: ["もち米", "糯米", "餅米"], en: ["glutinous rice", "sticky rice", "sweet rice"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 365, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 82, zuccheri: 0.2, proteine: 7, fibre: 1.1, sale: 0.01 },
  },
  wild_rice: {
    canonicalId: "wild_rice",
    names: { it: ["riso selvatico", "riso nero"], ja: ["ワイルドライス", "黒米"], en: ["wild rice", "black rice", "forbidden rice"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 357, grassi: 1.1, grassi_saturi: 0.2, carboidrati: 75, zuccheri: 0.5, proteine: 15, fibre: 6.2, sale: 0.02, extra: { antociani_mg: 30, ferro_mg: 2.8 } },
  },
  pasta: {
    canonicalId: "pasta",
    names: { it: ["pasta", "spaghetti", "penne", "rigatoni", "fusilli", "tagliatelle", "linguine"], ja: ["パスタ", "スパゲッティ", "ペンネ", "マカロニ"], en: ["pasta", "spaghetti", "penne", "rigatoni", "fusilli"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 371, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 75, zuccheri: 2.5, proteine: 13, fibre: 3.2, sale: 0.01, extra: { ferro_mg: 1.3 } },
  },
  fresh_pasta: {
    canonicalId: "fresh_pasta",
    names: { it: ["pasta fresca", "sfoglia", "pasta all'uovo"], ja: ["生パスタ", "手作りパスタ", "卵パスタ"], en: ["fresh pasta", "egg pasta", "homemade pasta"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 285, grassi: 3.2, grassi_saturi: 1.1, carboidrati: 52, zuccheri: 1.8, proteine: 11, fibre: 2.1, sale: 0.3, extra: { colesterolo_mg: 85 } },
  },
  noodles: {
    canonicalId: "noodles",
    names: { it: ["tagliolini", "pappardelle", "lasagne", "sfoglia"], ja: ["麺", "うどん", "そば", "ラーメン", "そうめん"], en: ["noodles", "egg noodles", "udon", "soba", "ramen"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 360, grassi: 1.8, grassi_saturi: 0.4, carboidrati: 74, zuccheri: 1.2, proteine: 11, fibre: 2.8, sale: 0.8 },
  },
  soba_noodles: {
    canonicalId: "soba_noodles",
    names: { it: ["soba", "noodles di grano saraceno"], ja: ["そば", "蕎麦", "十割そば", "二八そば"], en: ["soba", "buckwheat noodles", "japanese soba"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 345, grassi: 1.2, grassi_saturi: 0.2, carboidrati: 73, zuccheri: 0.8, proteine: 14, fibre: 6.5, sale: 0.5, extra: { rutina_mg: 15, magnesio_mg: 95 } },
  },
  udon_noodles: {
    canonicalId: "udon_noodles",
    names: { it: ["udon", "noodles spessi giapponesi"], ja: ["うどん", "讃岐うどん", "厚麺"], en: ["udon", "thick wheat noodles", "japanese udon"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 320, grassi: 0.8, grassi_saturi: 0.1, carboidrati: 70, zuccheri: 0.5, proteine: 9, fibre: 2.1, sale: 1.2 },
  },
  ramen_noodles: {
    canonicalId: "ramen_noodles",
    names: { it: ["ramen", "noodles per ramen"], ja: ["ラーメン", "中華麺", "拉麺"], en: ["ramen", "ramen noodles", "chinese noodles"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 430, grassi: 15, grassi_saturi: 6, carboidrati: 65, zuccheri: 1.5, proteine: 10, fibre: 2.5, sale: 2.8, extra: { sodio_mg: 1100 } },
  },
  breadcrumbs: {
    canonicalId: "breadcrumbs",
    names: { it: ["pangrattato", "pane grattugiato", "mollica di pane", "panure"], ja: ["パン粉", "ブレッドクラム", "パンコ"], en: ["breadcrumbs", "bread crumbs", "panko"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 395, grassi: 5.5, grassi_saturi: 1.2, carboidrati: 72, zuccheri: 4, proteine: 13, fibre: 4.5, sale: 1.8 },
  },
  panko: {
    canonicalId: "panko",
    names: { it: ["panko", "pangrattato giapponese", "pane grattugiato croccante"], ja: ["パン粉", "衣用パン粉", "カリカリパン粉"], en: ["panko", "japanese breadcrumbs", "crispy breadcrumbs"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 380, grassi: 3.2, grassi_saturi: 0.8, carboidrati: 76, zuccheri: 2.5, proteine: 11, fibre: 3.1, sale: 1.2 },
  },
  cornmeal: {
    canonicalId: "cornmeal",
    names: { it: ["farina di mais", "polenta", "fumetto di mais"], ja: ["コーンミール", "トウモロコシ粉", "ポレンタ粉"], en: ["cornmeal", "polenta", "maize flour"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 362, grassi: 3.6, grassi_saturi: 0.5, carboidrati: 77, zuccheri: 0.6, proteine: 8.1, fibre: 7.3, sale: 0.02, extra: { luteina_mcg: 135, potassio_mg: 287 } },
  },
  oats: {
    canonicalId: "oats",
    names: { it: ["avena", "fiocchi d'avena", "crusca d'avena"], ja: ["オーツ麦", "オートミール", "エンバク"], en: ["oats", "rolled oats", "oatmeal"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 389, grassi: 6.9, grassi_saturi: 1.2, carboidrati: 66, zuccheri: 0.9, proteine: 16.9, fibre: 10.6, sale: 0.01, extra: { beta_glucani_g: 4, ferro_mg: 4.7 } },
  },
  buckwheat: {
    canonicalId: "buckwheat",
    names: { it: ["grano saraceno", "saraceno", "pizzoccheri"], ja: ["蕎麦", "そば粉", "ソバ"], en: ["buckwheat", "buckwheat groats", "kasha"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 343, grassi: 3.4, grassi_saturi: 0.6, carboidrati: 72, zuccheri: 0.9, proteine: 13, fibre: 10, sale: 0.02, extra: { rutina_mg: 25, magnesio_mg: 231 } },
  },
  quinoa: {
    canonicalId: "quinoa",
    names: { it: ["quinoa", "quinua", "semi di quinoa"], ja: ["キヌア", "キノア"], en: ["quinoa", "white quinoa", "red quinoa"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 368, grassi: 6.1, grassi_saturi: 0.7, carboidrati: 64, zuccheri: 0.9, proteine: 14, fibre: 7, sale: 0.01, extra: { ferro_mg: 4.6, magnesio_mg: 197, tutti_aminoacidi: true } },
  },
  barley: {
    canonicalId: "barley",
    names: { it: ["orzo", "orzo perlato", "orzo mondato"], ja: ["大麦", "オオムギ", "はだか麦"], en: ["barley", "pearl barley", "hulled barley"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 354, grassi: 2.3, grassi_saturi: 0.4, carboidrati: 78, zuccheri: 0.8, proteine: 12, fibre: 17, sale: 0.02, extra: { beta_glucani_g: 5.5, selenio_mcg: 37 } },
  },
  millet: {
    canonicalId: "millet",
    names: { it: ["miglio", "semi di miglio"], ja: ["キビ", "アワ", "粟"], en: ["millet", "pearl millet", "proso millet"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 378, grassi: 4.2, grassi_saturi: 0.7, carboidrati: 73, zuccheri: 0.2, proteine: 11, fibre: 8.5, sale: 0.01, extra: { magnesio_mg: 114, fosforo_mg: 285 } },
  },
  polenta_instant: {
    canonicalId: "polenta_instant",
    names: { it: ["polenta istantanea", "farina per polenta"], ja: ["ポレンタ", "インスタントポレンタ"], en: ["instant polenta", "quick polenta"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 355, grassi: 2.8, grassi_saturi: 0.4, carboidrati: 76, zuccheri: 0.5, proteine: 7.5, fibre: 5.2, sale: 0.3 },
  },
  tapioca: {
    canonicalId: "tapioca",
    names: { it: ["tapioca", "fecola di tapioca", "perle di tapioca"], ja: ["タピオカ", "タピオカ粉", "タピオカパール"], en: ["tapioca", "tapioca starch", "tapioca pearls"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 358, grassi: 0.2, grassi_saturi: 0.1, carboidrati: 89, zuccheri: 0, proteine: 0.2, fibre: 0.9, sale: 0.01 },
  },
  potato_starch: {
    canonicalId: "potato_starch",
    names: { it: ["fecola di patate", "amido di patate"], ja: ["片栗粉", "ポテトスターチ", "馬鈴薯澱粉"], en: ["potato starch", "potato flour"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 357, grassi: 0.1, grassi_saturi: 0, carboidrati: 88, zuccheri: 0, proteine: 0.3, fibre: 0.2, sale: 0.01 },
  },
  cornstarch: {
    canonicalId: "cornstarch",
    names: { it: ["amido di mais", "maizena", "fecola di mais"], ja: ["コーンスターチ", "片栗粉", "トウモロコシ澱粉"], en: ["cornstarch", "corn flour", "maize starch"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 381, grassi: 0.1, grassi_saturi: 0, carboidrati: 91, zuccheri: 0, proteine: 0.3, fibre: 0.9, sale: 0.01 },
  },

  // ── Latticini ─────────────────────────────────────────────────────────────
  milk: {
    canonicalId: "milk",
    names: { it: ["latte", "latte intero", "latte parzialmente scremato", "latte scremato"], ja: ["牛乳", "ミルク", "全脂乳", "低脂肪乳"], en: ["milk", "whole milk", "skimmed milk", "low-fat milk"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 64, grassi: 3.6, grassi_saturi: 2.3, carboidrati: 4.8, zuccheri: 4.8, proteine: 3.3, fibre: 0, sale: 0.1, extra: { calcio_mg: 120, vitamina_b12_mcg: 0.4 } },
  },
  condensed_milk: {
    canonicalId: "condensed_milk",
    names: { it: ["latte condensato", "latte zuccherato"], ja: ["練乳", "コンデンスミルク", "加糖練乳"], en: ["condensed milk", "sweetened condensed milk"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 321, grassi: 8.7, grassi_saturi: 5.5, carboidrati: 54, zuccheri: 54, proteine: 7.9, fibre: 0, sale: 0.15, extra: { calcio_mg: 285 } },
  },
  evaporated_milk: {
    canonicalId: "evaporated_milk",
    names: { it: ["latte evaporato", "latte concentrato"], ja: ["エバミルク", "無糖練乳", "蒸発乳"], en: ["evaporated milk", "unsweetened condensed milk"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 134, grassi: 7.6, grassi_saturi: 4.7, carboidrati: 10, zuccheri: 10, proteine: 6.8, fibre: 0, sale: 0.12, extra: { calcio_mg: 245, vitamina_d_mcg: 1.2 } },
  },
  cream: {
    canonicalId: "cream",
    names: { it: ["panna", "panna da cucina", "panna fresca", "panna da montare"], ja: ["生クリーム", "クリーム", "ホイップクリーム"], en: ["cream", "heavy cream", "whipping cream", "double cream"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 345, grassi: 36, grassi_saturi: 22, carboidrati: 2.8, zuccheri: 2.8, proteine: 2.1, fibre: 0, sale: 0.05, extra: { vitamina_a_mcg: 350, colesterolo_mg: 110 } },
  },
  butter: {
    canonicalId: "butter",
    names: { it: ["burro", "burro salato", "burro non salato", "burro chiarificato"], ja: ["バター", "食塩入りバター", "無塩バター", "ギー"], en: ["butter", "salted butter", "unsalted butter", "clarified butter"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 717, grassi: 81, grassi_saturi: 51, carboidrati: 0.1, zuccheri: 0.1, proteine: 0.9, fibre: 0, sale: 0.02, extra: { vitamina_a_mcg: 684, vitamina_d_mcg: 1.5, colesterolo_mg: 215 } },
  },
  ghee: {
    canonicalId: "ghee",
    names: { it: ["ghee", "burro chiarificato", "burro indiano"], ja: ["ギー", "澄ましバター", "インドバター"], en: ["ghee", "clarified butter", "indian butter"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 876, grassi: 99, grassi_saturi: 62, carboidrati: 0, zuccheri: 0, proteine: 0.3, fibre: 0, sale: 0, extra: { vitamina_a_mcg: 840, vitamina_e_mg: 2.8, butirrico_g: 3.5 } },
  },
  cheese: {
    canonicalId: "cheese",
    names: { it: ["formaggio", "parmigiano", "grana padano", "pecorino", "mozzarella", "ricotta"], ja: ["チーズ", "パルミジャーノ", "モッツァレラ", "リコッタ", "ゴルゴンゾーラ"], en: ["cheese", "parmesan", "mozzarella", "ricotta", "gorgonzola"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 350, grassi: 28, grassi_saturi: 18, carboidrati: 1.5, zuccheri: 0.5, proteine: 25, fibre: 0, sale: 1.2, extra: { calcio_mg: 720, vitamina_b12_mcg: 1.2 } },
  },
  parmesan: {
    canonicalId: "parmesan",
    names: { it: ["parmigiano reggiano", "parmigiano", "grana", "formaggio grattugiato"], ja: ["パルミジャーノ・レッジャーノ", "パルメザン", "すりおろしチーズ"], en: ["parmesan", "parmigiano reggiano", "grated parmesan"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 392, grassi: 29, grassi_saturi: 19, carboidrati: 0, zuccheri: 0, proteine: 35, fibre: 0, sale: 1.6, extra: { calcio_mg: 1180, fosforo_mg: 720, glutammato_naturale: true } },
  },
  pecorino: {
    canonicalId: "pecorino",
    names: { it: ["pecorino", "pecorino romano", "pecorino sardo", "formaggio di pecora"], ja: ["ペコリーノ", "ペコリーノ・ロマーノ", "羊のチーズ"], en: ["pecorino", "pecorino romano", "sheep cheese"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 387, grassi: 31, grassi_saturi: 21, carboidrati: 0.5, zuccheri: 0.5, proteine: 27, fibre: 0, sale: 2.1, extra: { calcio_mg: 850, vitamina_a_mcg: 280, cla_g: 0.8 } },
  },
  mozzarella: {
    canonicalId: "mozzarella",
    names: { it: ["mozzarella", "mozzarella di bufala", "fior di latte"], ja: ["モッツァレラ", "水牛モッツァレラ", "フィオルディラッテ"], en: ["mozzarella", "buffalo mozzarella", "fresh mozzarella"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 280, grassi: 22, grassi_saturi: 14, carboidrati: 1.2, zuccheri: 1, proteine: 19, fibre: 0, sale: 0.6, extra: { calcio_mg: 505, fosforo_mg: 350 } },
    peso_medio_unità: 125,
  },
  ricotta: {
    canonicalId: "ricotta",
    names: { it: ["ricotta", "ricotta fresca", "ricotta salata"], ja: ["リコッタ", "リコッタチーズ", "フレッシュリコッタ"], en: ["ricotta", "fresh ricotta", "ricotta cheese"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 174, grassi: 13, grassi_saturi: 8, carboidrati: 3.5, zuccheri: 3.5, proteine: 11, fibre: 0, sale: 0.3, extra: { calcio_mg: 207, vitamina_a_mcg: 185 } },
  },
  mascarpone: {
    canonicalId: "mascarpone",
    names: { it: ["mascarpone", "formaggio cremoso"], ja: ["マスカルポーネ", "マスカルポーネチーズ"], en: ["mascarpone", "mascarpone cheese", "italian cream cheese"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 429, grassi: 44, grassi_saturi: 30, carboidrati: 3.5, zuccheri: 3.5, proteine: 5, fibre: 0, sale: 0.1, extra: { vitamina_a_mcg: 420, colesterolo_mg: 140 } },
  },
  gorgonzola: {
    canonicalId: "gorgonzola",
    names: { it: ["gorgonzola", "formaggio blu", "erborinato"], ja: ["ゴルゴンゾーラ", "ブルーチーズ", "青カビチーズ"], en: ["gorgonzola", "blue cheese", "italian blue"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 353, grassi: 29, grassi_saturi: 19, carboidrati: 2.3, zuccheri: 0.6, proteine: 21, fibre: 0, sale: 1.4, extra: { calcio_mg: 520, vitamina_b12_mcg: 1.8, probiotici: true } },
  },
  feta: {
    canonicalId: "feta",
    names: { it: ["feta", "formaggio greco", "formaggio di pecora"], ja: ["フェタチーズ", "ギリシャチーズ", "羊のチーズ"], en: ["feta", "greek feta", "sheep feta"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 264, grassi: 21, grassi_saturi: 15, carboidrati: 4, zuccheri: 4, proteine: 14, fibre: 0, sale: 3.2, extra: { calcio_mg: 493, probiotici: true } },
  },
  yogurt: {
    canonicalId: "yogurt",
    names: { it: ["yogurt", "yogurt greco", "yogurt bianco", "yogurt naturale"], ja: ["ヨーグルト", "ギリシャヨーグルト", "プレーンヨーグルト"], en: ["yogurt", "greek yogurt", "plain yogurt", "natural yogurt"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 59, grassi: 3.3, grassi_saturi: 2.1, carboidrati: 4.7, zuccheri: 4.7, proteine: 3.5, fibre: 0, sale: 0.07, extra: { calcio_mg: 121, probiotici: true, vitamina_b12_mcg: 0.4 } },
  },
  cream_cheese: {
    canonicalId: "cream_cheese",
    names: { it: ["formaggio cremoso", "cream cheese", "philadelphia"], ja: ["クリームチーズ", "フィラデルフィア"], en: ["cream cheese", "philadelphia", "soft cheese"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 342, grassi: 34, grassi_saturi: 21, carboidrati: 4, zuccheri: 3.5, proteine: 6, fibre: 0, sale: 1.1, extra: { vitamina_a_mcg: 368, colesterolo_mg: 110 } },
  },
  cottage_cheese: {
    canonicalId: "cottage_cheese",
    names: { it: ["fiocchi di latte", "cottage cheese", "ricotta magra"], ja: ["カッテージチーズ", "低脂肪チーズ"], en: ["cottage cheese", "curd cheese", "farmer cheese"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 98, grassi: 4.3, grassi_saturi: 2.7, carboidrati: 3.4, zuccheri: 2.7, proteine: 11, fibre: 0, sale: 0.4, extra: { calcio_mg: 83, selenio_mcg: 9.7 } },
  },
  goat_cheese: {
    canonicalId: "goat_cheese",
    names: { it: ["formaggio di capra", "caprino", "chèvre"], ja: ["ゴーダチーズ", "ヤギのチーズ", "シェーブル"], en: ["goat cheese", "chèvre", "caprine cheese"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 364, grassi: 30, grassi_saturi: 21, carboidrati: 2.5, zuccheri: 2.5, proteine: 22, fibre: 0, sale: 1.3, extra: { calcio_mg: 298, vitamina_a_mcg: 407, cla_g: 0.6 } },
  },
  blue_cheese: {
    canonicalId: "blue_cheese",
    names: { it: ["gorgonzola", "roquefort", "formaggio erborinato"], ja: ["ブルーチーズ", "青カビチーズ", "ゴルゴンゾーラ"], en: ["blue cheese", "gorgonzola", "roquefort"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 353, grassi: 29, grassi_saturi: 19, carboidrati: 2.3, zuccheri: 0.6, proteine: 21, fibre: 0, sale: 1.4, extra: { calcio_mg: 520, vitamina_b12_mcg: 1.8, probiotici: true } },
  },
  fontina: {
    canonicalId: "fontina",
    names: { it: ["fontina", "formaggio fontina", "formaggio d'alpeggio"], ja: ["フォンティーナ", "イタリアンチーズ"], en: ["fontina", "italian fontina", "alpine cheese"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 389, grassi: 32, grassi_saturi: 21, carboidrati: 1.5, zuccheri: 1.5, proteine: 25, fibre: 0, sale: 1.1, extra: { calcio_mg: 740, vitamina_a_mcg: 320 } },
  },
  provolone: {
    canonicalId: "provolone",
    names: { it: ["provolone", "formaggio provola", "provola affumicata"], ja: ["プロヴォローネ", "スモークチーズ"], en: ["provolone", "smoked provolone", "italian cheese"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 351, grassi: 27, grassi_saturi: 17, carboidrati: 2.1, zuccheri: 0.6, proteine: 25, fibre: 0, sale: 1.5, extra: { calcio_mg: 756, vitamina_b12_mcg: 1.4 } },
  },

  // ── Carne e pollame ──────────────────────────────────────────────────────
  beef: {
    canonicalId: "beef",
    names: { it: ["manzo", "carne di manzo", "bovino", "vitello", "filetto"], ja: ["牛肉", "ビーフ", "牛もも肉", "仔牛", "フィレ"], en: ["beef", "cow meat", "steak", "veal", "fillet"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 250, grassi: 15, grassi_saturi: 6, carboidrati: 0, zuccheri: 0, proteine: 26, fibre: 0, sale: 0.07, extra: { ferro_mg: 2.6, zinco_mg: 4.8, vitamina_b12_mcg: 2.6, creatina_g: 0.5 } },
  },
  pork: {
    canonicalId: "pork",
    names: { it: ["maiale", "carne di maiale", "lonza", "pancetta", "guanciale"], ja: ["豚肉", "ポーク", "豚バラ", "豚ロース", "プロシュット"], en: ["pork", "pig meat", "pork loin", "pork belly", "ham"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 242, grassi: 14, grassi_saturi: 5, carboidrati: 0, zuccheri: 0, proteine: 27, fibre: 0, sale: 0.08, extra: { tiamina_mg: 0.6, vitamina_b6_mg: 0.4, selenio_mcg: 38 } },
  },
  chicken: {
    canonicalId: "chicken",
    names: { it: ["pollo", "carne di pollo", "petto di pollo", "coscia di pollo", "sovracoscia"], ja: ["鶏肉", "チキン", "鶏むね肉", "鶏もも肉", "手羽元"], en: ["chicken", "chicken breast", "chicken thigh", "chicken wing", "poultry"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 165, grassi: 3.6, grassi_saturi: 1, carboidrati: 0, zuccheri: 0, proteine: 31, fibre: 0, sale: 0.07, extra: { niacina_mg: 14, selenio_mcg: 27, fosforo_mg: 220 } },
  },
  chicken_thigh: {
    canonicalId: "chicken_thigh",
    names: { it: ["coscia di pollo", "sovracoscia", "pollo disossato"], ja: ["鶏もも肉", "鶏腿肉", "骨なし鶏もも"], en: ["chicken thigh", "chicken leg", "boneless thigh"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 209, grassi: 10.9, grassi_saturi: 3, carboidrati: 0, zuccheri: 0, proteine: 26, fibre: 0, sale: 0.09, extra: { ferro_mg: 1.3, zinco_mg: 2.5, vitamina_b6_mg: 0.3 } },
  },
  chicken_breast: {
    canonicalId: "chicken_breast",
    names: { it: ["petto di pollo", "filetto di pollo", "pollo bianco"], ja: ["鶏むね肉", "鶏胸肉", "ササミ"], en: ["chicken breast", "chicken fillet", "white meat"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 165, grassi: 3.6, grassi_saturi: 1, carboidrati: 0, zuccheri: 0, proteine: 31, fibre: 0, sale: 0.07, extra: { niacina_mg: 14, selenio_mcg: 27, triptofano_mg: 350 } },
  },
  turkey: {
    canonicalId: "turkey",
    names: { it: ["tacchino", "carne di tacchino", "fesa di tacchino"], ja: ["七面鳥", "ターキー", "七面鳥の胸肉"], en: ["turkey", "turkey breast", "turkey thigh", "poultry"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 135, grassi: 1.7, grassi_saturi: 0.5, carboidrati: 0, zuccheri: 0, proteine: 29, fibre: 0, sale: 0.06, extra: { selenio_mcg: 31, vitamina_b6_mg: 0.5, triptofano_mg: 380 } },
  },
  lamb: {
    canonicalId: "lamb",
    names: { it: ["agnello", "carne di agnello", "abbacchio", "cosciotto"], ja: ["羊肉", "ラム", "ラム肉", "仔羊"], en: ["lamb", "lamb meat", "baby lamb", "rack of lamb"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 294, grassi: 21, grassi_saturi: 9, carboidrati: 0, zuccheri: 0, proteine: 25, fibre: 0, sale: 0.08, extra: { ferro_mg: 1.9, zinco_mg: 4.5, vitamina_b12_mcg: 2.3, cla_g: 0.5 } },
  },
  bacon: {
    canonicalId: "bacon",
    names: { it: ["pancetta", "bacon", "guanciale", "lardello"], ja: ["ベーコン", "パンチェッタ", "グアンチャーレ"], en: ["bacon", "pancetta", "pork belly", "smoked bacon"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 541, grassi: 42, grassi_saturi: 14, carboidrati: 1.4, zuccheri: 0, proteine: 37, fibre: 0, sale: 3.2, extra: { sodio_mg: 1260, vitamina_b1_mg: 0.4 } },
  },
  prosciutto: {
    canonicalId: "prosciutto",
    names: { it: ["prosciutto", "prosciutto crudo", "prosciutto cotto", "san daniele"], ja: ["プロシュット", "生ハム", "熟成ハム", "イタリアンハム"], en: ["prosciutto", "italian ham", "cured ham", "parma ham"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 245, grassi: 14, grassi_saturi: 5, carboidrati: 0, zuccheri: 0, proteine: 28, fibre: 0, sale: 3.5, extra: { ferro_mg: 1.5, zinco_mg: 2.8, vitamina_b12_mcg: 0.8 } },
  },
  salami: {
    canonicalId: "salami",
    names: { it: ["salame", "salami", "salamino", "salame milano"], ja: ["サラミ", "イタリアンサラミ", "ドライサラミ"], en: ["salami", "italian salami", "cured sausage"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 378, grassi: 30, grassi_saturi: 11, carboidrati: 2, zuccheri: 0.5, proteine: 24, fibre: 0, sale: 3.8, extra: { sodio_mg: 1500, vitamina_b12_mcg: 1.2 } },
  },
  sausage: {
    canonicalId: "sausage",
    names: { it: ["salsiccia", "luganega", "salame", "cotechino", "wurstel"], ja: ["ソーセージ", "サルシッチャ", "サラミ", "ウィンナー"], en: ["sausage", "italian sausage", "salami", "pork sausage"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 301, grassi: 24, grassi_saturi: 9, carboidrati: 2, zuccheri: 1, proteine: 18, fibre: 0, sale: 1.8, extra: { vitamina_b12_mcg: 1.1, zinco_mg: 2.4 } },
  },
  ground_beef: {
    canonicalId: "ground_beef",
    names: { it: ["carne macinata", "macinato di manzo", "tritato"], ja: ["挽き肉", "牛ひき肉", "ミンチ"], en: ["ground beef", "minced beef", "beef mince"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 332, grassi: 30, grassi_saturi: 12, carboidrati: 0, zuccheri: 0, proteine: 17, fibre: 0, sale: 0.08, extra: { ferro_mg: 2.1, zinco_mg: 4.2, vitamina_b12_mcg: 2.4 } },
  },
  ground_pork: {
    canonicalId: "ground_pork",
    names: { it: ["macinato di maiale", "tritato di maiale"], ja: ["豚ひき肉", "豚ミンチ"], en: ["ground pork", "minced pork", "pork mince"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 263, grassi: 18, grassi_saturi: 6, carboidrati: 0, zuccheri: 0, proteine: 25, fibre: 0, sale: 0.09, extra: { tiamina_mg: 0.5, selenio_mcg: 35 } },
  },
  ground_chicken: {
    canonicalId: "ground_chicken",
    names: { it: ["pollo macinato", "macinato di pollo"], ja: ["鶏ひき肉", "鶏ミンチ"], en: ["ground chicken", "minced chicken"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 143, grassi: 5.5, grassi_saturi: 1.5, carboidrati: 0, zuccheri: 0, proteine: 23, fibre: 0, sale: 0.08, extra: { niacina_mg: 11, selenio_mcg: 24 } },
  },
  duck: {
    canonicalId: "duck",
    names: { it: ["anatra", "carne d'anatra", "petto d'anatra"], ja: ["鴨肉", "アヒル", "鴨胸肉"], en: ["duck", "duck breast", "duck meat", "poultry"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 337, grassi: 28, grassi_saturi: 10, carboidrati: 0, zuccheri: 0, proteine: 19, fibre: 0, sale: 0.1, extra: { ferro_mg: 2.7, vitamina_b12_mcg: 0.4, grassi_omega3_g: 0.3 } },
  },
  rabbit: {
    canonicalId: "rabbit",
    names: { it: ["coniglio", "carne di coniglio", "coniglio disossato"], ja: ["ウサギ", "兎肉", "ウサギ肉"], en: ["rabbit", "rabbit meat", "bunny"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 173, grassi: 3.5, grassi_saturi: 1.1, carboidrati: 0, zuccheri: 0, proteine: 33, fibre: 0, sale: 0.08, extra: { vitamina_b12_mcg: 7.2, niacina_mg: 10, fosforo_mg: 204 } },
  },
  veal: {
    canonicalId: "veal",
    names: { it: ["vitello", "carne di vitello", "scaloppine"], ja: ["仔牛肉", "ヴェール", "子牛"], en: ["veal", "calf meat", "young beef"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 172, grassi: 5.1, grassi_saturi: 2, carboidrati: 0, zuccheri: 0, proteine: 31, fibre: 0, sale: 0.07, extra: { ferro_mg: 1.2, zinco_mg: 3.8, vitamina_b12_mcg: 1.5 } },
  },
  offal: {
    canonicalId: "offal",
    names: { it: ["frattaglie", "interiora", "fegato", "cuore", "trippa"], ja: ["内臓", "ホルモン", "レバー", "ハツ", "ミノ"], en: ["offal", "organ meat", "liver", "heart", "tripe"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 175, grassi: 4.5, grassi_saturi: 1.5, carboidrati: 3.5, zuccheri: 0, proteine: 26, fibre: 0, sale: 0.12, extra: { ferro_mg: 6.5, vitamina_a_mcg: 9500, vitamina_b12_mcg: 80, rame_mg: 12 } },
  },
  beef_steak: {
    canonicalId: "beef_steak",
    names: { it: ["bistecca", "filetto di manzo", "costata", "fiorentina"], ja: ["ステーキ", "ビーフステーキ", "フィレ肉"], en: ["steak", "beef steak", "ribeye", "t-bone"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 271, grassi: 19, grassi_saturi: 8, carboidrati: 0, zuccheri: 0, proteine: 25, fibre: 0, sale: 0.07, extra: { ferro_mg: 2.8, zinco_mg: 5.2, creatina_g: 0.5, coq10_mg: 2.5 } },
  },
  pork_belly: {
    canonicalId: "pork_belly",
    names: { it: ["pancetta di maiale", "pancia di maiale", "guanciale"], ja: ["豚バラ", "バラ肉", "豚トロ"], en: ["pork belly", "pork side", "bacon slab"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 518, grassi: 53, grassi_saturi: 19, carboidrati: 0, zuccheri: 0, proteine: 9.3, fibre: 0, sale: 0.1, extra: { vitamina_b1_mg: 0.4, selenio_mcg: 30 } },
  },
  pork_tenderloin: {
    canonicalId: "pork_tenderloin",
    names: { it: ["filetto di maiale", "lonza", "filetto suino"], ja: ["豚ヒレ", "豚テンダーロイン"], en: ["pork tenderloin", "pork fillet", "pork loin"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 143, grassi: 3.5, grassi_saturi: 1.2, carboidrati: 0, zuccheri: 0, proteine: 26, fibre: 0, sale: 0.06, extra: { tiamina_mg: 0.8, vitamina_b6_mg: 0.5, selenio_mcg: 42 } },
  },
  chicken_liver: {
    canonicalId: "chicken_liver",
    names: { it: ["fegatini di pollo", "fegato di pollo", "frattaglie"], ja: ["鶏レバー", "レバー", "内臓"], en: ["chicken liver", "poultry liver", "offal"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 119, grassi: 4.8, grassi_saturi: 1.4, carboidrati: 0.7, zuccheri: 0, proteine: 16.9, fibre: 0, sale: 0.09, extra: { ferro_mg: 9, vitamina_a_mcg: 3300, vitamina_b12_mcg: 16, folati_mcg: 560 } },
  },
  ground_mixed: {
    canonicalId: "ground_mixed",
    names: { it: ["carne mista macinata", "macinato misto"], ja: ["合い挽き肉", "ミックスミンチ"], en: ["ground meat mix", "mixed mince", "beef-pork blend"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 295, grassi: 24, grassi_saturi: 9, carboidrati: 0, zuccheri: 0, proteine: 21, fibre: 0, sale: 0.08, extra: { ferro_mg: 1.8, zinco_mg: 3.5, vitamina_b12_mcg: 1.8 } },
  },
  cured_meat: {
    canonicalId: "cured_meat",
    names: { it: ["salumi", "affettati", "carne stagionata"], ja: ["加工肉", "ハム", "サラミ"], en: ["cured meat", "deli meat", "charcuterie"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 280, grassi: 20, grassi_saturi: 7, carboidrati: 1.5, zuccheri: 0.5, proteine: 24, fibre: 0, sale: 3.2, extra: { sodio_mg: 1260, nitrati_mg: 45 } },
  },

  // ── Pesce e frutti di mare ───────────────────────────────────────────────
  salmon: {
    canonicalId: "salmon",
    names: { it: ["salmone", "filetto di salmone", "salmone fresco", "salmone affumicato"], ja: ["鮭", "サーモン", "生鮭", "燻製サーモン"], en: ["salmon", "salmon fillet", "fresh salmon", "smoked salmon"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 208, grassi: 13, grassi_saturi: 3.1, carboidrati: 0, zuccheri: 0, proteine: 20, fibre: 0, sale: 0.06, extra: { omega3_epa_dha_g: 2.3, vitamina_d_mcg: 11, astaxantina_mg: 4, selenio_mcg: 36 } },
  },
  tuna: {
    canonicalId: "tuna",
    names: { it: ["tonno", "filetto di tonno", "tonno fresco", "tonno in scatola"], ja: ["マグロ", "ツナ", "本マグロ", "缶詰マグロ"], en: ["tuna", "tuna fillet", "fresh tuna", "canned tuna"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 144, grassi: 4.9, grassi_saturi: 1.3, carboidrati: 0, zuccheri: 0, proteine: 23, fibre: 0, sale: 0.05, extra: { omega3_epa_dha_g: 0.3, vitamina_d_mcg: 4, selenio_mcg: 90, niacina_mg: 18 } },
  },
  bonito: {
    canonicalId: "bonito",
    names: { it: ["palamita", "tonnetto", "bonito"], ja: ["カツオ", "鰹", "かつお節"], en: ["bonito", "skipjack tuna", "katsuobushi"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 152, grassi: 4.2, grassi_saturi: 1.1, carboidrati: 0, zuccheri: 0, proteine: 25, fibre: 0, sale: 0.08, extra: { omega3_epa_dha_g: 0.8, vitamina_b12_mcg: 12, niacina_mg: 19, inosina_mg: 150 } },
  },
  cod: {
    canonicalId: "cod",
    names: { it: ["merluzzo", "baccalà", "stoccafisso", "filetto di merluzzo"], ja: ["タラ", "鱈", "干しダラ", "塩ダラ"], en: ["cod", "cod fillet", "dried cod", "salted cod"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 82, grassi: 0.7, grassi_saturi: 0.1, carboidrati: 0, zuccheri: 0, proteine: 18, fibre: 0, sale: 0.06, extra: { vitamina_b12_mcg: 0.9, selenio_mcg: 33, fosforo_mg: 203 } },
  },
  haddock: {
    canonicalId: "haddock",
    names: { it: ["eglefino", "merlano", "pesce bianco"], ja: ["ハドック", "白身魚"], en: ["haddock", "smoked haddock", "white fish"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 87, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 0, zuccheri: 0, proteine: 19, fibre: 0, sale: 0.08, extra: { selenio_mcg: 36, vitamina_b12_mcg: 1.2, iodio_mcg: 120 } },
  },
  shrimp: {
    canonicalId: "shrimp",
    names: { it: ["gamberi", "gamberetti", "gambero rosso", "code di gambero"], ja: ["エビ", "海老", "大正エビ", "車海老"], en: ["shrimp", "prawns", "king prawns", "tiger prawns"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 99, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 0.2, zuccheri: 0, proteine: 24, fibre: 0, sale: 0.12, extra: { astaxantina_mg: 2, selenio_mcg: 38, zinco_mg: 1.6, colesterolo_mg: 152 } },
    peso_medio_unità: 15,
  },
  prawns: {
    canonicalId: "prawns",
    names: { it: ["gamberoni", "gamberi giganti", "code grandi"], ja: ["大エビ", "オニエビ", "車海老"], en: ["prawns", "large prawns", "jumbo shrimp"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 106, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 0.5, zuccheri: 0, proteine: 23, fibre: 0, sale: 0.15, extra: { astaxantina_mg: 3, selenio_mcg: 42, zinco_mg: 1.9 } },
    peso_medio_unità: 35,
  },
  squid: {
    canonicalId: "squid",
    names: { it: ["calamari", "seppie", "totani", "anelli di calamaro"], ja: ["イカ", "烏賊", "スルメイカ", "アオリイカ"], en: ["squid", "calamari", "cuttlefish", "baby squid"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 92, grassi: 1.4, grassi_saturi: 0.4, carboidrati: 3.1, zuccheri: 0, proteine: 16, fibre: 0, sale: 0.2, extra: { rame_mg: 1.9, vitamina_b12_mcg: 1.4, taurina_mg: 350 } },
  },
  cuttlefish: {
    canonicalId: "cuttlefish",
    names: { it: ["seppia", "seppie", "nero di seppia"], ja: ["コウイカ", "墨イカ", "イカ墨"], en: ["cuttlefish", "ink fish", "cuttlefish ink"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 79, grassi: 0.7, grassi_saturi: 0.2, carboidrati: 2.5, zuccheri: 0, proteine: 16, fibre: 0, sale: 0.3, extra: { rame_mg: 1.5, vitamina_b12_mcg: 4.5, taurina_mg: 400 } },
  },
  octopus: {
    canonicalId: "octopus",
    names: { it: ["polpo", "polvera", "polipo", "tentacoli di polpo"], ja: ["タコ", "蛸", "マダコ", "茹でタコ"], en: ["octopus", "baby octopus", "octopus tentacles"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 82, grassi: 1, grassi_saturi: 0.2, carboidrati: 2.2, zuccheri: 0, proteine: 15, fibre: 0, sale: 0.2, extra: { ferro_mg: 9.5, vitamina_b12_mcg: 20, taurina_mg: 500, zinco_mg: 1.7 } },
  },
  mussels: {
    canonicalId: "mussels",
    names: { it: ["cozze", "mitili", "frutti di mare"], ja: ["ムール貝", "イガイ", "貝類"], en: ["mussels", "clams", "shellfish", "seafood"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 86, grassi: 2.2, grassi_saturi: 0.5, carboidrati: 3.7, zuccheri: 0, proteine: 12, fibre: 0, sale: 0.3, extra: { vitamina_b12_mcg: 16, ferro_mg: 6.7, selenio_mcg: 45, omega3_g: 0.3 } },
  },
  clams: {
    canonicalId: "clams",
    names: { it: ["vongole", "arselle", "telline", "cappalunga"], ja: ["アサリ", "ハマグリ", "貝類", "シジミ"], en: ["clams", "vongole", "japanese clams", "littleneck clams"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 74, grassi: 1, grassi_saturi: 0.2, carboidrati: 2.6, zuccheri: 0, proteine: 13, fibre: 0, sale: 0.2, extra: { ferro_mg: 14, vitamina_b12_mcg: 21, zinco_mg: 1.4 } },
  },
  scallops: {
    canonicalId: "scallops",
    names: { it: ["capesante", "conchiglie di mare", "pettini"], ja: ["ホタテ", "帆立貝", "貝柱"], en: ["scallops", "sea scallops", "bay scallops"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 88, grassi: 0.8, grassi_saturi: 0.1, carboidrati: 2.4, zuccheri: 0, proteine: 17, fibre: 0, sale: 0.2, extra: { vitamina_b12_mcg: 2.2, magnesio_mg: 37, fosforo_mg: 205, coq10_mg: 0.4 } },
  },
  anchovies: {
    canonicalId: "anchovies",
    names: { it: ["acciughe", "alici", "acciughe sotto sale"], ja: ["アンチョビ", "カタクチイワシ", "塩漬けアンチョビ"], en: ["anchovies", "salted anchovies", "anchovy fillets"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 131, grassi: 4.8, grassi_saturi: 1.3, carboidrati: 0, zuccheri: 0, proteine: 20, fibre: 0, sale: 3.8, extra: { omega3_epa_dha_g: 1.4, calcio_mg: 232, vitamina_d_mcg: 4, niacina_mg: 14 } },
  },
  sardines: {
    canonicalId: "sardines",
    names: { it: ["sardine", "sarde fresche", "sardine in scatola"], ja: ["イワシ", "鰯", "缶詰イワシ"], en: ["sardines", "fresh sardines", "canned sardines"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 208, grassi: 11, grassi_saturi: 2.8, carboidrati: 0, zuccheri: 0, proteine: 25, fibre: 0, sale: 0.1, extra: { omega3_epa_dha_g: 2.2, vitamina_d_mcg: 7, calcio_mg: 382, vitamina_b12_mcg: 8.9 } },
  },
  sea_bass: {
    canonicalId: "sea_bass",
    names: { it: ["branzino", "spigola", "pesce bianco"], ja: ["スズキ", "シーバス", "白身魚"], en: ["sea bass", "european bass", "white fish", "branzino"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 97, grassi: 2, grassi_saturi: 0.5, carboidrati: 0, zuccheri: 0, proteine: 18, fibre: 0, sale: 0.08, extra: { omega3_epa_dha_g: 0.4, selenio_mcg: 36, vitamina_d_mcg: 3 } },
  },
  sea_bream: {
    canonicalId: "sea_bream",
    names: { it: ["orata", "dorata", "pesce azzurro"], ja: ["タイ", "真鯛", "マダイ"], en: ["sea bream", "gilthead bream", "red snapper"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 96, grassi: 1.3, grassi_saturi: 0.3, carboidrati: 0, zuccheri: 0, proteine: 20, fibre: 0, sale: 0.07, extra: { selenio_mcg: 47, vitamina_b6_mg: 0.3, fosforo_mg: 240 } },
  },
  mackerel: {
    canonicalId: "mackerel",
    names: { it: ["sgombro", "sgombro fresco", "sgombro affumicato"], ja: ["サバ", "鯖", "焼きサバ"], en: ["mackerel", "fresh mackerel", "smoked mackerel"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 205, grassi: 14, grassi_saturi: 3.3, carboidrati: 0, zuccheri: 0, proteine: 19, fibre: 0, sale: 0.09, extra: { omega3_epa_dha_g: 2.7, vitamina_d_mcg: 16, vitamina_b12_mcg: 19, selenio_mcg: 52 } },
  },
  crab: {
    canonicalId: "crab",
    names: { it: ["granchio", "polpa di granchio", "granchio reale"], ja: ["カニ", "蟹", "タラバガニ", "ズワイガニ"], en: ["crab", "crab meat", "king crab", "snow crab"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 97, grassi: 1.5, grassi_saturi: 0.2, carboidrati: 0, zuccheri: 0, proteine: 19, fibre: 0, sale: 0.3, extra: { omega3_g: 0.4, zinco_mg: 4.3, rame_mg: 1, vitamina_b12_mcg: 9.8 } },
  },
  lobster: {
    canonicalId: "lobster",
    names: { it: ["aragosta", "astice", "code di aragosta"], ja: ["ロブスター", "伊勢海老", "アメリカンロブスター"], en: ["lobster", "spiny lobster", "american lobster", "lobster tail"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 89, grassi: 0.9, grassi_saturi: 0.2, carboidrati: 0.5, zuccheri: 0, proteine: 19, fibre: 0, sale: 0.3, extra: { omega3_g: 0.2, rame_mg: 1.9, zinco_mg: 3.1, vitamina_e_mg: 1.2 } },
  },
  eel: {
    canonicalId: "eel",
    names: { it: ["anguilla", "anguilla affumicata", "unagi"], ja: ["ウナギ", "鰻", "蒲焼き", "白焼き"], en: ["eel", "unagi", "smoked eel", "freshwater eel"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 184, grassi: 11, grassi_saturi: 3, carboidrati: 0, zuccheri: 0, proteine: 18, fibre: 0, sale: 0.05, extra: { omega3_epa_dha_g: 0.8, vitamina_a_mcg: 1000, vitamina_d_mcg: 23, vitamina_b12_mcg: 5 } },
  },
  roe: {
    canonicalId: "roe",
    names: { it: ["uova di pesce", "bottarga", "caviale", "ikura"], ja: ["魚卵", "イクラ", "タラコ", "キャビア", "ボッタルガ"], en: ["fish roe", "caviar", "ikura", "bottarga", "tobiko"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 264, grassi: 18, grassi_saturi: 4.3, carboidrati: 4, zuccheri: 0, proteine: 25, fibre: 0, sale: 1.5, extra: { omega3_epa_dha_g: 6.8, vitamina_b12_mcg: 20, vitamina_d_mcg: 3, colina_mg: 490 } },
  },
  swordfish: {
    canonicalId: "swordfish",
    names: { it: ["pesce spada", "spada", "filetto di spada"], ja: ["メカジキ", "旗魚"], en: ["swordfish", "swordfish steak", "espadon"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 144, grassi: 5, grassi_saturi: 1.4, carboidrati: 0, zuccheri: 0, proteine: 23, fibre: 0, sale: 0.08, extra: { omega3_epa_dha_g: 0.7, selenio_mcg: 52, vitamina_d_mcg: 4, niacina_mg: 11 } },
  },
  halibut: {
    canonicalId: "halibut",
    names: { it: ["ippoglosso", "rombo", "pesce piatto"], ja: ["オヒョウ", "カレイ", "平目"], en: ["halibut", "flounder", "flatfish"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 111, grassi: 2.3, grassi_saturi: 0.4, carboidrati: 0, zuccheri: 0, proteine: 21, fibre: 0, sale: 0.07, extra: { omega3_epa_dha_g: 0.5, magnesio_mg: 107, selenio_mcg: 47, vitamina_b6_mg: 0.4 } },
  },
  trout: {
    canonicalId: "trout",
    names: { it: ["trota", "trota salmonata", "trota iridea"], ja: ["マス", "鱒", "ニジマス"], en: ["trout", "rainbow trout", "brook trout"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 148, grassi: 6.6, grassi_saturi: 1.5, carboidrati: 0, zuccheri: 0, proteine: 20, fibre: 0, sale: 0.04, extra: { omega3_epa_dha_g: 1.1, vitamina_d_mcg: 16, vitamina_b12_mcg: 4.5, fosforo_mg: 271 } },
  },
  sea_urchin: {
    canonicalId: "sea_urchin",
    names: { it: ["riccio di mare", "uni", "uova di riccio"], ja: ["ウニ", "雲丹", "バフンウニ"], en: ["sea urchin", "uni", "sea urchin roe"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 110, grassi: 4, grassi_saturi: 0.8, carboidrati: 2, zuccheri: 0, proteine: 15, fibre: 0, sale: 0.4, extra: { omega3_g: 0.6, zinco_mg: 1.2, vitamina_e_mg: 1.5, iodio_mcg: 200 } },
  },
  cuttlefish_ink: {
    canonicalId: "cuttlefish_ink",
    names: { it: ["nero di seppia", "inchiostro di seppia"], ja: ["イカ墨", "墨", "スミ"], en: ["cuttlefish ink", "squid ink", "black ink"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 30, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 4, zuccheri: 0, proteine: 4, fibre: 0, sale: 0.8, extra: { ferro_mg: 8, melanina_mg: 50, taurina_mg: 200 } },
  },

  // ── Verdure ──────────────────────────────────────────────────────────────
  tomato: {
    canonicalId: "tomato",
    names: { it: ["pomodoro", "pomodori", "pomodoro ciliegino", "san marzano", "pelati"], ja: ["トマト", "プチトマト", "サンマルツァーノ", "ホールトマト"], en: ["tomato", "cherry tomato", "roma tomato", "canned tomatoes"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 18, grassi: 0.2, grassi_saturi: 0, carboidrati: 3.9, zuccheri: 2.6, proteine: 0.9, fibre: 1.2, sale: 0.01, extra: { licopene_mg: 2.6, vitamina_c_mg: 14, potassio_mg: 237 } },
  },
  cherry_tomato: {
    canonicalId: "cherry_tomato",
    names: { it: ["pomodorini", "ciliegini", "datterini", "pachino"], ja: ["ミニトマト", "プチトマト", "チェリートマト"], en: ["cherry tomatoes", "grape tomatoes", "mini tomatoes"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 20, grassi: 0.2, grassi_saturi: 0, carboidrati: 4.2, zuccheri: 3, proteine: 1, fibre: 1.1, sale: 0.01, extra: { licopene_mg: 3, vitamina_c_mg: 16, potassio_mg: 245 } },
    peso_medio_unità: 15,
  },
  onion: {
    canonicalId: "onion",
    names: { it: ["cipolla", "cipolla dorata", "cipolla rossa", "scalogno", "porro"], ja: ["玉ねぎ", "オニオン", "赤玉ねぎ", "エシャロット", "ネギ"], en: ["onion", "yellow onion", "red onion", "shallot", "leek"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 40, grassi: 0.1, grassi_saturi: 0, carboidrati: 9.3, zuccheri: 4.2, proteine: 1.1, fibre: 1.7, sale: 0.01, extra: { quercetina_mg: 23, vitamina_c_mg: 7, potassio_mg: 146 } },
  },
  shallot: {
    canonicalId: "shallot",
    names: { it: ["scalogno", "scalogni", "cipollotto"], ja: ["エシャロット", "小玉ねぎ", "シャロット"], en: ["shallot", "eschalot", "small onion"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 72, grassi: 0.1, grassi_saturi: 0, carboidrati: 17, zuccheri: 8, proteine: 2.5, fibre: 3.2, sale: 0.01, extra: { quercetina_mg: 35, allil_solfuri_mg: 15, potassio_mg: 334 } },
  },
  garlic: {
    canonicalId: "garlic",
    names: { it: ["aglio", "spicchio d'aglio", "aglio fresco"], ja: ["ニンニク", "大蒜", "にんにく"], en: ["garlic", "garlic clove", "fresh garlic"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 149, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 33, zuccheri: 1, proteine: 6.4, fibre: 2.1, sale: 0.02, extra: { allicina_mg: 5, vitamina_c_mg: 31, manganese_mg: 1.7, selenio_mcg: 14 } },
    peso_medio_unità: 5,
  },
  carrot: {
    canonicalId: "carrot",
    names: { it: ["carota", "carote", "carota novella"], ja: ["人参", "ニンジン", "キャロット"], en: ["carrot", "carrots", "baby carrot"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 41, grassi: 0.2, grassi_saturi: 0, carboidrati: 10, zuccheri: 4.7, proteine: 0.9, fibre: 2.8, sale: 0.01, extra: { beta_carotene_mcg: 8285, vitamina_a_mcg: 835, potassio_mg: 320 } },
  },
  celery: {
    canonicalId: "celery",
    names: { it: ["sedano", "costa di sedano", "sedano rapa"], ja: ["セロリ", "芹", "セロリスティック"], en: ["celery", "celery stalk", "celeriac"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 14, grassi: 0.2, grassi_saturi: 0, carboidrati: 3, zuccheri: 1.3, proteine: 0.7, fibre: 1.6, sale: 0.08, extra: { apigenina_mg: 2, vitamina_k_mcg: 30, potassio_mg: 260 } },
  },
  bell_pepper: {
    canonicalId: "bell_pepper",
    names: { it: ["peperone", "peperoni", "peperone rosso", "peperone giallo", "peperone verde"], ja: ["パプリカ", "ピーマン", "赤パプリカ", "黄パプリカ"], en: ["bell pepper", "red pepper", "yellow pepper", "green pepper"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 31, grassi: 0.3, grassi_saturi: 0, carboidrati: 6, zuccheri: 4.2, proteine: 1, fibre: 2.1, sale: 0.01, extra: { vitamina_c_mg: 128, capsantina_mg: 0.5, vitamina_a_mcg: 157 } },
  },
  zucchini: {
    canonicalId: "zucchini",
    names: { it: ["zucchina", "zucchine", "zucchino", "fiore di zucca"], ja: ["ズッキーニ", "西葫芦", "ズッキーニの花"], en: ["zucchini", "courgette", "baby zucchini"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 17, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 3.1, zuccheri: 2.5, proteine: 1.2, fibre: 1, sale: 0.01, extra: { vitamina_c_mg: 18, luteina_mcg: 2125, potassio_mg: 261 } },
  },
  eggplant: {
    canonicalId: "eggplant",
    names: { it: ["melanzana", "melanzane", "melanzana viola"], ja: ["ナス", "茄子", "なすび", "丸ナス"], en: ["eggplant", "aubergine", "purple eggplant"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 25, grassi: 0.2, grassi_saturi: 0, carboidrati: 6, zuccheri: 3.5, proteine: 1, fibre: 3, sale: 0.01, extra: { nasunina_mg: 7, potassio_mg: 230, antiossidanti_anthocyanin: true } },
  },
  potato: {
    canonicalId: "potato",
    names: { it: ["patata", "patate", "patata novella", "patata a pasta gialla"], ja: ["ジャガイモ", "馬鈴薯", "ポテト", "新ジャガ"], en: ["potato", "potatoes", "new potato", "yellow potato"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 77, grassi: 0.1, grassi_saturi: 0, carboidrati: 17, zuccheri: 0.8, proteine: 2, fibre: 2.2, sale: 0.01, extra: { vitamina_c_mg: 20, potassio_mg: 421, vitamina_b6_mg: 0.3 } },
  },
  sweet_potato: {
    canonicalId: "sweet_potato",
    names: { it: ["patata dolce", "patata americana", "batata"], ja: ["サツマイモ", "薩摩芋", "甘藷"], en: ["sweet potato", "yam", "japanese sweet potato"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 86, grassi: 0.1, grassi_saturi: 0, carboidrati: 20, zuccheri: 4.2, proteine: 1.6, fibre: 3, sale: 0.01, extra: { beta_carotene_mcg: 8509, vitamina_a_mcg: 709, vitamina_c_mg: 2.4 } },
  },
  spinach: {
    canonicalId: "spinach",
    names: { it: ["spinaci", "foglie di spinacio", "spinacino", "baby spinach"], ja: ["ほうれん草", "ホウレンソウ", "ベビーほうれん草"], en: ["spinach", "spinach leaves", "baby spinach"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 23, grassi: 0.4, grassi_saturi: 0.1, carboidrati: 3.6, zuccheri: 0.4, proteine: 2.9, fibre: 2.2, sale: 0.08, extra: { ferro_mg: 2.7, vitamina_k_mcg: 483, folati_mcg: 194, luteina_mcg: 12198 } },
  },
  lettuce: {
    canonicalId: "lettuce",
    names: { it: ["lattuga", "insalata", "lattuga romana", "rucola", "songino"], ja: ["レタス", "サラダ菜", "ロメインレタス", "ルッコラ"], en: ["lettuce", "salad", "romaine lettuce", "arugula"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 15, grassi: 0.2, grassi_saturi: 0, carboidrati: 2.9, zuccheri: 0.8, proteine: 1.4, fibre: 1.3, sale: 0.03, extra: { vitamina_k_mcg: 126, folati_mcg: 38, vitamina_a_mcg: 166 } },
  },
  arugula: {
    canonicalId: "arugula",
    names: { it: ["rucola", "rucola selvatica", "eruca"], ja: ["ルッコラ", "ロケット", "アルグラ"], en: ["arugula", "rocket", "rucola"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 25, grassi: 0.7, grassi_saturi: 0.1, carboidrati: 3.7, zuccheri: 2.1, proteine: 2.6, fibre: 1.6, sale: 0.03, extra: { vitamina_k_mcg: 109, glucosinolati_mg: 8, nitrati_mg: 250 } },
  },
  cabbage: {
    canonicalId: "cabbage",
    names: { it: ["cavolo", "cavolo cappuccio", "cavolo verza", "cavolfiore"], ja: ["キャベツ", "玉菜", "カリフラワー", "ブロッコリー"], en: ["cabbage", "green cabbage", "cauliflower", "broccoli"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 25, grassi: 0.1, grassi_saturi: 0, carboidrati: 5.8, zuccheri: 3.2, proteine: 1.3, fibre: 2.5, sale: 0.02, extra: { vitamina_c_mg: 37, vitamina_k_mcg: 76, glucosinolati_mg: 45 } },
  },
  broccoli: {
    canonicalId: "broccoli",
    names: { it: ["broccolo", "broccoli", "cime di rapa"], ja: ["ブロッコリー", "緑花野菜", "スティックセニョール"], en: ["broccoli", "broccoli florets", "broccolini"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 34, grassi: 0.4, grassi_saturi: 0.1, carboidrati: 7, zuccheri: 1.7, proteine: 2.8, fibre: 2.6, sale: 0.03, extra: { vitamina_c_mg: 89, sulforafano_mg: 73, vitamina_k_mcg: 102, folati_mcg: 63 } },
  },
  cauliflower: {
    canonicalId: "cauliflower",
    names: { it: ["cavolfiore", "fiore di cavolo", "cavolo bianco"], ja: ["カリフラワー", "花野菜", "ホワイトカリフラワー"], en: ["cauliflower", "white cauliflower", "cauli"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 25, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 5, zuccheri: 1.9, proteine: 1.9, fibre: 2, sale: 0.03, extra: { vitamina_c_mg: 48, colina_mg: 44, glucosinolati_mg: 30 } },
  },
  mushroom: {
    canonicalId: "mushroom",
    names: { it: ["fungo", "funghi", "champignon", "porcino", "shiitake"], ja: ["キノコ", "マッシュルーム", "椎茸", "シメジ", "エリンギ"], en: ["mushroom", "button mushroom", "shiitake", "porcini"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 22, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 3.3, zuccheri: 2, proteine: 3.1, fibre: 1, sale: 0.01, extra: { vitamina_d_mcg: 0.2, selenio_mcg: 9, ergotioneina_mg: 0.5 } },
  },
  shiitake: {
    canonicalId: "shiitake",
    names: { it: ["shiitake", "funghi shiitake", "funghi cinesi"], ja: ["椎茸", "シイタケ", "干し椎茸"], en: ["shiitake", "shiitake mushroom", "dried shiitake"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 34, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 7, zuccheri: 2.4, proteine: 2.2, fibre: 2.5, sale: 0.01, extra: { lentinano_mg: 1, vitamina_d_mcg: 18, rame_mg: 0.9, zinco_mg: 1 } },
  },
  enoki: {
    canonicalId: "enoki",
    names: { it: ["enoki", "funghi enoki", "funghi ad ago"], ja: ["エノキ", "榎茸", "えのきだけ"], en: ["enoki", "enoki mushroom", "golden needle mushroom"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 32, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 7.8, zuccheri: 2.5, proteine: 2.7, fibre: 2.7, sale: 0.01, extra: { flammulina_mg: 0.8, vitamina_b3_mg: 3.6, potassio_mg: 359 } },
  },
  asparagus: {
    canonicalId: "asparagus",
    names: { it: ["asparago", "asparagi", "asparagi verdi", "asparagi bianchi"], ja: ["アスパラガス", "グリーンアスパラ", "ホワイトアスパラ"], en: ["asparagus", "green asparagus", "white asparagus"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 20, grassi: 0.1, grassi_saturi: 0, carboidrati: 3.9, zuccheri: 1.9, proteine: 2.2, fibre: 2.1, sale: 0.01, extra: { folati_mcg: 52, vitamina_k_mcg: 42, asparagina_mg: 200, glutatione_mg: 28 } },
  },
  green_beans: {
    canonicalId: "green_beans",
    names: { it: ["fagiolini", "cornetti", "fagioli verdi"], ja: ["インゲン", "さやいんげん", "グリーンビーンズ"], en: ["green beans", "string beans", "french beans"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 31, grassi: 0.2, grassi_saturi: 0.1, carboidrati: 7, zuccheri: 3.3, proteine: 1.8, fibre: 2.7, sale: 0.01, extra: { vitamina_k_mcg: 43, folati_mcg: 33, silicio_mg: 7 } },
  },
  cucumber: {
    canonicalId: "cucumber",
    names: { it: ["cetriolo", "cetrioli", "cetriolo giapponese"], ja: ["キュウリ", "胡瓜", "きゅうり"], en: ["cucumber", "cucumbers", "japanese cucumber"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 15, grassi: 0.1, grassi_saturi: 0, carboidrati: 3.6, zuccheri: 1.7, proteine: 0.7, fibre: 0.5, sale: 0.01, extra: { vitamina_k_mcg: 16, potassio_mg: 147, cucurbitacina_mg: 0.3 } },
  },
  radish: {
    canonicalId: "radish",
    names: { it: ["ravanello", "ravanelli", "ravanello rosso", "daikon"], ja: ["大根", "ダイコン", "ラディッシュ", "赤大根"], en: ["radish", "daikon", "white radish", "red radish"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 16, grassi: 0.1, grassi_saturi: 0, carboidrati: 3.4, zuccheri: 1.9, proteine: 0.7, fibre: 1.6, sale: 0.02, extra: { vitamina_c_mg: 15, isotiocianati_mg: 3, potassio_mg: 233 } },
  },
  daikon: {
    canonicalId: "daikon",
    names: { it: ["daikon", "ravanello bianco", "ravanello giapponese"], ja: ["大根", "白大根", "ダイコン"], en: ["daikon", "japanese radish", "white radish"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 18, grassi: 0.1, grassi_saturi: 0, carboidrati: 4.1, zuccheri: 2.5, proteine: 0.6, fibre: 1.6, sale: 0.02, extra: { vitamina_c_mg: 22, isotiocianati_mg: 5, diastasi_enzima: true } },
  },
  ginger: {
    canonicalId: "ginger",
    names: { it: ["zenzero", "radice di zenzero", "zenzero fresco"], ja: ["生姜", "ショウガ", "新生姜"], en: ["ginger", "fresh ginger", "ginger root"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 80, grassi: 0.8, grassi_saturi: 0.2, carboidrati: 18, zuccheri: 1.7, proteine: 1.8, fibre: 2, sale: 0.01, extra: { gingerolo_mg: 15, zingerone_mg: 3, potassio_mg: 415, manganese_mg: 0.2 } },
  },
  leek: {
    canonicalId: "leek",
    names: { it: ["porro", "porri", "porro fresco"], ja: ["リーキ", "長ネギ", "西洋ネギ"], en: ["leek", "leeks", "fresh leek"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 61, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 14, zuccheri: 3.9, proteine: 1.5, fibre: 1.8, sale: 0.02, extra: { quercetina_mg: 8, vitamina_k_mcg: 47, folati_mcg: 64, allil_solfuri_mg: 10 } },
  },
  fennel: {
    canonicalId: "fennel",
    names: { it: ["finocchio", "finocchi", "bulbo di finocchio"], ja: ["フェンネル", "ウイキョウ", "フェンネルバルブ"], en: ["fennel", "fennel bulb", "florence fennel"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 31, grassi: 0.2, grassi_saturi: 0, carboidrati: 7, zuccheri: 3.9, proteine: 1.2, fibre: 3.1, sale: 0.05, extra: { anetolo_mg: 5, vitamina_c_mg: 12, potassio_mg: 414, folati_mcg: 27 } },
  },
  artichoke: {
    canonicalId: "artichoke",
    names: { it: ["carciofo", "carciofi", "cuore di carciofo"], ja: ["アーティチョーク", "チョウセンアザミ"], en: ["artichoke", "artichokes", "artichoke heart"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 47, grassi: 0.2, grassi_saturi: 0, carboidrati: 11, zuccheri: 1, proteine: 3.3, fibre: 5.4, sale: 0.02, extra: { cinarina_mg: 3, inulina_g: 2, folati_mcg: 68, potassio_mg: 370 } },
  },
  pumpkin: {
    canonicalId: "pumpkin",
    names: { it: ["zucca", "zucca gialla", "zucca hokkaido", "polpa di zucca"], ja: ["カボチャ", "南瓜", "かぼちゃ", "ホクホクカボチャ"], en: ["pumpkin", "butternut squash", "kabocha", "pumpkin puree"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 26, grassi: 0.1, grassi_saturi: 0, carboidrati: 6.5, zuccheri: 2.8, proteine: 1, fibre: 0.5, sale: 0.01, extra: { beta_carotene_mcg: 3100, vitamina_a_mcg: 260, vitamina_c_mg: 9, potassio_mg: 340 } },
  },
  corn: {
    canonicalId: "corn",
    names: { it: ["mais", "granoturco", "chicchi di mais", "pannocchia"], ja: ["トウモロコシ", "玉米", "コーン"], en: ["corn", "sweet corn", "corn kernels", "maize"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 86, grassi: 1.4, grassi_saturi: 0.2, carboidrati: 19, zuccheri: 3.2, proteine: 3.3, fibre: 2.4, sale: 0.02, extra: { luteina_mcg: 644, zeaxantina_mcg: 375, vitamina_c_mg: 7, folati_mcg: 42 } },
  },
  bamboo_shoots: {
    canonicalId: "bamboo_shoots",
    names: { it: ["germogli di bambù", "bamboo", "take no ko"], ja: ["竹の子", "筍", "タケノコ"], en: ["bamboo shoots", "bamboo", "takenoko"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 27, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 5, zuccheri: 3, proteine: 2.6, fibre: 2.2, sale: 0.01, extra: { potassio_mg: 533, rame_mg: 0.2, tirosina_mg: 90, fitosteroli_mg: 15 } },
  },
  konjac: {
    canonicalId: "konjac",
    names: { it: ["konjac", "konnyaku", "gelatina di konjac"], ja: ["こんにゃく", "コンニャク", "糸こんにゃく"], en: ["konjac", "konnyaku", "konjac jelly"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 10, grassi: 0, grassi_saturi: 0, carboidrati: 3, zuccheri: 0, proteine: 0, fibre: 3, sale: 0.01, extra: { glucomannano_g: 3, calcio_mg: 43, potassio_mg: 2 } },
  },
  bok_choy: {
    canonicalId: "bok_choy",
    names: { it: ["cavolo cinese", "pak choi", "cavolo asiatico"], ja: ["チンゲンサイ", "白菜", "青梗菜"], en: ["bok choy", "pak choi", "chinese cabbage"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 13, grassi: 0.2, grassi_saturi: 0, carboidrati: 2.2, zuccheri: 1.2, proteine: 1.5, fibre: 1, sale: 0.07, extra: { vitamina_c_mg: 45, vitamina_k_mcg: 46, beta_carotene_mcg: 449, calcio_mg: 105 } },
  },
  napa_cabbage: {
    canonicalId: "napa_cabbage",
    names: { it: ["cavolo cinese", "cavolo di pechino", "hakusai"], ja: ["白菜", "ハクサイ", "中国白菜"], en: ["napa cabbage", "chinese cabbage", "hakusai"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 16, grassi: 0.2, grassi_saturi: 0, carboidrati: 3.2, zuccheri: 1.7, proteine: 1.3, fibre: 1.2, sale: 0.01, extra: { vitamina_c_mg: 27, folati_mcg: 79, glucosinolati_mg: 25, potassio_mg: 250 } },
  },
  watercress: {
    canonicalId: "watercress",
    names: { it: ["crescione", "nasturzio", "erba acquatica"], ja: ["クレソン", "水菜", "ウォータークレス"], en: ["watercress", "garden cress", "nasturtium"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 11, grassi: 0.1, grassi_saturi: 0, carboidrati: 1.3, zuccheri: 0.2, proteine: 2.3, fibre: 0.5, sale: 0.02, extra: { vitamina_k_mcg: 250, vitamina_c_mg: 43, fenetil_isotiocianato_mg: 4, calcio_mg: 120 } },
  },
  mizuna: {
    canonicalId: "mizuna",
    names: { it: ["mizuna", "senape giapponese", "erba piccante"], ja: ["水菜", "ミズナ", "京菜"], en: ["mizuna", "japanese mustard greens", "kyona"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 20, grassi: 0.3, grassi_saturi: 0, carboidrati: 3.5, zuccheri: 1.5, proteine: 2, fibre: 1.5, sale: 0.02, extra: { vitamina_c_mg: 35, vitamina_k_mcg: 120, glucosinolati_mg: 30, beta_carotene_mcg: 1800 } },
  },
  komatsuna: {
    canonicalId: "komatsuna",
    names: { it: ["komatsuna", "spinacio giapponese"], ja: ["小松菜", "コマツナ"], en: ["komatsuna", "japanese mustard spinach"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 22, grassi: 0.4, grassi_saturi: 0.1, carboidrati: 3, zuccheri: 0.5, proteine: 2.5, fibre: 1.8, sale: 0.02, extra: { calcio_mg: 170, vitamina_c_mg: 39, beta_carotene_mcg: 2500, ferro_mg: 2.2 } },
  },
  burdock: {
    canonicalId: "burdock",
    names: { it: ["bardana", "radice di bardana", "gobo"], ja: ["ゴボウ", "牛蒡"], en: ["burdock root", "gobo", "greater burdock"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 72, grassi: 0.2, grassi_saturi: 0, carboidrati: 17, zuccheri: 3, proteine: 1.5, fibre: 3.3, sale: 0.01, extra: { inulina_g: 4, acido_clorogenico_mg: 15, potassio_mg: 308, arginina_mg: 85 } },
  },
  lotus_root: {
    canonicalId: "lotus_root",
    names: { it: ["radice di loto", "loto", "renkon"], ja: ["蓮根", "レンコン", "ハスの根"], en: ["lotus root", "renkon", "water lily root"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 74, grassi: 0.1, grassi_saturi: 0, carboidrati: 17, zuccheri: 2, proteine: 2, fibre: 2, sale: 0.01, extra: { vitamina_c_mg: 44, tannini_mg: 8, potassio_mg: 450, mucillagini_g: 1 } },
  },
  taro: {
    canonicalId: "taro",
    names: { it: ["taro", "patata di taro", "colocasia"], ja: ["里芋", "サトイモ", "タロイモ"], en: ["taro", "taro root", "dasheen"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 112, grassi: 0.2, grassi_saturi: 0.1, carboidrati: 27, zuccheri: 0.7, proteine: 1.5, fibre: 4.1, sale: 0.01, extra: { potassio_mg: 591, vitamina_e_mg: 2.9, mucillagini_g: 2, folati_mcg: 22 } },
  },
  myoga: {
    canonicalId: "myoga",
    names: { it: ["zenzero giapponese", "myoga", "germoglio di zenzero"], ja: ["茗荷", "ミョウガ"], en: ["myoga", "japanese ginger", "wild ginger"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 35, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 7, zuccheri: 2, proteine: 2, fibre: 2.5, sale: 0.01, extra: { alfa_pinene_mg: 12, vitamina_c_mg: 15, potassio_mg: 380, antiossidanti_flavonoidi: true } },
  },
  treviso: {
    canonicalId: "treviso",
    names: { it: ["radicchio", "radicchio di treviso", "radicchio rosso"], ja: ["ラディッキオ", "赤チコリ", "トレヴィーゾ"], en: ["radicchio", "red chicory", "treviso"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 23, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 4.5, zuccheri: 1.2, proteine: 1.4, fibre: 1.2, sale: 0.02, extra: { antociani_mg: 23, vitamina_k_mcg: 231, inulina_g: 1.5, acido_cicorico_mg: 5 } },
  },

  // ── Frutta ───────────────────────────────────────────────────────────────
  lemon: {
    canonicalId: "lemon",
    names: { it: ["limone", "limoni", "succo di limone", "scorza di limone"], ja: ["レモン", "檸檬", "レモン果汁", "レモンピール"], en: ["lemon", "lemons", "lemon juice", "lemon zest"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 29, grassi: 0.3, grassi_saturi: 0, carboidrati: 9, zuccheri: 2.5, proteine: 1.1, fibre: 2.8, sale: 0.01, extra: { vitamina_c_mg: 53, acido_citrico_g: 5, flavonoidi_mg: 25, potassio_mg: 138 } },
  },
  lime: {
    canonicalId: "lime",
    names: { it: ["lime", "limetta", "lime verde", "succo di lime"], ja: ["ライム", "緑色レモン", "ライム果汁"], en: ["lime", "key lime", "persian lime", "lime juice"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 30, grassi: 0.2, grassi_saturi: 0, carboidrati: 11, zuccheri: 1.7, proteine: 0.7, fibre: 2.8, sale: 0.01, extra: { vitamina_c_mg: 29, acido_citrico_g: 4, flavonoidi_mg: 18, potassio_mg: 102 } },
  },
  yuzu: {
    canonicalId: "yuzu",
    names: { it: ["yuzu", "agrume giapponese", "limone yuzu"], ja: ["柚子", "ユズ", "ゆず果汁"], en: ["yuzu", "japanese citrus", "yuzu juice"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 35, grassi: 0.3, grassi_saturi: 0, carboidrati: 10, zuccheri: 2, proteine: 0.8, fibre: 3, sale: 0.01, extra: { vitamina_c_mg: 40, limonene_mg: 15, naringina_mg: 8, potassio_mg: 120 } },
  },
  orange: {
    canonicalId: "orange",
    names: { it: ["arancia", "arance", "arancia rossa", "succo d'arancia"], ja: ["オレンジ", "橙", "ブラッドオレンジ", "オレンジ果汁"], en: ["orange", "blood orange", "navel orange", "orange juice"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 47, grassi: 0.1, grassi_saturi: 0, carboidrati: 12, zuccheri: 9, proteine: 0.9, fibre: 2.4, sale: 0.01, extra: { vitamina_c_mg: 53, folati_mcg: 40, antociani_mg: 15, potassio_mg: 181 } },
  },
  apple: {
    canonicalId: "apple",
    names: { it: ["mela", "mele", "mela rossa", "mela verde", "mela granny smith"], ja: ["リンゴ", "林檎", "赤リンゴ", "青リンゴ", "ふじりんご"], en: ["apple", "red apple", "green apple", "granny smith", "fuji apple"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 52, grassi: 0.2, grassi_saturi: 0, carboidrati: 14, zuccheri: 10, proteine: 0.3, fibre: 2.4, sale: 0.01, extra: { quercetina_mg: 4, pectina_g: 0.5, vitamina_c_mg: 4.6, potassio_mg: 107 } },
    peso_medio_unità: 180,
  },
  pear: {
    canonicalId: "pear",
    names: { it: ["pera", "pere", "pera abate", "pera william"], ja: ["梨", "ナシ", "洋梨", "和梨", "ラ・フランス"], en: ["pear", "european pear", "asian pear", "bartlett pear"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 57, grassi: 0.1, grassi_saturi: 0, carboidrati: 15, zuccheri: 10, proteine: 0.4, fibre: 3.1, sale: 0.01, extra: { sorbitolo_g: 2, vitamina_c_mg: 4.3, potassio_mg: 116, antiossidanti_flavonoidi: true } },
    peso_medio_unità: 170,
  },
  peach: {
    canonicalId: "peach",
    names: { it: ["pesca", "pesche", "pesca noce", "pesca gialla"], ja: ["桃", "モモ", "ネクタリン", "白桃", "黄桃"], en: ["peach", "yellow peach", "white peach", "nectarine"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 39, grassi: 0.3, grassi_saturi: 0, carboidrati: 10, zuccheri: 8, proteine: 0.9, fibre: 1.5, sale: 0.01, extra: { beta_carotene_mcg: 162, vitamina_c_mg: 6.6, potassio_mg: 190, antiossidanti_fenolici: true } },
    peso_medio_unità: 150,
  },
  strawberry: {
    canonicalId: "strawberry",
    names: { it: ["fragola", "fragole", "fragoline di bosco"], ja: ["イチゴ", "苺", "あまおう", "野イチゴ"], en: ["strawberry", "strawberries", "wild strawberry"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 32, grassi: 0.3, grassi_saturi: 0, carboidrati: 7.7, zuccheri: 4.9, proteine: 0.7, fibre: 2, sale: 0.01, extra: { vitamina_c_mg: 59, antociani_mg: 25, acido_ellagico_mg: 2, folati_mcg: 24 } },
    peso_medio_unità: 15,
  },
  raspberry: {
    canonicalId: "raspberry",
    names: { it: ["lampone", "lamponi", "frutti di bosco"], ja: ["ラズベリー", "木苺", "キイチゴ"], en: ["raspberry", "raspberries", "wild raspberry"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 52, grassi: 0.7, grassi_saturi: 0, carboidrati: 12, zuccheri: 4.4, proteine: 1.2, fibre: 6.5, sale: 0.01, extra: { vitamina_c_mg: 26, antociani_mg: 35, acido_ellagico_mg: 3, manganese_mg: 0.7 } },
  },
  blueberry: {
    canonicalId: "blueberry",
    names: { it: ["mirtillo", "mirtilli", "mirtillo nero"], ja: ["ブルーベリー", "越橘", "ビルベリー"], en: ["blueberry", "blueberries", "wild blueberry"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 57, grassi: 0.3, grassi_saturi: 0, carboidrati: 14, zuccheri: 10, proteine: 0.7, fibre: 2.4, sale: 0.01, extra: { antociani_mg: 163, vitamina_c_mg: 10, vitamina_k_mcg: 19, manganese_mg: 0.3 } },
  },
  cherry: {
    canonicalId: "cherry",
    names: { it: ["ciliegia", "ciliegie", "amarena", "visciola"], ja: ["サクランボ", "桜桃", "さくらんぼ"], en: ["cherry", "cherries", "sweet cherry", "sour cherry"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 63, grassi: 0.2, grassi_saturi: 0, carboidrati: 16, zuccheri: 13, proteine: 1.1, fibre: 2.1, sale: 0.01, extra: { antociani_mg: 30, vitamina_c_mg: 7, potassio_mg: 222, melatonina_mcg: 1.3 } },
    peso_medio_unità: 8,
  },
  grape: {
    canonicalId: "grape",
    names: { it: ["uva", "acini d'uva", "uva nera", "uva bianca"], ja: ["ブドウ", "葡萄", "巨峰", "マスカット"], en: ["grape", "grapes", "red grape", "green grape", "muscat"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 69, grassi: 0.2, grassi_saturi: 0, carboidrati: 18, zuccheri: 16, proteine: 0.7, fibre: 0.9, sale: 0.01, extra: { resveratrolo_mg: 0.2, antociani_mg: 5, vitamina_k_mcg: 14, potassio_mg: 191 } },
    peso_medio_unità: 5,
  },
  banana: {
    canonicalId: "banana",
    names: { it: ["banana", "banane", "banana matura", "banana verde"], ja: ["バナナ", "芭蕉", "完熟バナナ", "青バナナ"], en: ["banana", "bananas", "ripe banana", "green banana"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 89, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 23, zuccheri: 12, proteine: 1.1, fibre: 2.6, sale: 0.01, extra: { potassio_mg: 358, vitamina_b6_mg: 0.4, dopamina_mg: 2.5, magnesio_mg: 27 } },
    peso_medio_unità: 120,
  },
  kiwi: {
    canonicalId: "kiwi",
    names: { it: ["kiwi", "kiwi verde", "kiwi giallo"], ja: ["キウイ", "キウイフルーツ", "グリーンキウイ", "ゴールドキウイ"], en: ["kiwi", "kiwifruit", "green kiwi", "gold kiwi"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 61, grassi: 0.5, grassi_saturi: 0, carboidrati: 15, zuccheri: 9, proteine: 1.1, fibre: 3, sale: 0.01, extra: { vitamina_c_mg: 93, vitamina_k_mcg: 40, actinidina_enzima: true, potassio_mg: 312 } },
    peso_medio_unità: 75,
  },
  mango: {
    canonicalId: "mango",
    names: { it: ["mango", "mango fresco", "polpa di mango"], ja: ["マンゴー", "芒果", "完熟マンゴー"], en: ["mango", "fresh mango", "mango pulp"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 60, grassi: 0.4, grassi_saturi: 0.1, carboidrati: 15, zuccheri: 14, proteine: 0.8, fibre: 1.6, sale: 0.01, extra: { vitamina_c_mg: 36, beta_carotene_mcg: 640, mangiferina_mg: 4, folati_mcg: 43 } },
  },
  pineapple: {
    canonicalId: "pineapple",
    names: { it: ["ananas", "ananas fresco", "ananas sciroppato"], ja: ["パイナップル", "鳳梨", "フレッシュパイナップル"], en: ["pineapple", "fresh pineapple", "canned pineapple"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 50, grassi: 0.1, grassi_saturi: 0, carboidrati: 13, zuccheri: 10, proteine: 0.5, fibre: 1.4, sale: 0.01, extra: { vitamina_c_mg: 48, bromelina_enzima: true, manganese_mg: 0.9, potassio_mg: 109 } },
  },
  watermelon: {
    canonicalId: "watermelon",
    names: { it: ["anguria", "cocomero", "melone d'acqua"], ja: ["スイカ", "西瓜", "水瓜"], en: ["watermelon", "watermelon slices", "seedless watermelon"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 30, grassi: 0.2, grassi_saturi: 0, carboidrati: 8, zuccheri: 6, proteine: 0.6, fibre: 0.4, sale: 0.01, extra: { licopene_mg: 4.5, vitamina_c_mg: 8, citrullina_mg: 250, potassio_mg: 112 } },
  },
  melon: {
    canonicalId: "melon",
    names: { it: ["melone", "melone retato", "melone cantalupo"], ja: ["メロン", "マスクメロン", "カンタロープ"], en: ["melon", "cantaloupe", "honeydew", "muskmelon"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 34, grassi: 0.2, grassi_saturi: 0, carboidrati: 8, zuccheri: 8, proteine: 0.8, fibre: 0.9, sale: 0.02, extra: { beta_carotene_mcg: 2020, vitamina_c_mg: 37, potassio_mg: 267, folati_mcg: 21 } },
  },
  plum: {
    canonicalId: "plum",
    names: { it: ["prugna", "prugne", "susina", "prugna secca"], ja: ["プラム", "李", "すもも", "ドライプラム"], en: ["plum", "plums", "prune", "dried plum"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 46, grassi: 0.3, grassi_saturi: 0, carboidrati: 11, zuccheri: 10, proteine: 0.7, fibre: 1.4, sale: 0.01, extra: { vitamina_c_mg: 9.5, antociani_mg: 15, potassio_mg: 157, vitamina_k_mcg: 6 } },
    peso_medio_unità: 45,
  },
  apricot: {
    canonicalId: "apricot",
    names: { it: ["albicocca", "albicocche", "albicocca secca"], ja: ["アプリコット", "杏", "アンズ"], en: ["apricot", "apricots", "dried apricot"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 48, grassi: 0.4, grassi_saturi: 0, carboidrati: 11, zuccheri: 9, proteine: 1.4, fibre: 2, sale: 0.01, extra: { beta_carotene_mcg: 1094, vitamina_a_mcg: 96, vitamina_c_mg: 10, potassio_mg: 259 } },
    peso_medio_unità: 35,
  },
  fig: {
    canonicalId: "fig",
    names: { it: ["fico", "fichi", "fico fresco", "fico secco"], ja: ["イチジク", "無花果", "ドライフィグ"], en: ["fig", "figs", "fresh fig", "dried fig"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 74, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 19, zuccheri: 16, proteine: 0.8, fibre: 2.9, sale: 0.01, extra: { potassio_mg: 232, calcio_mg: 35, polifenoli_mg: 12, vitamina_k_mcg: 5 } },
    peso_medio_unità: 50,
  },
  persimmon: {
    canonicalId: "persimmon",
    names: { it: ["cachi", "loti", "diospiro"], ja: ["柿", "カキ", "富有柿"], en: ["persimmon", "kaki", "japanese persimmon"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 70, grassi: 0.2, grassi_saturi: 0, carboidrati: 19, zuccheri: 13, proteine: 0.6, fibre: 3.6, sale: 0.01, extra: { beta_carotene_mcg: 253, vitamina_c_mg: 7.5, tannini_mg: 8, potassio_mg: 161 } },
    peso_medio_unità: 120,
  },
  ume: {
    canonicalId: "ume",
    names: { it: ["prugna giapponese", "ume", "albicocca giapponese"], ja: ["梅", "ウメ", "梅干し"], en: ["ume", "japanese plum", "pickled plum"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 30, grassi: 0.2, grassi_saturi: 0, carboidrati: 7, zuccheri: 5, proteine: 0.5, fibre: 1.5, sale: 0.01, extra: { acido_citrico_g: 2, polifenoli_mg: 15, vitamina_c_mg: 6, potassio_mg: 130 } },
  },
  coconut: {
    canonicalId: "coconut",
    names: { it: ["cocco", "noce di cocco", "polpa di cocco", "latte di cocco"], ja: ["ココナッツ", "椰子", "ココナッツミルク"], en: ["coconut", "coconut meat", "coconut milk"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 354, grassi: 33, grassi_saturi: 30, carboidrati: 15, zuccheri: 6, proteine: 3.3, fibre: 9, sale: 0.02, extra: { acido_laurico_g: 18, manganese_mg: 1.5, rame_mg: 0.4, ferro_mg: 2.4 } },
  },
  avocado: {
    canonicalId: "avocado",
    names: { it: ["avocado", "pera alligatore", "avocado maturo"], ja: ["アボカド", "牛油果", "完熟アボカド"], en: ["avocado", "ripe avocado", "hass avocado"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 160, grassi: 15, grassi_saturi: 2.1, carboidrati: 9, zuccheri: 0.7, proteine: 2, fibre: 7, sale: 0.01, extra: { acido_oleico_g: 10, potassio_mg: 485, folati_mcg: 81, vitamina_k_mcg: 21, luteina_mcg: 271 } },
    peso_medio_unità: 200,
  },
  pomelo: {
    canonicalId: "pomelo",
    names: { it: ["pomelo", "pompelmo", "cedro"], ja: ["ザボン", "文旦", "ポンカン"], en: ["pomelo", "pummelo", "shaddock"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 38, grassi: 0.1, grassi_saturi: 0, carboidrati: 10, zuccheri: 7, proteine: 0.8, fibre: 1, sale: 0.01, extra: { vitamina_c_mg: 61, naringina_mg: 12, potassio_mg: 216, licopene_mg: 0.5 } },
  },
  sudachi: {
    canonicalId: "sudachi",
    names: { it: ["agrumi giapponesi", "sudachi", "lime giapponese"], ja: ["すだち", "スダチ", "酢橘"], en: ["sudachi", "japanese lime", "citrus"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 32, grassi: 0.2, grassi_saturi: 0, carboidrati: 10, zuccheri: 2, proteine: 0.7, fibre: 2.5, sale: 0.01, extra: { vitamina_c_mg: 35, limonene_mg: 10, naringenina_mg: 5, potassio_mg: 110 } },
  },
  kabosu: {
    canonicalId: "kabosu",
    names: { it: ["kabosu", "agrumi acidi giapponesi"], ja: ["カボス", "かぼす"], en: ["kabosu", "japanese citrus", "sour lime"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 30, grassi: 0.2, grassi_saturi: 0, carboidrati: 10, zuccheri: 2, proteine: 0.7, fibre: 2.5, sale: 0.01, extra: { vitamina_c_mg: 33, acido_citrico_g: 4, flavonoidi_mg: 15, potassio_mg: 105 } },
  },
  medlar: {
    canonicalId: "medlar",
    names: { it: ["nespola", "nespole", "mispola"], ja: ["ビワ", "枇杷"], en: ["loquat", "medlar", "japanese plum"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 47, grassi: 0.2, grassi_saturi: 0, carboidrati: 12, zuccheri: 9, proteine: 0.4, fibre: 1.7, sale: 0.01, extra: { beta_carotene_mcg: 1500, vitamina_a_mcg: 152, potassio_mg: 266, acido_malico_g: 1 } },
  },
  jujube: {
    canonicalId: "jujube",
    names: { it: ["giuggiola", "datteri cinesi"], ja: ["ナツメ", "棗", "中華ナツメ"], en: ["jujube", "chinese date", "red date"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 79, grassi: 0.2, grassi_saturi: 0, carboidrati: 20, zuccheri: 18, proteine: 1.2, fibre: 2, sale: 0.01, extra: { vitamina_c_mg: 69, potassio_mg: 250, saponine_mg: 5, flavonoidi_mg: 10 } },
  },

  // ── Erbe aromatiche e spezie ───────────────────────────────────────────
  basil: {
    canonicalId: "basil",
    names: { it: ["basilico", "basilico fresco", "basilico genovese"], ja: ["バジル", "スイートバジル", "ジェノベーゼバジル"], en: ["basil", "sweet basil", "fresh basil", "genovese basil"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 23, grassi: 0.6, grassi_saturi: 0, carboidrati: 2.7, zuccheri: 0.3, proteine: 3.2, fibre: 1.6, sale: 0.01, extra: { vitamina_k_mcg: 415, eugenolo_mg: 2, linalolo_mg: 1, potassio_mg: 295 } },
  },
  parsley: {
    canonicalId: "parsley",
    names: { it: ["prezzemolo", "prezzemolo fresco", "prezzemolo tritato"], ja: ["パセリ", "イタリアンパセリ", "カーリーパセリ"], en: ["parsley", "flat leaf parsley", "curly parsley", "italian parsley"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 36, grassi: 0.8, grassi_saturi: 0.1, carboidrati: 6.3, zuccheri: 0.9, proteine: 3, fibre: 3.3, sale: 0.06, extra: { vitamina_k_mcg: 1640, vitamina_c_mg: 133, apigenina_mg: 3, ferro_mg: 6.2 } },
  },
  oregano: {
    canonicalId: "oregano",
    names: { it: ["origano", "origano fresco", "origano secco"], ja: ["オレガノ", "ワイルドマジョラム", "乾燥オレガノ"], en: ["oregano", "wild marjoram", "dried oregano"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 265, grassi: 4.3, grassi_saturi: 1.2, carboidrati: 69, zuccheri: 4, proteine: 9, fibre: 42, sale: 0.03, extra: { carvacrolo_mg: 60, timolo_mg: 4, vitamina_k_mcg: 620, ferro_mg: 37 } },
  },
  rosemary: {
    canonicalId: "rosemary",
    names: { it: ["rosmarino", "rosmarino fresco", "rametto di rosmarino"], ja: ["ローズマリー", "マンネンロウ", "フレッシュローズマリー"], en: ["rosemary", "fresh rosemary", "dried rosemary"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 131, grassi: 5.9, grassi_saturi: 2.5, carboidrati: 21, zuccheri: 0.9, proteine: 3.3, fibre: 14, sale: 0.03, extra: { acido_rosmarinico_mg: 20, carnosolo_mg: 3, vitamina_a_mcg: 146, ferro_mg: 6.7 } },
  },
  thyme: {
    canonicalId: "thyme",
    names: { it: ["timo", "timo fresco", "timo limone"], ja: ["タイム", "タチジャコウソウ", "レモンタイム"], en: ["thyme", "fresh thyme", "lemon thyme"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 101, grassi: 1.7, grassi_saturi: 0.5, carboidrati: 24, zuccheri: 1.7, proteine: 5.6, fibre: 14, sale: 0.05, extra: { timolo_mg: 45, carvacrolo_mg: 15, vitamina_c_mg: 160, ferro_mg: 17 } },
  },
  sage: {
    canonicalId: "sage",
    names: { it: ["salvia", "foglie di salvia", "salvia fresca"], ja: ["セージ", "ヤクヨウサルビア", "フレッシュセージ"], en: ["sage", "fresh sage", "dried sage"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 315, grassi: 12.8, grassi_saturi: 3.2, carboidrati: 61, zuccheri: 0.6, proteine: 10.6, fibre: 40, sale: 0.02, extra: { tujone_mg: 2, acido_rosmarinico_mg: 15, vitamina_k_mcg: 1710, calcio_mg: 1650 } },
  },
  mint: {
    canonicalId: "mint",
    names: { it: ["menta", "menta fresca", "menta piperita"], ja: ["ミント", "ハッカ", "ペパーミント", "スペアミント"], en: ["mint", "fresh mint", "peppermint", "spearmint"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 70, grassi: 0.9, grassi_saturi: 0.2, carboidrati: 15, zuccheri: 0, proteine: 3.8, fibre: 8, sale: 0.03, extra: { mentolo_mg: 12, acido_rosmarinico_mg: 8, vitamina_a_mcg: 212, ferro_mg: 5 } },
  },
  cilantro: {
    canonicalId: "cilantro",
    names: { it: ["coriandolo", "prezzemolo cinese", "foglie di coriandolo"], ja: ["コリアンダー", "パクチー", "香菜"], en: ["cilantro", "coriander leaves", "fresh coriander"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 23, grassi: 0.5, grassi_saturi: 0, carboidrati: 3.7, zuccheri: 0.9, proteine: 2.1, fibre: 2.8, sale: 0.05, extra: { vitamina_k_mcg: 310, vitamina_c_mg: 27, linalolo_mg: 2, potassio_mg: 521 } },
  },
  shiso: {
    canonicalId: "shiso",
    names: { it: ["shiso", "basilico giapponese", "perilla"], ja: ["紫蘇", "シソ", "大葉"], en: ["shiso", "perilla", "japanese basil"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 36, grassi: 1.7, grassi_saturi: 0.2, carboidrati: 4.5, zuccheri: 0.5, proteine: 2.5, fibre: 3, sale: 0.01, extra: { acido_rosmarinico_mg: 15, perillaldeide_mg: 8, vitamina_a_mcg: 560, omega3_ala_g: 0.4 } },
  },
  mitsuba: {
    canonicalId: "mitsuba",
    names: { it: ["mitsuba", "trifoglio giapponese"], ja: ["三つ葉", "ミツバ"], en: ["mitsuba", "japanese parsley", "cryptotaenia"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 20, grassi: 0.3, grassi_saturi: 0, carboidrati: 3, zuccheri: 1, proteine: 2, fibre: 2, sale: 0.02, extra: { beta_carotene_mcg: 1200, vitamina_c_mg: 20, potassio_mg: 300, calcio_mg: 80 } },
  },
  black_pepper: {
    canonicalId: "black_pepper",
    names: { it: ["pepe nero", "pepe in grani", "pepe macinato"], ja: ["黒胡椒", "ブラックペッパー", "粒胡椒", "挽き黒胡椒"], en: ["black pepper", "ground black pepper", "whole peppercorns"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 251, grassi: 3.3, grassi_saturi: 1.2, carboidrati: 64, zuccheri: 0.6, proteine: 10, fibre: 25, sale: 0.02, extra: { piperina_mg: 50, beta_cariofillene_mg: 8, ferro_mg: 9.7, manganese_mg: 1.3 } },
  },
  white_pepper: {
    canonicalId: "white_pepper",
    names: { it: ["pepe bianco", "pepe bianco macinato"], ja: ["白胡椒", "ホワイトペッパー", "粒白胡椒"], en: ["white pepper", "ground white pepper"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 296, grassi: 2.4, grassi_saturi: 0.9, carboidrati: 69, zuccheri: 0.4, proteine: 10, fibre: 26, sale: 0.02, extra: { piperina_mg: 45, ferro_mg: 4.3, potassio_mg: 730, magnesio_mg: 90 } },
  },
  chili_pepper: {
    canonicalId: "chili_pepper",
    names: { it: ["peperoncino", "peperoncino fresco", "peperoncino secco", "pepe di cayenna"], ja: ["唐辛子", "チリペッパー", "鷹の爪", "粉唐辛子"], en: ["chili pepper", "red chili", "dried chili", "cayenne pepper"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 318, grassi: 5.7, grassi_saturi: 1, carboidrati: 57, zuccheri: 10, proteine: 12, fibre: 27, sale: 0.02, extra: { capsaicina_mg: 200, vitamina_c_mg: 76, vitamina_a_mcg: 2081, potassio_mg: 1370 } },
  },
  shichimi: {
    canonicalId: "shichimi",
    names: { it: ["shichimi togarashi", "pepe giapponese", "miscela di spezie"], ja: ["七味唐辛子", "七味", "とがらし"], en: ["shichimi togarashi", "japanese seven spice", "togarashi"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 280, grassi: 8, grassi_saturi: 1.5, carboidrati: 45, zuccheri: 3, proteine: 10, fibre: 18, sale: 2, extra: { capsaicina_mg: 50, sanshool_mg: 10, vitamina_c_mg: 30, potassio_mg: 800 } },
  },
  paprika: {
    canonicalId: "paprika",
    names: { it: ["paprika", "paprika dolce", "paprika piccante", "paprika affumicata"], ja: ["パプリカパウダー", "赤唐辛子粉", "スモークパプリカ"], en: ["paprika", "sweet paprika", "smoked paprika", "hot paprika"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 282, grassi: 13, grassi_saturi: 2.3, carboidrati: 54, zuccheri: 10, proteine: 14, fibre: 35, sale: 0.07, extra: { capsantina_mg: 25, vitamina_a_mcg: 2463, vitamina_e_mg: 29, potassio_mg: 2280 } },
  },
  cumin: {
    canonicalId: "cumin",
    names: { it: ["cumino", "semi di cumino", "cumino macinato"], ja: ["クミン", "クミンシード", "挽きクミン"], en: ["cumin", "cumin seeds", "ground cumin"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 375, grassi: 22, grassi_saturi: 2.8, carboidrati: 44, zuccheri: 2.3, proteine: 18, fibre: 10, sale: 0.02, extra: { cuminaldeide_mg: 25, ferro_mg: 66, potassio_mg: 1788, magnesio_mg: 366 } },
  },
  coriander_seed: {
    canonicalId: "coriander_seed",
    names: { it: ["coriandolo in semi", "semi di coriandolo"], ja: ["コリアンダーシード", "香菜の実"], en: ["coriander seeds", "ground coriander"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 298, grassi: 17.8, grassi_saturi: 1.5, carboidrati: 55, zuccheri: 1.8, proteine: 12, fibre: 42, sale: 0.02, extra: { linalolo_mg: 15, ferro_mg: 16, magnesio_mg: 330, potassio_mg: 1267 } },
  },
  cinnamon: {
    canonicalId: "cinnamon",
    names: { it: ["cannella", "cannella in stecca", "cannella in polvere"], ja: ["シナモン", "桂皮", "シナモンスティック"], en: ["cinnamon", "cinnamon stick", "ground cinnamon"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 247, grassi: 1.2, grassi_saturi: 0.4, carboidrati: 81, zuccheri: 2.2, proteine: 4, fibre: 53, sale: 0.01, extra: { cinnamaldeide_mg: 60, manganese_mg: 17, calcio_mg: 1002, antiossidanti_orac: 267536 } },
  },
  nutmeg: {
    canonicalId: "nutmeg",
    names: { it: ["noce moscata", "noce moscata grattugiata"], ja: ["ナツメグ", "肉豆蔲", "挽きナツメグ"], en: ["nutmeg", "ground nutmeg", "whole nutmeg"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 525, grassi: 36, grassi_saturi: 8, carboidrati: 49, zuccheri: 28, proteine: 6, fibre: 21, sale: 0.02, extra: { miristicina_mg: 15, magnesio_mg: 183, manganese_mg: 3, potassio_mg: 350 } },
  },
  cloves: {
    canonicalId: "cloves",
    names: { it: ["chiodi di garofano", "chiodi di garofano interi"], ja: ["クローブ", "丁子", "ホールクローブ"], en: ["cloves", "whole cloves", "ground cloves"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 274, grassi: 13, grassi_saturi: 4, carboidrati: 66, zuccheri: 2.4, proteine: 6, fibre: 34, sale: 0.02, extra: { eugenolo_mg: 70, vitamina_k_mcg: 142, manganese_mg: 60, potassio_mg: 1020 } },
  },
  turmeric: {
    canonicalId: "turmeric",
    names: { it: ["curcuma", "curcuma in polvere", "zafferano delle indie"], ja: ["ターメリック", "ウコン", "ターメリックパウダー"], en: ["turmeric", "ground turmeric", "turmeric powder"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 354, grassi: 10, grassi_saturi: 3.1, carboidrati: 65, zuccheri: 3.2, proteine: 8, fibre: 21, sale: 0.03, extra: { curcumina_mg: 30, ferro_mg: 41, potassio_mg: 2525, manganese_mg: 19 } },
  },
  curry: {
    canonicalId: "curry",
    names: { it: ["curry", "curry in polvere", "miscela di curry"], ja: ["カレー粉", "カレー", "和風カレー"], en: ["curry powder", "curry spice blend", "japanese curry"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 325, grassi: 14, grassi_saturi: 2.5, carboidrati: 58, zuccheri: 4, proteine: 14, fibre: 32, sale: 0.5, extra: { curcumina_mg: 15, vitamina_c_mg: 20, ferro_mg: 25, potassio_mg: 1200 } },
  },
  wasabi: {
    canonicalId: "wasabi",
    names: { it: ["wasabi", "wasabi fresco", "wasabi in pasta"], ja: ["わさび", "山葵", "練りわさび", "粉わさび"], en: ["wasabi", "fresh wasabi", "wasabi paste"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 109, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 24, zuccheri: 8, proteine: 4.8, fibre: 7.8, sale: 0.02, extra: { isotiocianati_mg: 25, vitamina_c_mg: 42, potassio_mg: 568, calcio_mg: 128 } },
  },
  sansho: {
    canonicalId: "sansho",
    names: { it: ["sansho", "pepe giapponese", "pepe di sansho"], ja: ["山椒", "サンショウ", "粉山椒"], en: ["sansho", "japanese pepper", "sichuan pepper"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 280, grassi: 7, grassi_saturi: 1.2, carboidrati: 52, zuccheri: 2, proteine: 10, fibre: 25, sale: 0.02, extra: { sanshool_mg: 30, limonene_mg: 12, vitamina_c_mg: 15, potassio_mg: 900 } },
  },
  star_anise: {
    canonicalId: "star_anise",
    names: { it: ["anice stellato", "badiana", "anice cinese"], ja: ["八角", "スターアニス", "大茴香"], en: ["star anise", "chinese anise", "badian"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 337, grassi: 16, grassi_saturi: 2.5, carboidrati: 50, zuccheri: 0, proteine: 18, fibre: 15, sale: 0.02, extra: { anetolo_mg: 80, vitamina_c_mg: 21, ferro_mg: 37, calcio_mg: 646 } },
  },
  bay_leaf: {
    canonicalId: "bay_leaf",
    names: { it: ["alloro", "foglie di alloro", "lauro"], ja: ["ローリエ", "月桂樹", "ベイリーフ"], en: ["bay leaf", "laurel leaf", "bay laurel"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 313, grassi: 8.4, grassi_saturi: 2.3, carboidrati: 75, zuccheri: 0, proteine: 7.6, fibre: 26, sale: 0.02, extra: { eugenolo_mg: 5, vitamina_a_mcg: 390, ferro_mg: 43, calcio_mg: 834 } },
  },
  juniper: {
    canonicalId: "juniper",
    names: { it: ["ginepro", "bacche di ginepro"], ja: ["ジュニパー", "ネズ", "セイヨウネズ"], en: ["juniper", "juniper berries", "juniperus"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 116, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 31, zuccheri: 10, proteine: 1.6, fibre: 10, sale: 0.01, extra: { alfa_pinene_mg: 30, vitamina_c_mg: 13, potassio_mg: 240, antiossidanti_flavonoidi: true } },
  },
  fennel_seeds: {
    canonicalId: "fennel_seeds",
    names: { it: ["semi di finocchio", "finocchietto"], ja: ["フェンネルシード", "ウイキョウの種"], en: ["fennel seeds", "sweet fennel", "anise seeds"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 345, grassi: 15, grassi_saturi: 1.5, carboidrati: 52, zuccheri: 0, proteine: 16, fibre: 37, sale: 0.02, extra: { anetolo_mg: 50, potassio_mg: 1694, calcio_mg: 497, ferro_mg: 18 } },
  },
  cardamom: {
    canonicalId: "cardamom",
    names: { it: ["cardamomo", "semi di cardamomo"], ja: ["カルダモン", "ショウズク"], en: ["cardamom", "green cardamom", "black cardamom"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 311, grassi: 6.7, grassi_saturi: 0.7, carboidrati: 68, zuccheri: 0, proteine: 11, fibre: 28, sale: 0.02, extra: { cineolo_mg: 20, potassio_mg: 1119, ferro_mg: 14, manganese_mg: 28 } },
  },
  fenugreek: {
    canonicalId: "fenugreek",
    names: { it: ["fieno greco", "semi di fieno greco"], ja: ["フェヌグリーク", "コロハ"], en: ["fenugreek", "methi", "greek hay"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 323, grassi: 6.4, grassi_saturi: 1.5, carboidrati: 58, zuccheri: 0, proteine: 23, fibre: 25, sale: 0.02, extra: { diosgenina_mg: 3, ferro_mg: 33, potassio_mg: 770, magnesio_mg: 191 } },
  },
  lemongrass: {
    canonicalId: "lemongrass",
    names: { it: ["citronella", "erba limone", "lemongrass"], ja: ["レモングラス", "檸檬草"], en: ["lemongrass", "lemon grass", "citronella"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 99, grassi: 1.2, grassi_saturi: 0.2, carboidrati: 25, zuccheri: 0, proteine: 1.8, fibre: 2.6, sale: 0.01, extra: { citrale_mg: 35, vitamina_c_mg: 2, potassio_mg: 723, ferro_mg: 8 } },
  },
  galangal: {
    canonicalId: "galangal",
    names: { it: ["galanga", "zenzero thailandese"], ja: ["ガランガル", "タイショウガ", "高良姜"], en: ["galangal", "thai ginger", "laos"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 71, grassi: 0.9, grassi_saturi: 0.2, carboidrati: 15, zuccheri: 2, proteine: 1, fibre: 2, sale: 0.01, extra: { galangina_mg: 8, vitamina_c_mg: 5, potassio_mg: 350, ferro_mg: 1 } },
  },
  kaffir_lime: {
    canonicalId: "kaffir_lime",
    names: { it: ["lime kaffir", "foglie di lime"], ja: ["カフィアライム", "バイマックラン"], en: ["kaffir lime", "makrut lime", "lime leaves"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 45, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 11, zuccheri: 2, proteine: 1.5, fibre: 3, sale: 0.01, extra: { citronellolo_mg: 10, vitamina_c_mg: 30, potassio_mg: 180, antiossidanti_flavonoidi: true } },
  },

  // ── Oli e grassi ─────────────────────────────────────────────────────────
  olive_oil: {
    canonicalId: "olive_oil",
    names: { it: ["olio d'oliva", "olio extravergine d'oliva", "olio di oliva", "olio evo"], ja: ["オリーブオイル", "エクストラバージンオリーブオイル"], en: ["olive oil", "extra virgin olive oil", "virgin olive oil"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 884, grassi: 100, grassi_saturi: 14, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { acido_oleico_g: 73, polifenoli_mg: 30, vitamina_e_mg: 14, vitamina_k_mcg: 60 } },
  },
  vegetable_oil: {
    canonicalId: "vegetable_oil",
    names: { it: ["olio di semi", "olio vegetale", "olio di girasole", "olio di mais"], ja: ["サラダ油", "植物油", "ひまわり油", "コーン油"], en: ["vegetable oil", "sunflower oil", "corn oil", "canola oil"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 884, grassi: 100, grassi_saturi: 12, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { acido_linoleico_g: 65, vitamina_e_mg: 41, fitosteroli_mg: 200 } },
  },
  sesame_oil: {
    canonicalId: "sesame_oil",
    names: { it: ["olio di sesamo", "olio di sesamo tostato"], ja: ["ごま油", "太白ごま油", "煎りごま油"], en: ["sesame oil", "toasted sesame oil", "pure sesame oil"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 884, grassi: 100, grassi_saturi: 14, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { sesamina_mg: 5, vitamina_e_mg: 2, fitosteroli_mg: 150, acido_linoleico_g: 42 } },
  },
  coconut_oil: {
    canonicalId: "coconut_oil",
    names: { it: ["olio di cocco", "olio di cocco vergine", "burro di cocco"], ja: ["ココナッツオイル", "ココナッツ油", "バージンココナッツオイル"], en: ["coconut oil", "virgin coconut oil", "coconut butter"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 862, grassi: 100, grassi_saturi: 87, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { acido_laurico_g: 47, acido_caprilico_g: 8, mct_g: 15, polifenoli_mg: 5 } },
  },
  lard: {
    canonicalId: "lard",
    names: { it: ["strutto", "grasso di maiale", "sugna"], ja: ["ラード", "豚脂", "ポークファット"], en: ["lard", "pork lard", "pork fat"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 902, grassi: 100, grassi_saturi: 40, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { vitamina_d_mcg: 2.5, colesterolo_mg: 95, acido_oleico_g: 45 } },
  },
  duck_fat: {
    canonicalId: "duck_fat",
    names: { it: ["grasso d'anatra", "strutto d'anatra"], ja: ["鴨脂", "アヒルオイル"], en: ["duck fat", "rendered duck fat"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 900, grassi: 100, grassi_saturi: 33, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { acido_oleico_g: 50, omega3_g: 1.5, vitamina_e_mg: 3 } },
  },
  truffle_oil: {
    canonicalId: "truffle_oil",
    names: { it: ["olio al tartufo", "olio di tartufo", "olio tartufato"], ja: ["トリュフオイル", "トリュフ香りオイル"], en: ["truffle oil", "truffle infused oil"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 884, grassi: 100, grassi_saturi: 14, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { androstenolo_mcg: 5, composti_solfurati_mg: 2, vitamina_e_mg: 14 } },
  },
  peanut_oil: {
    canonicalId: "peanut_oil",
    names: { it: ["olio di arachidi", "olio di noccioline"], ja: ["ピーナッツオイル", "落花生油"], en: ["peanut oil", "groundnut oil"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 884, grassi: 100, grassi_saturi: 17, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { acido_oleico_g: 48, resveratrolo_mcg: 50, vitamina_e_mg: 16, fitosteroli_mg: 220 } },
  },
  grapeseed_oil: {
    canonicalId: "grapeseed_oil",
    names: { it: ["olio di vinaccioli", "olio di semi d'uva"], ja: ["グレープシードオイル", "ブドウ種子油"], en: ["grapeseed oil", "grape seed oil"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 884, grassi: 100, grassi_saturi: 10, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { acido_linoleico_g: 70, vitamina_e_mg: 29, proantocianidine_mg: 15, omega6_g: 70 } },
  },
  perilla_oil: {
    canonicalId: "perilla_oil",
    names: { it: ["olio di perilla", "olio di shiso"], ja: ["えごま油", "シソ油", "紫蘇油"], en: ["perilla oil", "shiso oil", "egoma oil"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 884, grassi: 100, grassi_saturi: 8, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { omega3_ala_g: 60, acido_rosmarinico_mg: 2, vitamina_e_mg: 3, fitosteroli_mg: 180 } },
  },

  // ── Condimenti e salse ───────────────────────────────────────────────────
  salt: {
    canonicalId: "salt",
    names: { it: ["sale", "sale fino", "sale grosso", "sale marino", "sale iodato"], ja: ["塩", "食塩", "岩塩", "海塩"], en: ["salt", "table salt", "sea salt", "kosher salt"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 0, grassi: 0, grassi_saturi: 0, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 100, extra: { sodio_mg: 39000, iodio_mcg: 76 } },
  },
  sugar: {
    canonicalId: "sugar",
    names: { it: ["zucchero", "zucchero semolato", "zucchero bianco", "zucchero a velo"], ja: ["砂糖", "グラニュー糖", "上白糖", "粉糖"], en: ["sugar", "granulated sugar", "white sugar", "powdered sugar"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 387, grassi: 0, grassi_saturi: 0, carboidrati: 100, zuccheri: 100, proteine: 0, fibre: 0, sale: 0.01 },
  },
  honey: {
    canonicalId: "honey",
    names: { it: ["miele", "miele d'acacia", "miele di castagno", "miele millefiori"], ja: ["蜂蜜", "はちみつ", "アカシア蜂蜜", "百花蜂蜜"], en: ["honey", "acacia honey", "wildflower honey", "raw honey"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 304, grassi: 0, grassi_saturi: 0, carboidrati: 82, zuccheri: 82, proteine: 0.3, fibre: 0.2, sale: 0.01, extra: { enzimi_g: 0.5, polifenoli_mg: 25, potassio_mg: 52, vitamina_c_mg: 0.5 } },
  },
  soy_sauce: {
    canonicalId: "soy_sauce",
    names: { it: ["salsa di soia", "soia", "shoyu"], ja: ["醤油", "しょうゆ", "濃口醤油", "薄口醤油"], en: ["soy sauce", "shoyu", "japanese soy sauce", "dark soy sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 60, grassi: 0, grassi_saturi: 0, carboidrati: 6, zuccheri: 0.5, proteine: 8, fibre: 0.8, sale: 14, extra: { sodio_mg: 5500, isoflavoni_mg: 15, glutammato_naturale: true } },
  },
  tamari: {
    canonicalId: "tamari",
    names: { it: ["tamari", "soia senza glutine"], ja: ["たまり", "溜まり醤油", "グルテンフリー醤油"], en: ["tamari", "gluten-free soy sauce", "wheat-free soy"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 70, grassi: 0, grassi_saturi: 0, carboidrati: 7, zuccheri: 1, proteine: 10, fibre: 1, sale: 13, extra: { sodio_mg: 5100, isoflavoni_mg: 20, aminoacidi_essenziali: true } },
  },
  miso: {
    canonicalId: "miso",
    names: { it: ["miso", "pasta di soia fermentata", "miso bianco", "miso rosso"], ja: ["味噌", "白味噌", "赤味噌", "合わせ味噌"], en: ["miso", "white miso", "red miso", "soybean paste"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 199, grassi: 6, grassi_saturi: 1, carboidrati: 26, zuccheri: 6, proteine: 12, fibre: 5, sale: 10, extra: { sodio_mg: 3900, probiotici: true, isoflavoni_mg: 30, vitamina_k2_mcg: 25 } },
  },
  mirin: {
    canonicalId: "mirin",
    names: { it: ["mirin", "vino di riso dolce", "sake dolce"], ja: ["みりん", "味醂", "本みりん"], en: ["mirin", "sweet rice wine", "cooking sake"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 200, grassi: 0, grassi_saturi: 0, carboidrati: 45, zuccheri: 45, proteine: 0.5, fibre: 0, sale: 0.02, extra: { alcol_percent: 14, aminoacidi_mg: 200, potassio_mg: 30 } },
  },
  sake: {
    canonicalId: "sake",
    names: { it: ["sake", "vino di riso", "sake da cucina"], ja: ["日本酒", "酒", "料理酒", "純米酒"], en: ["sake", "rice wine", "japanese sake", "cooking sake"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 134, grassi: 0, grassi_saturi: 0, carboidrati: 5, zuccheri: 1, proteine: 0.5, fibre: 0, sale: 0.01, extra: { alcol_percent: 15, aminoacidi_mg: 150, potassio_mg: 20, selenio_mcg: 1 } },
  },
  rice_vinegar: {
    canonicalId: "rice_vinegar",
    names: { it: ["aceto di riso", "aceto giapponese", "su", "aceto per sushi"], ja: ["米酢", "穀物酢", "寿司酢", "黒酢"], en: ["rice vinegar", "seasoned rice vinegar", "japanese vinegar"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 18, grassi: 0, grassi_saturi: 0, carboidrati: 0.4, zuccheri: 0.4, proteine: 0, fibre: 0, sale: 0.01, extra: { acido_acetico_g: 4, potassio_mg: 2, aminoacidi_mg: 50 } },
  },
  balsamic_vinegar: {
    canonicalId: "balsamic_vinegar",
    names: { it: ["aceto balsamico", "aceto balsamico tradizionale", "aceto di modena"], ja: ["バルサミコ酢", "モデナ酢", "伝統的バルサミコ"], en: ["balsamic vinegar", "traditional balsamic", "modena vinegar"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 88, grassi: 0, grassi_saturi: 0, carboidrati: 17, zuccheri: 15, proteine: 0.5, fibre: 0, sale: 0.02, extra: { polifenoli_mg: 150, acido_malico_g: 2, potassio_mg: 112, antiossidanti_orac: 4000 } },
  },
  apple_cider_vinegar: {
    canonicalId: "apple_cider_vinegar",
    names: { it: ["aceto di mele", "aceto di sidro"], ja: ["リンゴ酢", "アップルサイダービネガー"], en: ["apple cider vinegar", "apple vinegar", "cider vinegar"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 22, grassi: 0, grassi_saturi: 0, carboidrati: 0.9, zuccheri: 0.4, proteine: 0, fibre: 0, sale: 0.01, extra: { acido_acetico_g: 5, acido_malico_g: 1, potassio_mg: 73, probiotici_madre: true } },
  },
  tomato_sauce: {
    canonicalId: "tomato_sauce",
    names: { it: ["salsa di pomodoro", "passata di pomodoro", "polpa di pomodoro", "concentrato"], ja: ["トマトソース", "トマトピューレ", "トマトペースト"], en: ["tomato sauce", "tomato puree", "tomato paste", "crushed tomatoes"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 29, grassi: 0.2, grassi_saturi: 0, carboidrati: 7, zuccheri: 4, proteine: 1.6, fibre: 1.4, sale: 0.3, extra: { licopene_mg: 5, vitamina_c_mg: 12, potassio_mg: 297, vitamina_k_mcg: 4 } },
  },
  pesto: {
    canonicalId: "pesto",
    names: { it: ["pesto", "pesto genovese", "pesto alla ligure", "pesto di basilico"], ja: ["ジェノベーゼ", "バジルペースト", "イタリアンペースト"], en: ["pesto", "basil pesto", "genovese pesto"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 480, grassi: 48, grassi_saturi: 12, carboidrati: 6, zuccheri: 1, proteine: 12, fibre: 3, sale: 2.5, extra: { vitamina_k_mcg: 300, polifenoli_mg: 40, omega3_ala_g: 2, vitamina_e_mg: 5 } },
  },
  mayonnaise: {
    canonicalId: "mayonnaise",
    names: { it: ["maionese", "salsa maionese", "maionese fatta in casa"], ja: ["マヨネーズ", "和風マヨ", "卵黄マヨ"], en: ["mayonnaise", "japanese mayo", "homemade mayo"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 680, grassi: 75, grassi_saturi: 11, carboidrati: 1, zuccheri: 1, proteine: 1, fibre: 0, sale: 1.2, extra: { vitamina_e_mg: 18, colesterolo_mg: 42, omega6_g: 45 } },
  },
  ketchup: {
    canonicalId: "ketchup",
    names: { it: ["ketchup", "salsa ketchup", "salsa di pomodoro dolce"], ja: ["ケチャップ", "トマトケチャップ", "ソース"], en: ["ketchup", "tomato ketchup", "tomato sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 101, grassi: 0.1, grassi_saturi: 0, carboidrati: 27, zuccheri: 23, proteine: 1.2, fibre: 0.3, sale: 1.5, extra: { licopene_mg: 2, vitamina_c_mg: 4, potassio_mg: 200 } },
  },
  worcestershire: {
    canonicalId: "worcestershire",
    names: { it: ["salsa worcester", "worcestershire", "salsa inglese"], ja: ["ウスターソース", "中濃ソース", "濃厚ソース"], en: ["worcestershire sauce", "worcestshire", "english sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 78, grassi: 0, grassi_saturi: 0, carboidrati: 19, zuccheri: 13, proteine: 0, fibre: 0, sale: 2.8, extra: { sodio_mg: 1100, glutammato_naturale: true, polifenoli_mg: 10 } },
  },
  dashi: {
    canonicalId: "dashi",
    names: { it: ["dashi", "brodo giapponese", "estratto di dashi"], ja: ["出汁", "だし", "昆布出汁", "鰹出汁", "粉末出汁"], en: ["dashi", "japanese stock", "kombu dashi", "bonito dashi"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 8, grassi: 0, grassi_saturi: 0, carboidrati: 1, zuccheri: 0, proteine: 1.5, fibre: 0, sale: 1.2, extra: { glutammato_naturale: true, inosina_mg: 20, iodio_mcg: 30, potassio_mg: 50 } },
  },
  ponzu: {
    canonicalId: "ponzu",
    names: { it: ["ponzu", "salsa ponzu", "agrumi soia"], ja: ["ポン酢", "ポン酢醤油", "柑橘ポン酢"], en: ["ponzu", "ponzu sauce", "citrus soy sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 45, grassi: 0, grassi_saturi: 0, carboidrati: 10, zuccheri: 5, proteine: 2, fibre: 0, sale: 3, extra: { sodio_mg: 1200, vitamina_c_mg: 8, acido_citrico_g: 1, glutammato_naturale: true } },
  },
  teriyaki: {
    canonicalId: "teriyaki",
    names: { it: ["teriyaki", "salsa teriyaki", "glaze teriyaki"], ja: ["照り焼き", "照り焼きソース", "タレ"], en: ["teriyaki", "teriyaki sauce", "teriyaki glaze"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 150, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 35, zuccheri: 30, proteine: 3, fibre: 0, sale: 2.5, extra: { sodio_mg: 980, glutammato_naturale: true, polifenoli_mg: 5 } },
  },
  tonkatsu_sauce: {
    canonicalId: "tonkatsu_sauce",
    names: { it: ["salsa tonkatsu", "salsa per cotoletta"], ja: ["とんかつソース", "中濃ソース", "ウスターソース"], en: ["tonkatsu sauce", "japanese sauce", "fruit sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 95, grassi: 0.2, grassi_saturi: 0, carboidrati: 23, zuccheri: 18, proteine: 1, fibre: 0.5, sale: 2, extra: { sodio_mg: 790, polifenoli_mg: 8, potassio_mg: 120 } },
  },
  okonomiyaki_sauce: {
    canonicalId: "okonomiyaki_sauce",
    names: { it: ["salsa okonomiyaki", "salsa giapponese"], ja: ["お好み焼きソース", "オタフクソース", "ブルドックソース"], en: ["okonomiyaki sauce", "japanese savory sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 110, grassi: 0.3, grassi_saturi: 0, carboidrati: 26, zuccheri: 20, proteine: 1.5, fibre: 1, sale: 2.2, extra: { sodio_mg: 870, glutammato_naturale: true, polifenoli_mg: 10 } },
  },
  fish_sauce: {
    canonicalId: "fish_sauce",
    names: { it: ["salsa di pesce", "nuoc mam", "colatura di alici"], ja: ["魚醤", "ナンプラー", "いしる"], en: ["fish sauce", "nuoc mam", "nam pla"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 35, grassi: 0, grassi_saturi: 0, carboidrati: 3, zuccheri: 0, proteine: 6, fibre: 0, sale: 14, extra: { sodio_mg: 5500, glutammato_naturale: true, aminoacidi_essenziali: true } },
  },
  oyster_sauce: {
    canonicalId: "oyster_sauce",
    names: { it: ["salsa di ostriche", "salsa ostrica"], ja: ["オイスターソース", "カキソース"], en: ["oyster sauce", "oyster stir-fry sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 60, grassi: 0.2, grassi_saturi: 0, carboidrati: 14, zuccheri: 8, proteine: 2, fibre: 0.5, sale: 3, extra: { sodio_mg: 1180, zinco_mg: 0.5, glutammato_naturale: true } },
  },
  hoisin_sauce: {
    canonicalId: "hoisin_sauce",
    names: { it: ["salsa hoisin", "salsa dolce cinese"], ja: ["海鮮醤", "ホイシンソース"], en: ["hoisin sauce", "chinese sweet sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 220, grassi: 1, grassi_saturi: 0.2, carboidrati: 50, zuccheri: 35, proteine: 3, fibre: 2, sale: 2.5, extra: { sodio_mg: 980, polifenoli_mg: 15, potassio_mg: 200 } },
  },
  sriracha: {
    canonicalId: "sriracha",
    names: { it: ["sriracha", "salsa piccante tailandese"], ja: ["スリラチャ", "チリソース"], en: ["sriracha", "chili sauce", "hot sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 80, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 19, zuccheri: 15, proteine: 1, fibre: 1, sale: 3, extra: { capsaicina_mg: 30, vitamina_c_mg: 15, potassio_mg: 150 } },
  },
  tabasco: {
    canonicalId: "tabasco",
    names: { it: ["tabasco", "salsa piccante", "peperoncino in bottiglia"], ja: ["タバスコ", "ホットソース", "チリソース"], en: ["tabasco", "hot sauce", "pepper sauce"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 12, grassi: 0, grassi_saturi: 0, carboidrati: 3, zuccheri: 1, proteine: 0, fibre: 0, sale: 2.5, extra: { capsaicina_mg: 20, vitamina_c_mg: 5, potassio_mg: 30 } },
  },
  mustard: {
    canonicalId: "mustard",
    names: { it: ["senape", "mostarda", "senape di digione"], ja: ["マスタード", "からし", "ディジョンマスタード"], en: ["mustard", "dijon mustard", "whole grain mustard"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 66, grassi: 3.3, grassi_saturi: 0.2, carboidrati: 5.8, zuccheri: 2.3, proteine: 4.4, fibre: 3.3, sale: 2.5, extra: { isotiocianati_mg: 15, selenio_mcg: 10, potassio_mg: 138 } },
  },
  miso_paste_white: {
    canonicalId: "miso_paste_white",
    names: { it: ["miso bianco", "shiro miso", "miso dolce"], ja: ["白味噌", "しろみそ", "甘味噌"], en: ["white miso", "shiro miso", "sweet miso"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 180, grassi: 5, grassi_saturi: 0.8, carboidrati: 28, zuccheri: 8, proteine: 10, fibre: 4, sale: 8, extra: { sodio_mg: 3150, probiotici: true, isoflavoni_mg: 25 } },
  },
  miso_paste_red: {
    canonicalId: "miso_paste_red",
    names: { it: ["miso rosso", "aka miso", "miso stagionato"], ja: ["赤味噌", "あかみそ", "熟成味噌"], en: ["red miso", "aka miso", "aged miso"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 210, grassi: 7, grassi_saturi: 1.2, carboidrati: 24, zuccheri: 4, proteine: 14, fibre: 6, sale: 12, extra: { sodio_mg: 4700, probiotici: true, vitamina_k2_mcg: 30, isoflavoni_mg: 35 } },
  },
  kombu: {
    canonicalId: "kombu",
    names: { it: ["alga kombu", "kelp", "alga per dashi"], ja: ["昆布", "コンブ", "真昆布"], en: ["kombu", "kelp", "dashi kombu"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 43, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 10, zuccheri: 1, proteine: 8, fibre: 41, sale: 3, extra: { iodio_mcg: 2400, acido_glutammico_g: 3, alginati_g: 15, calcio_mg: 1100 } },
  },
  nori: {
    canonicalId: "nori",
    names: { it: ["nori", "alga nori", "fogli di alghe"], ja: ["海苔", "のり", "焼き海苔"], en: ["nori", "seaweed sheets", "roasted seaweed"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 35, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 5, zuccheri: 0.5, proteine: 5.8, fibre: 0.3, sale: 0.5, extra: { vitamina_b12_mcg: 30, iodio_mcg: 230, vitamina_a_mcg: 260, taurina_mg: 50 } },
  },
  wakame: {
    canonicalId: "wakame",
    names: { it: ["wakame", "alga wakame", "insalata di alghe"], ja: ["ワカメ", "若布", "乾燥ワカメ"], en: ["wakame", "sea mustard", "edible seaweed"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 45, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 9, zuccheri: 0.6, proteine: 3, fibre: 0.5, sale: 2.5, extra: { iodio_mcg: 420, fucoxantina_mg: 2, calcio_mg: 150, omega3_epa_g: 0.1 } },
  },
  katsuobushi: {
    canonicalId: "katsuobushi",
    names: { it: ["bonito secco", "scaglie di tonno", "katsuobushi"], ja: ["鰹節", "かつお節", "削り節"], en: ["katsuobushi", "bonito flakes", "dried bonito"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 335, grassi: 4, grassi_saturi: 1.5, carboidrati: 0, zuccheri: 0, proteine: 78, fibre: 0, sale: 2, extra: { inosina_mg: 500, vitamina_b12_mcg: 25, niacina_mg: 20, istidina_mg: 1200 } },
  },
  tenkasu: {
    canonicalId: "tenkasu",
    names: { it: ["tenkasu", "avanzi di tempura", "croccantini"], ja: ["天かす", "揚げかす", "天ぷらかす"], en: ["tenkasu", "tempura scraps", "fried batter bits"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 480, grassi: 25, grassi_saturi: 4, carboidrati: 58, zuccheri: 2, proteine: 8, fibre: 3, sale: 1.5, extra: { vitamina_e_mg: 3, potassio_mg: 150, fibra_insolubile_g: 2 } },
  },
  beni_shoga: {
    canonicalId: "beni_shoga",
    names: { it: ["zenzero rosso", "zenzero in salamoia"], ja: ["紅生姜", "べにしょうが", "酢生姜"], en: ["red ginger", "pickled ginger", "beni shoga"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 20, grassi: 0.2, grassi_saturi: 0, carboidrati: 4, zuccheri: 2, proteine: 0.5, fibre: 0.5, sale: 1.5, extra: { gingerolo_mg: 3, antociani_mg: 5, potassio_mg: 80, vitamina_c_mg: 2 } },
  },
  gari: {
    canonicalId: "gari",
    names: { it: ["zenzero marinato", "zenzero per sushi"], ja: ["ガリ", "新生姜の酢漬け", "寿司生姜"], en: ["pickled ginger", "sushi ginger", "gari"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 15, grassi: 0.1, grassi_saturi: 0, carboidrati: 3, zuccheri: 2, proteine: 0.3, fibre: 0.3, sale: 0.8, extra: { gingerolo_mg: 2, acido_acetico_g: 1, potassio_mg: 50, vitamina_c_mg: 1 } },
  },
  vinegar: {
    canonicalId: "vinegar",
    names: { it: ["aceto", "aceto bianco", "aceto di vino"], ja: ["酢", "ビネガー", "ワインビネガー"], en: ["vinegar", "white vinegar", "wine vinegar"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 18, grassi: 0, grassi_saturi: 0, carboidrati: 0.4, zuccheri: 0.4, proteine: 0, fibre: 0, sale: 0.01, extra: { acido_acetico_g: 5, potassio_mg: 2, polifenoli_mg: 3 } },
  },
  lemon_juice: {
    canonicalId: "lemon_juice",
    names: { it: ["succo di limone", "spremuta di limone"], ja: ["レモン果汁", "レモンジュース"], en: ["lemon juice", "fresh lemon juice", "bottled lemon"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 22, grassi: 0.2, grassi_saturi: 0, carboidrati: 7, zuccheri: 2, proteine: 0.4, fibre: 0.3, sale: 0.01, extra: { vitamina_c_mg: 39, acido_citrico_g: 5, potassio_mg: 103, flavonoidi_mg: 15 } },
  },
  lime_juice: {
    canonicalId: "lime_juice",
    names: { it: ["succo di lime", "spremuta di lime"], ja: ["ライム果汁", "ライムジュース"], en: ["lime juice", "fresh lime juice"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 25, grassi: 0.1, grassi_saturi: 0, carboidrati: 8, zuccheri: 1.7, proteine: 0.4, fibre: 0.4, sale: 0.01, extra: { vitamina_c_mg: 22, acido_citrico_g: 4, potassio_mg: 80, flavonoidi_mg: 10 } },
  },
  orange_juice: {
    canonicalId: "orange_juice",
    names: { it: ["succo d'arancia", "spremuta d'arancia"], ja: ["オレンジ果汁", "オレンジジュース"], en: ["orange juice", "fresh orange juice"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 45, grassi: 0.2, grassi_saturi: 0, carboidrati: 10, zuccheri: 8, proteine: 0.7, fibre: 0.2, sale: 0.01, extra: { vitamina_c_mg: 50, folati_mcg: 30, potassio_mg: 200, flavonoidi_mg: 20 } },
  },
  tomato_paste: {
    canonicalId: "tomato_paste",
    names: { it: ["concentrato di pomodoro", "triplo concentrato", "estratto di pomodoro"], ja: ["トマトペースト", "トマト濃縮", "トマトエキス"], en: ["tomato paste", "tomato concentrate", "triple concentrate"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 82, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 19, zuccheri: 12, proteine: 4.3, fibre: 4, sale: 0.5, extra: { licopene_mg: 20, vitamina_c_mg: 22, potassio_mg: 1014, vitamina_k_mcg: 8 } },
  },
  capers: {
    canonicalId: "capers",
    names: { it: ["capperi", "capperi sotto sale", "capperi in salamoia"], ja: ["ケッパー", "ケーパー", "塩漬けケッパー"], en: ["capers", "salted capers", "brined capers"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 23, grassi: 0.9, grassi_saturi: 0.2, carboidrati: 4.9, zuccheri: 0, proteine: 2.4, fibre: 3.2, sale: 2.9, extra: { sodio_mg: 1140, rutina_mg: 33, quercetina_mg: 8, vitamina_k_mcg: 25 } },
  },
  olives: {
    canonicalId: "olives",
    names: { it: ["olive", "olive nere", "olive verdi", "olive taggiasche"], ja: ["オリーブ", "ブラックオリーブ", "グリーンオリーブ"], en: ["olives", "black olives", "green olives", "kalamata"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 115, grassi: 11, grassi_saturi: 1.4, carboidrati: 6, zuccheri: 0.5, proteine: 0.8, fibre: 3.3, sale: 1.5, extra: { acido_oleico_g: 8, polifenoli_mg: 25, vitamina_e_mg: 1.7, ferro_mg: 3.3 } },
  },
  sun_dried_tomatoes: {
    canonicalId: "sun_dried_tomatoes",
    names: { it: ["pomodori secchi", "pomodori al sole", "pomodori essiccati"], ja: ["ドライトマト", "サンドライトマト", "乾燥トマト"], en: ["sun-dried tomatoes", "dried tomatoes", "semi-dried tomatoes"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 258, grassi: 2.8, grassi_saturi: 0.4, carboidrati: 56, zuccheri: 38, proteine: 14, fibre: 12, sale: 1.8, extra: { licopene_mg: 45, vitamina_c_mg: 39, potassio_mg: 1790, vitamina_k_mcg: 43 } },
  },

  // ── Legumi ──────────────────────────────────────────────────────────────
  beans: {
    canonicalId: "beans",
    names: { it: ["fagioli", "fagioli cannellini", "fagioli borlotti", "fagioli neri"], ja: ["豆", "インゲン豆", "金時豆", "黒豆"], en: ["beans", "cannellini beans", "borlotti beans", "black beans"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 341, grassi: 1.4, grassi_saturi: 0.4, carboidrati: 63, zuccheri: 2, proteine: 24, fibre: 25, sale: 0.01, extra: { ferro_mg: 8.2, folati_mcg: 394, potassio_mg: 1406, magnesio_mg: 180 } },
  },
  chickpeas: {
    canonicalId: "chickpeas",
    names: { it: ["ceci", "ceci secchi", "ceci in scatola", "farina di ceci"], ja: ["ひよこ豆", "チークピー", "缶詰ひよこ豆"], en: ["chickpeas", "garbanzo beans", "canned chickpeas"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 364, grassi: 6, grassi_saturi: 0.6, carboidrati: 61, zuccheri: 11, proteine: 19, fibre: 17, sale: 0.02, extra: { ferro_mg: 6.2, folati_mcg: 557, potassio_mg: 718, zinco_mg: 3.4 } },
  },
  lentils: {
    canonicalId: "lentils",
    names: { it: ["lenticchie", "lenticchie rosse", "lenticchie verdi"], ja: ["レンズ豆", "レッドレンティル", "グリーンレンティル"], en: ["lentils", "red lentils", "green lentils", "brown lentils"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 353, grassi: 1.1, grassi_saturi: 0.2, carboidrati: 63, zuccheri: 2, proteine: 25, fibre: 11, sale: 0.01, extra: { ferro_mg: 6.5, folati_mcg: 479, potassio_mg: 677, polifenoli_mg: 20 } },
  },
  peas: {
    canonicalId: "peas",
    names: { it: ["piselli", "piselli freschi", "piselli surgelati"], ja: ["エンドウ豆", "グリーンピース", "さやえんどう"], en: ["peas", "green peas", "fresh peas", "frozen peas"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 81, grassi: 0.4, grassi_saturi: 0.1, carboidrati: 14, zuccheri: 5.7, proteine: 5.4, fibre: 5.7, sale: 0.01, extra: { vitamina_k_mcg: 25, folati_mcg: 65, luteina_mcg: 2477, vitamina_c_mg: 40 } },
  },
  tofu: {
    canonicalId: "tofu",
    names: { it: ["tofu", "formaggio di soia", "tofu fresco", "tofu compatto"], ja: ["豆腐", "木綿豆腐", "絹ごし豆腐", "焼き豆腐"], en: ["tofu", "firm tofu", "silken tofu", "soft tofu"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 76, grassi: 4.8, grassi_saturi: 0.7, carboidrati: 1.9, zuccheri: 0.7, proteine: 8, fibre: 0.3, sale: 0.01, extra: { calcio_mg: 350, isoflavoni_mg: 20, ferro_mg: 1.4, magnesio_mg: 30 } },
  },
  edamame: {
    canonicalId: "edamame",
    names: { it: ["edamame", "fagioli di soia verdi", "soia giovane"], ja: ["枝豆", "えだまめ", "若大豆"], en: ["edamame", "young soybeans", "green soybeans"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 122, grassi: 5.2, grassi_saturi: 0.6, carboidrati: 9, zuccheri: 2.2, proteine: 11, fibre: 5, sale: 0.01, extra: { isoflavoni_mg: 25, folati_mcg: 311, vitamina_k_mcg: 27, ferro_mg: 2.3 } },
  },
  natto: {
    canonicalId: "natto",
    names: { it: ["natto", "soia fermentata giapponese"], ja: ["納豆", "糸引き納豆", "ひきわり納豆"], en: ["natto", "fermented soybeans", "japanese natto"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 212, grassi: 11, grassi_saturi: 1.6, carboidrati: 13, zuccheri: 2, proteine: 19, fibre: 5, sale: 0.02, extra: { vitamina_k2_mcg: 1100, nattokinase_enzima: true, probiotici: true, isoflavoni_mg: 30 } },
  },
  red_bean_paste: {
    canonicalId: "red_bean_paste",
    names: { it: ["pasta di fagioli rossi", "anko", "pasta dolce di azuki"], ja: ["あんこ", "小豆餡", "つぶあん", "こしあん"], en: ["red bean paste", "anko", "azuki paste", "sweet bean paste"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 280, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 65, zuccheri: 45, proteine: 7, fibre: 6, sale: 0.01, extra: { polifenoli_mg: 30, potassio_mg: 500, ferro_mg: 2, antiossidanti_anthocyanin: true } },
  },
  azuki_beans: {
    canonicalId: "azuki_beans",
    names: { it: ["fagioli azuki", "fagioli rossi giapponesi"], ja: ["小豆", "アズキ", "赤豆"], en: ["azuki beans", "red beans", "adzuki"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 329, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 63, zuccheri: 2, proteine: 20, fibre: 13, sale: 0.01, extra: { polifenoli_mg: 40, potassio_mg: 1200, ferro_mg: 5, folati_mcg: 120 } },
  },
  soybeans: {
    canonicalId: "soybeans",
    names: { it: ["soia", "fagioli di soia", "soia gialla"], ja: ["大豆", "ダイズ", "きだいず"], en: ["soybeans", "soy beans", "yellow soybeans"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 446, grassi: 20, grassi_saturi: 2.9, carboidrati: 30, zuccheri: 7, proteine: 36, fibre: 9, sale: 0.01, extra: { isoflavoni_mg: 100, ferro_mg: 15.7, calcio_mg: 277, omega3_ala_g: 1.6 } },
  },

  // ── Frutta secca e semi ─────────────────────────────────────────────────
  almonds: {
    canonicalId: "almonds",
    names: { it: ["mandorle", "mandorle pelate", "mandorle tostate", "farina di mandorle"], ja: ["アーモンド", "皮なしアーモンド", "ローストアーモンド"], en: ["almonds", "blanched almonds", "roasted almonds", "almond flour"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 576, grassi: 50, grassi_saturi: 4, carboidrati: 22, zuccheri: 4, proteine: 21, fibre: 12, sale: 0.01, extra: { vitamina_e_mg: 26, magnesio_mg: 270, calcio_mg: 269, potassio_mg: 733 } },
  },
  walnuts: {
    canonicalId: "walnuts",
    names: { it: ["noci", "noci sgusciate", "noci tritate", "gherigli"], ja: ["くるみ", "胡桃", "砕きくるみ", "ウォールナッツ"], en: ["walnuts", "walnut halves", "chopped walnuts"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 654, grassi: 65, grassi_saturi: 6, carboidrati: 14, zuccheri: 2.6, proteine: 15, fibre: 7, sale: 0.01, extra: { omega3_ala_g: 9, polifenoli_mg: 160, magnesio_mg: 158, rame_mg: 1.6 } },
  },
  pine_nuts: {
    canonicalId: "pine_nuts",
    names: { it: ["pinoli", "pinoli sgusciati", "pinoli mediterranei"], ja: ["松の実", "マツノミ", "イタリアンパインナッツ"], en: ["pine nuts", "pignoli", "mediterranean pine nuts"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 673, grassi: 68, grassi_saturi: 5, carboidrati: 13, zuccheri: 3.6, proteine: 14, fibre: 3.7, sale: 0.01, extra: { pinolenico_g: 15, vitamina_k_mcg: 54, magnesio_mg: 251, zinco_mg: 6.5 } },
  },
  peanuts: {
    canonicalId: "peanuts",
    names: { it: ["arachidi", "arachidi tostate", "burro di arachidi"], ja: ["ピーナッツ", "落花生", "ピーナッツバター"], en: ["peanuts", "roasted peanuts", "peanut butter"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 567, grassi: 49, grassi_saturi: 7, carboidrati: 16, zuccheri: 4, proteine: 26, fibre: 9, sale: 0.02, extra: { resveratrolo_mcg: 130, niacina_mg: 12, folati_mcg: 240, magnesio_mg: 168 } },
  },
  cashews: {
    canonicalId: "cashews",
    names: { it: ["anacardi", "anacardi tostati", "anacardi salati"], ja: ["カシューナッツ", "腰果", "ローストカシュー"], en: ["cashews", "roasted cashews", "salted cashews"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 553, grassi: 44, grassi_saturi: 8, carboidrati: 30, zuccheri: 6, proteine: 18, fibre: 3, sale: 0.02, extra: { rame_mg: 2.2, magnesio_mg: 292, zinco_mg: 5.8, ferro_mg: 6.7 } },
  },
  sesame_seeds: {
    canonicalId: "sesame_seeds",
    names: { it: ["semi di sesamo", "sesamo", "semi tostati", "sesamo bianco", "sesamo nero"], ja: ["ごま", "白ごま", "黒ごま", "煎りごま", "すりごま"], en: ["sesame seeds", "white sesame", "black sesame", "toasted sesame"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 573, grassi: 50, grassi_saturi: 7, carboidrati: 23, zuccheri: 0.3, proteine: 18, fibre: 12, sale: 0.01, extra: { calcio_mg: 975, sesamina_mg: 5, ferro_mg: 14.6, zinco_mg: 7.8 } },
  },
  pumpkin_seeds: {
    canonicalId: "pumpkin_seeds",
    names: { it: ["semi di zucca", "pepitas", "semi tostati"], ja: ["カボチャの種", "パンプキンシード", "ローストパンプキンシード"], en: ["pumpkin seeds", "pepitas", "roasted pumpkin seeds"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 559, grassi: 49, grassi_saturi: 9, carboidrati: 11, zuccheri: 1.4, proteine: 30, fibre: 6, sale: 0.01, extra: { zinco_mg: 7.8, magnesio_mg: 592, ferro_mg: 8.8, triptofano_mg: 580 } },
  },
  sunflower_seeds: {
    canonicalId: "sunflower_seeds",
    names: { it: ["semi di girasole", "girasoli", "semi tostati"], ja: ["ひまわりの種", "サンフラワーシード"], en: ["sunflower seeds", "roasted sunflower seeds"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 584, grassi: 51, grassi_saturi: 4.5, carboidrati: 20, zuccheri: 2.6, proteine: 21, fibre: 8.6, sale: 0.01, extra: { vitamina_e_mg: 35, magnesio_mg: 325, selenio_mcg: 53, fitosteroli_mg: 270 } },
  },
  hazelnuts: {
    canonicalId: "hazelnuts",
    names: { it: ["nocciole", "nocciole tostate", "nocciole pelate"], ja: ["ヘーゼルナッツ", "ハシバミ", "ローストヘーゼル"], en: ["hazelnuts", "filberts", "roasted hazelnuts"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 628, grassi: 61, grassi_saturi: 4.5, carboidrati: 17, zuccheri: 4.3, proteine: 15, fibre: 10, sale: 0.01, extra: { vitamina_e_mg: 15, folati_mcg: 113, magnesio_mg: 163, potassio_mg: 680 } },
  },
  pistachios: {
    canonicalId: "pistachios",
    names: { it: ["pistacchi", "pistacchi di bronte", "pistacchi tostati"], ja: ["ピスタチオ", "阿月薫子", "ローストピスタチオ"], en: ["pistachios", "sicilian pistachios", "roasted pistachios"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 560, grassi: 45, grassi_saturi: 5.5, carboidrati: 28, zuccheri: 8, proteine: 20, fibre: 10, sale: 0.01, extra: { luteina_mcg: 2900, vitamina_b6_mg: 1.7, potassio_mg: 1025, polifenoli_mg: 35 } },
  },
  macadamia: {
    canonicalId: "macadamia",
    names: { it: ["noci di macadamia", "macadamia", "noci australiane"], ja: ["マカデミアナッツ", "マカデミア", "オーストラリアンナッツ"], en: ["macadamia", "macadamia nuts", "australian nuts"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 718, grassi: 76, grassi_saturi: 12, carboidrati: 14, zuccheri: 4.6, proteine: 8, fibre: 8.6, sale: 0.01, extra: { acido_palmitoleico_g: 17, tiamina_mg: 1.2, manganese_mg: 4.1, ferro_mg: 3.7 } },
  },
  chestnuts: {
    canonicalId: "chestnuts",
    names: { it: ["castagne", "marroni", "castagne secche"], ja: ["栗", "クリ", "焼き栗"], en: ["chestnuts", "roasted chestnuts", "candied chestnuts"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 213, grassi: 2.3, grassi_saturi: 0.4, carboidrati: 46, zuccheri: 10, proteine: 2.4, fibre: 8.1, sale: 0.01, extra: { vitamina_c_mg: 43, potassio_mg: 715, folati_mcg: 62, rame_mg: 0.5 } },
  },
  brazil_nuts: {
    canonicalId: "brazil_nuts",
    names: { it: ["noci del brasile", "castagne del parà"], ja: ["ブラジルナッツ", "パラナッツ"], en: ["brazil nuts", "paranuts", "creamy nuts"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 656, grassi: 66, grassi_saturi: 16, carboidrati: 12, zuccheri: 2.3, proteine: 14, fibre: 7.5, sale: 0.01, extra: { selenio_mcg: 1917, magnesio_mg: 376, potassio_mg: 659, vitamina_e_mg: 5.7 } },
  },
  pecans: {
    canonicalId: "pecans",
    names: { it: ["noci pecan", "pecan", "noci americane"], ja: ["ピーカンナッツ", "ペカン"], en: ["pecans", "pecan nuts", "american walnuts"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 691, grassi: 72, grassi_saturi: 6, carboidrati: 14, zuccheri: 4, proteine: 9, fibre: 10, sale: 0.01, extra: { acido_oleico_g: 40, polifenoli_mg: 170, zinco_mg: 4.5, manganese_mg: 4.5 } },
  },
  chia_seeds: {
    canonicalId: "chia_seeds",
    names: { it: ["semi di chia", "chia", "salvia hispanica"], ja: ["チアシード", "チアの実"], en: ["chia seeds", "chia", "salvia seeds"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 486, grassi: 31, grassi_saturi: 3.3, carboidrati: 42, zuccheri: 0, proteine: 17, fibre: 34, sale: 0.01, extra: { omega3_ala_g: 18, calcio_mg: 631, magnesio_mg: 335, antiossidanti_orac: 9800 } },
  },
  flax_seeds: {
    canonicalId: "flax_seeds",
    names: { it: ["semi di lino", "lino", "semi dorati"], ja: ["亜麻仁", "フラックスシード", "リノシード"], en: ["flax seeds", "linseed", "golden flax"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 534, grassi: 42, grassi_saturi: 3.7, carboidrati: 29, zuccheri: 1.6, proteine: 18, fibre: 27, sale: 0.01, extra: { omega3_ala_g: 23, lignani_mg: 80, magnesio_mg: 392, potassio_mg: 813 } },
  },

  // ── Dolcificanti e ingredienti per dolci ────────────────────────────────
  brown_sugar: {
    canonicalId: "brown_sugar",
    names: { it: ["zucchero di canna", "zucchero bruno", "zucchero muscovado"], ja: ["黒糖", "ブラウンシュガー", "きび砂糖"], en: ["brown sugar", "dark brown sugar", "light brown sugar"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 380, grassi: 0, grassi_saturi: 0, carboidrati: 98, zuccheri: 97, proteine: 0.1, fibre: 0, sale: 0.01, extra: { calcio_mg: 83, potassio_mg: 133, ferro_mg: 0.7, magnesio_mg: 9 } },
  },
  powdered_sugar: {
    canonicalId: "powdered_sugar",
    names: { it: ["zucchero a velo", "zucchero impalpabile", "glassa"], ja: ["粉糖", "アイシングシュガー", "グラニュー糖粉"], en: ["powdered sugar", "icing sugar", "confectioners sugar"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 389, grassi: 0, grassi_saturi: 0, carboidrati: 100, zuccheri: 100, proteine: 0, fibre: 0, sale: 0.01 },
  },
  maple_syrup: {
    canonicalId: "maple_syrup",
    names: { it: ["sciroppo d'acero", "miele d'acero", "sciroppo puro"], ja: ["メープルシロップ", "カエデシロップ", "純正メープル"], en: ["maple syrup", "pure maple syrup", "grade a maple syrup"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 260, grassi: 0.1, grassi_saturi: 0, carboidrati: 67, zuccheri: 60, proteine: 0, fibre: 0, sale: 0.01, extra: { manganese_mg: 0.6, zinco_mg: 1.5, polifenoli_mg: 15, potassio_mg: 212 } },
  },
  agave: {
    canonicalId: "agave",
    names: { it: ["sciroppo di agave", "nettare di agave"], ja: ["アガベシロップ", "アガベネクター"], en: ["agave syrup", "agave nectar", "blue agave"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 310, grassi: 0, grassi_saturi: 0, carboidrati: 76, zuccheri: 76, proteine: 0.1, fibre: 0.2, sale: 0.01, extra: { fruttosio_percent: 70, inulina_g: 2, potassio_mg: 8, calcio_mg: 6 } },
  },
  molasses: {
    canonicalId: "molasses",
    names: { it: ["melassa", "sciroppo di canna"], ja: ["糖蜜", "モラセス", "ブラックストラップ"], en: ["molasses", "blackstrap molasses", "cane syrup"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 290, grassi: 0.1, grassi_saturi: 0, carboidrati: 75, zuccheri: 55, proteine: 0, fibre: 0, sale: 0.1, extra: { ferro_mg: 4.7, calcio_mg: 205, magnesio_mg: 242, potassio_mg: 1464 } },
  },
  vanilla: {
    canonicalId: "vanilla",
    names: { it: ["vaniglia", "estratto di vaniglia", "baccello di vaniglia"], ja: ["バニラ", "バニラエッセンス", "バニラビーンズ"], en: ["vanilla", "vanilla extract", "vanilla bean"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 288, grassi: 0.1, grassi_saturi: 0, carboidrati: 13, zuccheri: 13, proteine: 0.1, fibre: 0, sale: 0.01, extra: { vanillina_mg: 1500, antiossidanti_orac: 122400, potassio_mg: 148 } },
  },
  cocoa: {
    canonicalId: "cocoa",
    names: { it: ["cacao", "cacao in polvere", "cacao amaro"], ja: ["ココア", "ココアパウダー", "純ココア"], en: ["cocoa", "cocoa powder", "unsweetened cocoa"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 228, grassi: 14, grassi_saturi: 8, carboidrati: 58, zuccheri: 1.8, proteine: 20, fibre: 33, sale: 0.02, extra: { flavanoli_mg: 50, ferro_mg: 13.9, magnesio_mg: 499, potassio_mg: 1524 } },
  },
  chocolate: {
    canonicalId: "chocolate",
    names: { it: ["cioccolato", "cioccolato fondente", "cioccolato al latte", "gocce"], ja: ["チョコレート", "ビターチョコ", "ミルクチョコ", "チョコチップ"], en: ["chocolate", "dark chocolate", "milk chocolate", "chocolate chips"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 546, grassi: 31, grassi_saturi: 19, carboidrati: 61, zuccheri: 48, proteine: 4.9, fibre: 7, sale: 0.02, extra: { flavanoli_mg: 30, ferro_mg: 11.9, magnesio_mg: 228, teobromina_mg: 200 } },
  },
  white_chocolate: {
    canonicalId: "white_chocolate",
    names: { it: ["cioccolato bianco", "cioccolato bianco fondente"], ja: ["ホワイトチョコレート", "ホワイトチョコ"], en: ["white chocolate", "white baking chocolate"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 539, grassi: 32, grassi_saturi: 20, carboidrati: 59, zuccheri: 59, proteine: 5.9, fibre: 0.2, sale: 0.1, extra: { calcio_mg: 199, vitamina_b12_mcg: 0.4, colesterolo_mg: 21 } },
  },
  baking_powder: {
    canonicalId: "baking_powder",
    names: { it: ["lievito per dolci", "lievito chimico", "polvere lievitante"], ja: ["ベーキングパウダー", "膨張剤", "ふくらし粉"], en: ["baking powder", "baking soda", "leavening agent"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 53, grassi: 0, grassi_saturi: 0, carboidrati: 28, zuccheri: 0, proteine: 0, fibre: 0, sale: 12, extra: { sodio_mg: 4800, alluminio_mcg: 50, calcio_mg: 300 } },
  },
  baking_soda: {
    canonicalId: "baking_soda",
    names: { it: ["bicarbonato di sodio", "bicarbonato"], ja: ["重曹", "ベーキングソーダ"], en: ["baking soda", "sodium bicarbonate"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 0, grassi: 0, grassi_saturi: 0, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 27, extra: { sodio_mg: 10700, potassio_mg: 1 } },
  },
  yeast: {
    canonicalId: "yeast",
    names: { it: ["lievito di birra", "lievito fresco", "lievito secco"], ja: ["イースト", "ドライイースト", "生イースト"], en: ["yeast", "active dry yeast", "instant yeast"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 325, grassi: 4, grassi_saturi: 0.6, carboidrati: 41, zuccheri: 0, proteine: 40, fibre: 27, sale: 0.05, extra: { vitamina_b1_mg: 11, vitamina_b2_mg: 4, niacina_mg: 40, selenio_mcg: 80 } },
  },
  gelatin: {
    canonicalId: "gelatin",
    names: { it: ["colla di pesce", "gelatina", "gelatina in fogli"], ja: ["ゼラチン", "板ゼラチン", "粉末ゼラチン"], en: ["gelatin", "gelatine", "sheet gelatin"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 335, grassi: 0, grassi_saturi: 0, carboidrati: 0, zuccheri: 0, proteine: 84, fibre: 0, sale: 0.1, extra: { glicina_g: 18, prolina_g: 12, idrossiprolina_g: 10, collagene_tipo1: true } },
  },
  agar: {
    canonicalId: "agar",
    names: { it: ["agar agar", "gelatina vegetale", "kanten"], ja: ["寒天", "アガー", "かんてん"], en: ["agar", "agar agar", "vegetable gelatin"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 30, grassi: 0, grassi_saturi: 0, carboidrati: 80, zuccheri: 0, proteine: 0, fibre: 80, sale: 0.01, extra: { agarosio_g: 70, calcio_mg: 60, ferro_mg: 2, magnesio_mg: 10 } },
  },
  matcha: {
    canonicalId: "matcha",
    names: { it: ["matcha", "tè verde in polvere", "polvere di matcha"], ja: ["抹茶", "薄茶", "濃茶", "緑茶パウダー"], en: ["matcha", "matcha powder", "green tea powder"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 276, grassi: 5.3, grassi_saturi: 1.1, carboidrati: 39, zuccheri: 0, proteine: 30, fibre: 39, sale: 0.02, extra: { egcg_mg: 134, l_teanina_mg: 20, caffeina_mg: 35, vitamina_c_mg: 10 } },
  },
  cream_of_tartar: {
    canonicalId: "cream_of_tartar",
    names: { it: ["cremor tartaro", "acido tartarico"], ja: ["クリームオブターター", "酒石酸水素カリウム"], en: ["cream of tartar", "potassium bitartrate"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 0, grassi: 0, grassi_saturi: 0, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0, extra: { potassio_mg: 2300, acido_tartarico_g: 100 } },
  },
  corn_syrup: {
    canonicalId: "corn_syrup",
    names: { it: ["sciroppo di glucosio", "sciroppo di mais", "glucosio"], ja: ["コーンシロップ", "ブドウ糖液", "グルコース"], en: ["corn syrup", "glucose syrup", "light corn syrup"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 290, grassi: 0, grassi_saturi: 0, carboidrati: 76, zuccheri: 30, proteine: 0, fibre: 0, sale: 0.01, extra: { glucosio_percent: 30, maltosio_percent: 20, potassio_mg: 2 } },
  },
  invert_sugar: {
    canonicalId: "invert_sugar",
    names: { it: ["zucchero invertito", "sciroppo invertito"], ja: ["転化糖", "インバートシュガー"], en: ["invert sugar", "invert syrup", "trimoline"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 300, grassi: 0, grassi_saturi: 0, carboidrati: 80, zuccheri: 80, proteine: 0, fibre: 0, sale: 0.01, extra: { glucosio_percent: 40, fruttosio_percent: 40, ig_basso: true } },
  },
  marzipan: {
    canonicalId: "marzipan",
    names: { it: ["marzapane", "pasta di mandorle", "mandorlato"], ja: ["マジパン", "アーモンドペースト"], en: ["marzipan", "almond paste", "almond marzipan"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 450, grassi: 22, grassi_saturi: 2, carboidrati: 58, zuccheri: 50, proteine: 10, fibre: 5, sale: 0.02, extra: { vitamina_e_mg: 8, magnesio_mg: 80, potassio_mg: 250, calcio_mg: 100 } },
  },
  fondant: {
    canonicalId: "fondant",
    names: { it: ["fondente", "pasta di zucchero", "glassa fondente"], ja: ["フォンダン", "シュガーペースト", "アイシング"], en: ["fondant", "sugar paste", "icing fondant"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 380, grassi: 0, grassi_saturi: 0, carboidrati: 98, zuccheri: 95, proteine: 0.1, fibre: 0, sale: 0.01 },
  },

  // ── Uova ────────────────────────────────────────────────────────────────
  egg: {
    canonicalId: "egg",
    names: { it: ["uovo", "uova", "tuorlo", "albume", "uovo intero"], ja: ["卵", "鶏卵", "卵黄", "卵白", "全卵"], en: ["egg", "chicken egg", "egg yolk", "egg white", "whole egg"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 143, grassi: 10, grassi_saturi: 3.3, carboidrati: 0.7, zuccheri: 0.4, proteine: 13, fibre: 0, sale: 0.14, extra: { colesterolo_mg: 373, vitamina_d_mcg: 2, colina_mg: 251, luteina_mcg: 353 } },
    peso_medio_unità: 50,
  },
  egg_yolk: {
    canonicalId: "egg_yolk",
    names: { it: ["tuorlo", "tuorlo d'uovo", "rosso d'uovo"], ja: ["卵黄", "黄身", "イエローエッグ"], en: ["egg yolk", "yolk", "chicken egg yolk"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 322, grassi: 27, grassi_saturi: 9.5, carboidrati: 3.6, zuccheri: 0.1, proteine: 16, fibre: 0, sale: 0.05, extra: { colesterolo_mg: 1085, vitamina_a_mcg: 381, vitamina_d_mcg: 5.4, colina_mg: 680 } },
  },
  egg_white: {
    canonicalId: "egg_white",
    names: { it: ["albume", "albume d'uovo", "bianco d'uovo"], ja: ["卵白", "白身", "ホワイトエッグ"], en: ["egg white", "egg albumen", "chicken egg white"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 52, grassi: 0.2, grassi_saturi: 0, carboidrati: 0.7, zuccheri: 0.7, proteine: 11, fibre: 0, sale: 0.17, extra: { riboflavina_mg: 0.4, potassio_mg: 163, magnesio_mg: 11 } },
  },
  quail_egg: {
    canonicalId: "quail_egg",
    names: { it: ["uovo di quaglia", "quaglie", "piccole uova"], ja: ["ウズラの卵", "うずら卵"], en: ["quail egg", "quail eggs"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 158, grassi: 11, grassi_saturi: 3.6, carboidrati: 0.4, zuccheri: 0.4, proteine: 13, fibre: 0, sale: 0.14, extra: { colesterolo_mg: 844, vitamina_b12_mcg: 1.6, ferro_mg: 3.6, potassio_mg: 132 } },
    peso_medio_unità: 10,
  },
  duck_egg: {
    canonicalId: "duck_egg",
    names: { it: ["uovo d'anatra", "uova di anatra"], ja: ["アヒルの卵", "鴨卵"], en: ["duck egg", "duck eggs"] },
    defaultUnit: "g", isSolid: true,
    nutrition: { energia_kcal: 185, grassi: 14, grassi_saturi: 4.5, carboidrati: 0.9, zuccheri: 0.9, proteine: 13, fibre: 0, sale: 0.15, extra: { colesterolo_mg: 884, vitamina_b12_mcg: 5.4, vitamina_a_mcg: 472, omega3_g: 0.2 } },
    peso_medio_unità: 70,
  },

  // ── Brodi e liquidi di cottura ──────────────────────────────────────────
  chicken_stock: {
    canonicalId: "chicken_stock",
    names: { it: ["brodo di pollo", "fond di pollo", "brodo"], ja: ["鶏がらスープ", "チキンスープ", "出汁"], en: ["chicken stock", "chicken broth", "chicken soup"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 15, grassi: 0.5, grassi_saturi: 0.2, carboidrati: 1.1, zuccheri: 0.5, proteine: 2.7, fibre: 0, sale: 0.4, extra: { sodio_mg: 160, collagene_mg: 100, potassio_mg: 45 } },
  },
  beef_stock: {
    canonicalId: "beef_stock",
    names: { it: ["brodo di manzo", "fond di manzo", "brodo scuro"], ja: ["牛骨スープ", "ビーフストック", "牛出汁"], en: ["beef stock", "beef broth", "brown stock"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 18, grassi: 0.7, grassi_saturi: 0.3, carboidrati: 1.5, zuccheri: 0.6, proteine: 3, fibre: 0, sale: 0.5, extra: { sodio_mg: 200, collagene_mg: 120, ferro_mg: 0.3 } },
  },
  vegetable_stock: {
    canonicalId: "vegetable_stock",
    names: { it: ["brodo vegetale", "brodo di verdure", "dado vegetale"], ja: ["野菜スープ", "ベジタブルストック", "野菜出汁"], en: ["vegetable stock", "vegetable broth", "veggie stock"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 12, grassi: 0.2, grassi_saturi: 0, carboidrati: 2, zuccheri: 1, proteine: 0.5, fibre: 0.3, sale: 0.4, extra: { potassio_mg: 50, vitamina_c_mg: 2, antiossidanti_polifenoli: true } },
  },
  fish_stock: {
    canonicalId: "fish_stock",
    names: { it: ["brodo di pesce", "fumetto di pesce"], ja: ["魚介出汁", "フィッシュストック"], en: ["fish stock", "fish broth", "fumet"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 10, grassi: 0.2, grassi_saturi: 0.1, carboidrati: 0.5, zuccheri: 0, proteine: 2, fibre: 0, sale: 0.5, extra: { iodio_mcg: 15, omega3_epa_dha_mg: 20, potassio_mg: 30 } },
  },
  water: {
    canonicalId: "water",
    names: { it: ["acqua", "acqua fredda", "acqua calda", "acqua bollente"], ja: ["水", "お水", "お湯", "熱湯"], en: ["water", "cold water", "hot water", "boiling water"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 0, grassi: 0, grassi_saturi: 0, carboidrati: 0, zuccheri: 0, proteine: 0, fibre: 0, sale: 0 },
  },
  white_wine: {
    canonicalId: "white_wine",
    names: { it: ["vino bianco", "vino bianco secco", "vino da cucina"], ja: ["白ワイン", "辛口白ワイン", "料理用ワイン"], en: ["white wine", "dry white wine", "cooking wine"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 82, grassi: 0, grassi_saturi: 0, carboidrati: 2.6, zuccheri: 1.2, proteine: 0.1, fibre: 0, sale: 0.01, extra: { alcol_percent: 12, resveratrolo_mcg: 10, potassio_mg: 92, antiossidanti_polifenoli: true } },
  },
  red_wine: {
    canonicalId: "red_wine",
    names: { it: ["vino rosso", "vino rosso corposo", "vino da cucina"], ja: ["赤ワイン", "辛口赤ワイン", "料理用ワイン"], en: ["red wine", "dry red wine", "cooking wine"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 85, grassi: 0, grassi_saturi: 0, carboidrati: 2.6, zuccheri: 0.9, proteine: 0.1, fibre: 0, sale: 0.01, extra: { alcol_percent: 13, resveratrolo_mg: 0.2, antociani_mg: 25, potassio_mg: 127 } },
  },
  beer: {
    canonicalId: "beer",
    names: { it: ["birra", "birra chiara", "birra scura"], ja: ["ビール", "生ビール", "クラフトビール"], en: ["beer", "lager", "craft beer"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 43, grassi: 0, grassi_saturi: 0, carboidrati: 3.6, zuccheri: 0, proteine: 0.5, fibre: 0, sale: 0.01, extra: { alcol_percent: 5, silicio_mg: 10, vitamina_b_mg: 0.1, potassio_mg: 45 } },
  },
  kombu_dashi: {
    canonicalId: "kombu_dashi",
    names: { it: ["dashi di kombu", "brodo di alga"], ja: ["昆布出汁", "こんぶだし"], en: ["kombu dashi", "kelp stock", "vegetarian dashi"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 5, grassi: 0, grassi_saturi: 0, carboidrati: 0.5, zuccheri: 0, proteine: 0.5, fibre: 0, sale: 0.3, extra: { glutammato_naturale: true, iodio_mcg: 50, alginati_mg: 10 } },
  },
  niboshi_dashi: {
    canonicalId: "niboshi_dashi",
    names: { it: ["dashi di sardine", "brodo di pesce secco"], ja: ["煮干し出汁", "にぼしだし"], en: ["niboshi dashi", "dried sardine stock"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 12, grassi: 0.3, grassi_saturi: 0.1, carboidrati: 0.5, zuccheri: 0, proteine: 2, fibre: 0, sale: 0.8, extra: { inosina_mg: 30, calcio_mg: 20, omega3_epa_dha_mg: 15 } },
  },
  coconut_milk: {
    canonicalId: "coconut_milk",
    names: { it: ["latte di cocco", "crema di cocco"], ja: ["ココナッツミルク", "椰乳"], en: ["coconut milk", "coconut cream", "thick coconut"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 230, grassi: 24, grassi_saturi: 21, carboidrati: 6, zuccheri: 3, proteine: 2.3, fibre: 2.2, sale: 0.02, extra: { acido_laurico_g: 12, ferro_mg: 3.9, magnesio_mg: 37, potassio_mg: 263 } },
  },
  almond_milk: {
    canonicalId: "almond_milk",
    names: { it: ["latte di mandorle", "bevanda di mandorle"], ja: ["アーモンドミルク", "アーモンド飲料"], en: ["almond milk", "almond beverage", "nut milk"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 15, grassi: 1.1, grassi_saturi: 0.1, carboidrati: 0.6, zuccheri: 0, proteine: 0.6, fibre: 0.2, sale: 0.07, extra: { vitamina_e_mg: 7.3, calcio_mg: 120, potassio_mg: 15 } },
  },
  soy_milk: {
    canonicalId: "soy_milk",
    names: { it: ["latte di soia", "bevanda di soia"], ja: ["豆乳", "とうにゅう"], en: ["soy milk", "soy beverage", "soy drink"] },
    defaultUnit: "ml", isSolid: false,
    nutrition: { energia_kcal: 54, grassi: 1.8, grassi_saturi: 0.3, carboidrati: 6, zuccheri: 3, proteine: 3.3, fibre: 0.6, sale: 0.01, extra: { isoflavoni_mg: 20, calcio_mg: 25, potassio_mg: 118, vitamina_b12_mcg: 1.2 } },
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
