// Japanese translations — 日本語翻訳
import it from "./it";

const ja = { ...it } as typeof it;

// App
ja["app.name"] = "ヘアルーム デジタル";
ja["app.tagline"] = "あなたの家族のレシピブック、デジタル版。";

// Nav
ja["nav.home"] = "レシピ";
ja["nav.add"] = "レシピを追加";
ja["nav.planner"] = "プランナー";
ja["nav.settings"] = "設定";

// Home
ja["home.empty.title"] = "レシピブックが空です";
ja["home.empty.subtitle"] = "テキストを貼り付けて最初のレシピを追加しましょう";
ja["home.empty.cta"] = "レシピを追加";
ja["home.import.drop"] = "recipes.json ファイルをここにドラッグしてインポート";
ja["home.import.success"] = "インポート完了";
ja["home.import.error"] = "インポートエラー";
ja["home.recipes.count_other"] = "{{count}} 件のレシピ";

// Search & Filter
ja["search.placeholder"] = "名前、材料、タグで検索…";
ja["search.noResults"] = "レシピが見つかりません";
ja["search.noResults.hint"] = "別のキーワードをお試しください";
ja["filter.all"] = "すべて";
ja["filter.starred"] = "お気に入り";
ja["filter.recent"] = "最近作った";
ja["filter.quick"] = "簡単（30 分以内）";
ja["filter.tags"] = "タグ別";

// Recipe Card
ja["card.servings_other"] = "{{count}} 人前";
ja["card.time"] = "{{min}} 分";
ja["card.time.unknown"] = "時間不明";
ja["card.lastCooked"] = "最後に作った日：{{date}}";
ja["card.neverCooked"] = "まだ作っていません";

// Add Recipe
ja["add.title"] = "レシピを追加";
ja["add.paste.label"] = "ここにレシピを貼り付け（任意の形式）";
ja["add.paste.placeholder"] = "レシピのテキストをここに貼り付け…\n\nあらゆる形式に対応：料理サイト、ブログ、自由なテキスト。すべて自動的に変換します。";
ja["add.paste.analyze"] = "レシピを分析";
ja["add.paste.analyzing"] = "分析中…";
ja["add.paste.clear"] = "クリア";
ja["add.paste.empty"] = "まずレシピのテキストを貼り付けてください";

// Parse Review
ja["review.title"] = "確認と編集";
ja["review.subtitle"] = "パーサーが正しく理解したか確認してください。保存前にすべてのフィールドを編集できます。";
ja["review.original"] = "元のテキスト";
ja["review.edited"] = "編集済みレシピ";
ja["review.save"] = "ブックに保存";
ja["review.saving"] = "保存中…";
ja["review.back"] = "← 戻る";
ja["review.warnings.title"] = "注意";
ja["review.field.title"] = "タイトル";
ja["review.field.yield"] = "人数";
ja["review.field.totalTime"] = "総時間（分）";
ja["review.field.ingredients"] = "材料";
ja["review.field.steps"] = "手順";
ja["review.field.tags"] = "タグ（カンマ区切り）";
ja["review.ingredient.qty"] = "量";
ja["review.ingredient.unit"] = "単位";
ja["review.ingredient.name"] = "材料名";
ja["review.ingredient.add"] = "材料を追加";
ja["review.ingredient.remove"] = "削除";
ja["review.step.add"] = "手順を追加";
ja["review.step.remove"] = "削除";
ja["review.ambiguous.hint"] = "この固体は容量（ml）で表示されています。量が正しいか確認してください。";

// Recipe Detail
ja["detail.servings"] = "人数";
ja["detail.servings.label"] = "何人前ですか？";
ja["detail.time.total"] = "総時間";
ja["detail.time.prep"] = "準備";
ja["detail.time.cook"] = "調理";
ja["detail.ingredients"] = "材料";
ja["detail.ingredients.checkAll"] = "すべて選択";
ja["detail.ingredients.uncheckAll"] = "すべて解除";
ja["detail.steps"] = "手順";
ja["detail.cook"] = "調理開始";
ja["detail.edit"] = "レシピを編集";
ja["detail.delete"] = "削除";
ja["detail.delete.confirm"] = "このレシピを削除してもよろしいですか？";
ja["detail.delete.yes"] = "削除";
ja["detail.delete.no"] = "キャンセル";
ja["detail.star"] = "お気に入りに追加";
ja["detail.unstar"] = "お気に入りから削除";
ja["detail.share"] = "レシピをエクスポート";
ja["detail.print"] = "印刷 / PDF";
ja["detail.source"] = "出典";
ja["detail.notes"] = "メモ";

