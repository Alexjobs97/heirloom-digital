import type { TranslationKey } from "./it";
import it from "./it";

const ja: typeof it = {
  // ─── App ──────────────────────────────────────────────────────────────────
  "app.name": "ヘアルーム デジタル",
  "app.tagline": "家族のレシピを、デジタルで。",

  // ─── Nav ──────────────────────────────────────────────────────────────────
  "nav.home": "レシピ",
  "nav.add": "レシピを追加",
  "nav.planner": "献立",
  "nav.settings": "設定",

  // ─── Home ─────────────────────────────────────────────────────────────────
  "home.empty.title": "レシピ帳がまだ空です",
  "home.empty.subtitle": "テキストを貼り付けて最初のレシピを追加してください",
  "home.empty.cta": "レシピを追加",
  "home.import.drop": "recipes.jsonをここにドラッグしてインポート",
  "home.import.success": "インポート完了",
  "home.import.error": "インポートエラー",
  "home.recipes.count_one": "{{count}}件のレシピ",
  "home.recipes.count_other": "{{count}}件のレシピ",

  // ─── Search & Filter ──────────────────────────────────────────────────────
  "search.placeholder": "名前・食材・タグで検索…",
  "search.noResults": "レシピが見つかりません",
  "search.noResults.hint": "別のキーワードをお試しください",
  "filter.all": "すべて",
  "filter.starred": "⭐ お気に入り",
  "filter.recent": "🕐 最近調理",
  "filter.quick": "⚡ 30分以内",
  "filter.tags": "タグ",

  // ─── Recipe Card ──────────────────────────────────────────────────────────
  "card.servings_one": "{{count}}人前",
  "card.servings_other": "{{count}}人前",
  "card.time": "{{min}}分",
  "card.time.unknown": "時間不明",
  "card.lastCooked": "最終調理：{{date}}",
  "card.neverCooked": "未調理",

  // ─── Add Recipe ───────────────────────────────────────────────────────────
  "add.title": "レシピを追加",
  "add.paste.label": "レシピのテキストを貼り付け（どんな形式でも）",
  "add.paste.placeholder":
    "ここにレシピを貼り付けてください…\n\nどんな形式でも対応しています：料理サイト、ブログ、英語のカップやオンスの単位も自動変換します。",
  "add.paste.analyze": "レシピを解析",
  "add.paste.analyzing": "解析中…",
  "add.paste.clear": "クリア",
  "add.paste.empty": "先にレシピのテキストを貼り付けてください",

  // ─── Parse Review ─────────────────────────────────────────────────────────
  "review.title": "確認・編集",
  "review.subtitle": "解析結果を確認し、保存前に編集してください。",
  "review.original": "元のテキスト",
  "review.edited": "編集済みレシピ",
  "review.save": "レシピ帳に保存",
  "review.saving": "保存中…",
  "review.back": "← 戻る",
  "review.warnings.title": "注意",
  "review.field.title": "タイトル",
  "review.field.yield": "人数",
  "review.field.totalTime": "合計時間（分）",
  "review.field.ingredients": "材料",
  "review.field.steps": "作り方",
  "review.field.tags": "タグ（カンマ区切り）",
  "review.ingredient.qty": "量",
  "review.ingredient.unit": "単位",
  "review.ingredient.name": "材料名",
  "review.ingredient.add": "材料を追加",
  "review.ingredient.remove": "削除",
  "review.step.add": "手順を追加",
  "review.step.remove": "削除",
  "review.ambiguous.hint": "固体なのに体積(ml)が指定されています。量を確認してください。",

  // ─── Recipe Detail ────────────────────────────────────────────────────────
  "detail.servings": "人数",
  "detail.servings.label": "何人分？",
  "detail.time.total": "合計時間",
  "detail.time.prep": "下準備",
  "detail.time.cook": "調理",
  "detail.ingredients": "材料",
  "detail.ingredients.checkAll": "すべて選択",
  "detail.ingredients.uncheckAll": "すべて解除",
  "detail.steps": "作り方",
  "detail.cook": "調理を始める",
  "detail.edit": "レシピを編集",
  "detail.delete": "削除",
  "detail.delete.confirm": "このレシピを削除しますか？この操作は取り消せません。",
  "detail.delete.yes": "削除",
  "detail.delete.no": "キャンセル",
  "detail.star": "お気に入りに追加",
  "detail.unstar": "お気に入りから削除",
  "detail.share": "レシピを共有",
  "detail.print": "印刷 / PDF",
  "detail.source": "出典",
  "detail.notes": "メモ",

  // ─── Cooking Mode ─────────────────────────────────────────────────────────
  "cooking.modal.title": "調理を始める",
  "cooking.modal.question": "今日は何人分作りますか？",
  "cooking.modal.start": "スタート →",
  "cooking.modal.cancel": "キャンセル",
  "cooking.progress": "ステップ {{current}} / {{total}}",
  "cooking.next": "次のステップ",
  "cooking.prev": "前のステップ",
  "cooking.finish": "完成！",
  "cooking.done.title": "いただきます！",
  "cooking.done.subtitle": "レシピ完成。最近の調理に保存されました。",
  "cooking.done.close": "閉じる",
  "cooking.timer.start": "タイマー開始 {{label}}",
  "cooking.timer.running": "残り{{time}}",
  "cooking.timer.finished": "時間終了！",
  "cooking.timer.stop": "停止",
  "cooking.timer.reset": "リセット",

  // ─── Units ────────────────────────────────────────────────────────────────
  "unit.ml": "ml",
  "unit.g": "g",
  "unit.none": "",
  "unit.to_taste": "適量",

  // ─── Planner ──────────────────────────────────────────────────────────────
  "planner.title": "献立",
  "planner.today": "今日の献立…",
  "planner.add": "献立に追加",
  "planner.empty": "今日の献立がありません",
  "planner.remove": "削除",

  // ─── Export / Import ──────────────────────────────────────────────────────
  "export.book": "レシピ帳をエクスポート (JSON)",
  "export.recipe": "レシピをエクスポート (JSON)",
  "export.success": "ファイルをエクスポートしました",
  "import.button": "レシピ帳をインポート (JSON)",
  "import.success": "インポート完了：{{count}}件追加",
  "import.error": "無効なファイル",
  "import.drag": "recipes.jsonをドラッグ",

  // ─── Settings ─────────────────────────────────────────────────────────────
  "settings.title": "設定",
  "settings.language": "言語",
  "settings.darkMode": "ダークモード",
  "settings.darkMode.on": "オン",
  "settings.darkMode.off": "オフ",
  "settings.defaultServings": "デフォルト人数",
  "settings.clearData": "すべてのデータを削除",
  "settings.clearData.confirm": "注意：すべてのレシピが削除されます。続けますか？",
  "settings.version": "バージョン",

  // ─── Errors ───────────────────────────────────────────────────────────────
  "error.generic": "エラーが発生しました",
  "error.notFound": "レシピが見つかりません",
  "error.db": "データベースエラー",
  "error.parse.empty": "解析するコンテンツがありません",
  "error.parse.noIngredients": "材料が見つかりませんでした",
  "error.parse.noSteps": "作り方が見つかりませんでした",
  "error.save": "保存エラー",

  // ─── Misc ─────────────────────────────────────────────────────────────────
  "misc.loading": "読み込み中…",
  "misc.saving": "保存中…",
  "misc.saved": "保存しました",
  "misc.cancel": "キャンセル",
  "misc.confirm": "確認",
  "misc.close": "閉じる",
  "misc.edit": "編集",
  "misc.delete": "削除",
  "misc.back": "戻る",
  "misc.yes": "はい",
  "misc.no": "いいえ",
  "misc.minutes_one": "{{count}}分",
  "misc.minutes_other": "{{count}}分",
  "misc.hours_one": "{{count}}時間",
  "misc.hours_other": "{{count}}時間",
  "misc.and": "と",
  "misc.unknown": "—",

  // ─── PWA ──────────────────────────────────────────────────────────────────
  "pwa.updateAvailable": "アップデートがあります",
  "pwa.updateNow": "更新",
  "pwa.installPrompt": "アプリをインストール",
};

export default ja;