// Cooking Mode
ja["cooking.modal.title"] = "調理開始";
ja["cooking.modal.question"] = "今日は何人前作りますか？";
ja["cooking.modal.start"] = "開始";
ja["cooking.modal.cancel"] = "キャンセル";
ja["cooking.progress"] = "ステップ {{current}} / {{total}}";
ja["cooking.next"] = "次のステップ";
ja["cooking.prev"] = "前のステップ";
ja["cooking.finish"] = "完了！";
ja["cooking.done.title"] = "召し上がれ！";
ja["cooking.done.subtitle"] = "レシピ完了。最近作ったレシピに保存しました。";
ja["cooking.done.close"] = "閉じる";
ja["cooking.timer.start"] = "タイマー開始 {{label}}";
ja["cooking.timer.running"] = "残り{{time}}";
ja["cooking.timer.finished"] = "時間になりました！";
ja["cooking.timer.stop"] = "停止";
ja["cooking.timer.reset"] = "リセット";

// Units
ja["unit.ml"] = "ml";
ja["unit.g"] = "g";
ja["unit.none"] = "";
ja["unit.to_taste"] = "適量";

// Planner
ja["planner.title"] = "プランナー";
ja["planner.today"] = "今日のメニュー…";
ja["planner.add"] = "プランに追加";
ja["planner.empty"] = "今日のレシピはありません";
ja["planner.remove"] = "削除";

// Export / Import
ja["export.book"] = "ブックをエクスポート（JSON）";
ja["export.recipe"] = "レシピをエクスポート（JSON）";
ja["export.text"] = "クリップボードにコピー（テキスト）";
ja["export.success"] = "ファイルをエクスポートしました";
ja["import.button"] = "ブックをインポート（JSON）";
ja["import.fromUrl"] = "URL からインポート";
ja["import.success"] = "インポート完了：{{count}} 件のレシピを追加";
ja["import.error"] = "無効なファイル";
ja["import.drag"] = "recipes.json をドラッグ";
ja["import.url.placeholder"] = "レシピの URL を貼り付け…";
ja["import.url.fetching"] = "取得中…";
ja["import.url.error"] = "URL の取得に失敗しました";

// Settings
ja["settings.title"] = "設定";
ja["settings.language"] = "表示言語";
ja["settings.darkMode"] = "ダークモード";
ja["settings.darkMode.on"] = "オン";
ja["settings.darkMode.off"] = "オフ";
ja["settings.defaultServings"] = "デフォルトの人数";
ja["settings.clearData"] = "すべてのデータを消去";
ja["settings.clearData.confirm"] = "警告：この操作ですべてのレシピが削除されます。続行しますか？";
ja["settings.version"] = "バージョン";

// Errors
ja["error.generic"] = "問題が発生しました";
ja["error.notFound"] = "レシピが見つかりません";
ja["error.db"] = "データベースアクセスエラー";
ja["error.parse.empty"] = "分析するコンテンツがありません";
ja["error.parse.noIngredients"] = "テキストに材料が見つかりませんでした";
ja["error.parse.noSteps"] = "テキストに手順が見つかりませんでした";
ja["error.save"] = "保存エラー";

// Misc
ja["misc.loading"] = "読込中…";
ja["misc.saving"] = "保存中…";
ja["misc.saved"] = "保存完了";
ja["misc.cancel"] = "キャンセル";
ja["misc.confirm"] = "確認";
ja["misc.close"] = "閉じる";
ja["misc.edit"] = "編集";
ja["misc.delete"] = "削除";
ja["misc.back"] = "戻る";
ja["misc.yes"] = "はい";
ja["misc.no"] = "いいえ";
ja["misc.minutes_other"] = "{{count}} 分";
ja["misc.hours_other"] = "{{count}} 時間";
ja["misc.and"] = "と";
ja["misc.unknown"] = "—";

// PWA
ja["pwa.updateAvailable"] = "アップデートが利用可能です";
ja["pwa.updateNow"] = "今すぐ更新";
ja["pwa.installPrompt"] = "アプリをインストール";

// New keys for features
ja["action.copyToClipboard"] = "クリップボードにコピー";
ja["action.copied"] = "コピーしました！";
ja["action.uploadImage"] = "画像をアップロード";
ja["action.removeImage"] = "画像を削除";
ja["action.importFromUrl"] = "URL からインポート";
ja["label.imageUrl"] = "画像 URL";
ja["label.coverImage"] = "表紙画像";
ja["placeholder.imageUrl"] = "画像の URL を貼り付け…";
ja["confirm.deleteImage"] = "この画像を削除してもよろしいですか？";
ja["error.imageLoad"] = "画像の読み込みに失敗しました";
ja["error.invalidUrl"] = "無効な URL です";
ja["share.recipeText"] = "レシピ：{{title}}\n\n材料:\n{{ingredients}}\n\n手順:\n{{steps}}\n\n{{app}} より";

export default ja;
