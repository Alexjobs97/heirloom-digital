const it = {
  // ─── App ───────────────────────────────────────────────────────────────────
  "app.name": "The Heirloom Digital",
  "app.tagline": "Il tuo libro di ricette di famiglia, digitale.",

  // ─── Nav ───────────────────────────────────────────────────────────────────
  "nav.home": "Ricette",
  "nav.add": "Aggiungi ricetta",
  "nav.planner": "Pianificatore",
  "nav.settings": "Impostazioni",

  // ─── Home ──────────────────────────────────────────────────────────────────
  "home.empty.title": "Il tuo libro è ancora vuoto",
  "home.empty.subtitle": "Aggiungi la tua prima ricetta incollando il testo",
  "home.empty.cta": "Aggiungi ricetta",
  "home.import.drop": "Trascina qui un file recipes.json per importare",
  "home.import.success": "Importazione completata",
  "home.import.error": "Errore durante l'importazione",
  "home.recipes.count_one": "{{count}} ricetta",
  "home.recipes.count_other": "{{count}} ricette",

  // ─── Search & Filter ───────────────────────────────────────────────────────
  "search.placeholder": "Cerca per nome, ingrediente o tag…",
  "search.noResults": "Nessuna ricetta trovata",
  "search.noResults.hint": "Prova con un termine diverso",
  "filter.all": "Tutte",
  "filter.starred": "Preferite",
  "filter.recent": "Cucinate di recente",
  "filter.quick": "Veloci (< 30 min)",
  "filter.tags": "Per tag",

  // ─── Recipe Card ───────────────────────────────────────────────────────────
  "card.servings_one": "{{count}} porzione",
  "card.servings_other": "{{count}} porzioni",
  "card.time": "{{min}} min",
  "card.time.unknown": "Tempo n.d.",
  "card.lastCooked": "Ultima volta: {{date}}",
  "card.neverCooked": "Mai cucinata",

  // ─── Add Recipe ────────────────────────────────────────────────────────────
  "add.title": "Aggiungi una ricetta",
  "add.paste.label": "Incolla qui la tua ricetta (qualsiasi formato)",
  "add.paste.placeholder":
    "Incolla il testo della ricetta qui…\n\nFunziona con qualsiasi formato: siti di cucina, blog, ricette americane con tazze e once, testo libero. Pensiamo noi a convertire tutto.",
  "add.paste.analyze": "Analizza ricetta",
  "add.paste.analyzing": "Analisi in corso…",
  "add.paste.clear": "Cancella",
  "add.paste.empty": "Incolla prima il testo della ricetta",

  // ─── Parse Review ──────────────────────────────────────────────────────────
  "review.title": "Verifica e modifica",
  "review.subtitle":
    "Controlla che il parser abbia capito tutto correttamente. Puoi modificare ogni campo prima di salvare.",
  "review.original": "Testo originale",
  "review.edited": "Ricetta modificata",
  "review.save": "Salva nel libro",
  "review.saving": "Salvataggio…",
  "review.back": "← Torna indietro",
  "review.warnings.title": "Attenzione",
  "review.field.title": "Titolo",
  "review.field.yield": "Porzioni",
  "review.field.totalTime": "Tempo totale (min)",
  "review.field.ingredients": "Ingredienti",
  "review.field.steps": "Procedimento",
  "review.field.tags": "Tag (separati da virgola)",
  "review.ingredient.qty": "Qtà",
  "review.ingredient.unit": "Unità",
  "review.ingredient.name": "Ingrediente",
  "review.ingredient.add": "Aggiungi ingrediente",
  "review.ingredient.remove": "Rimuovi",
  "review.step.add": "Aggiungi passo",
  "review.step.remove": "Rimuovi",
  "review.ambiguous.hint":
    "Questo solido è dato in volume (ml). Verifica che la quantità sia corretta.",

  // ─── Recipe Detail ─────────────────────────────────────────────────────────
  "detail.servings": "Porzioni",
  "detail.servings.label": "Per quante persone?",
  "detail.time.total": "Tempo totale",
  "detail.time.prep": "Preparazione",
  "detail.time.cook": "Cottura",
  "detail.ingredients": "Ingredienti",
  "detail.ingredients.checkAll": "Seleziona tutti",
  "detail.ingredients.uncheckAll": "Deseleziona tutti",
  "detail.steps": "Procedimento",
  "detail.cook": "Inizia a cucinare",
  "detail.edit": "Modifica ricetta",
  "detail.delete": "Elimina",
  "detail.delete.confirm": "Sei sicuro di voler eliminare questa ricetta?",
  "detail.delete.yes": "Elimina",
  "detail.delete.no": "Annulla",
  "detail.star": "Aggiungi ai preferiti",
  "detail.unstar": "Rimuovi dai preferiti",
  "detail.share": "Esporta ricetta",
  "detail.print": "Stampa / PDF",
  "detail.source": "Fonte",
  "detail.notes": "Note",

  // ─── Cooking Mode ──────────────────────────────────────────────────────────
  "cooking.modal.title": "Inizia a cucinare",
  "cooking.modal.question": "Per quante persone cucini oggi?",
  "cooking.modal.start": "Inizia",
  "cooking.modal.cancel": "Annulla",
  "cooking.progress": "Passo {{current}} di {{total}}",
  "cooking.next": "Passo successivo",
  "cooking.prev": "Passo precedente",
  "cooking.finish": "Fatto!",
  "cooking.done.title": "Buon appetito!",
  "cooking.done.subtitle": "Ricetta completata. Salvata nelle recenti.",
  "cooking.done.close": "Chiudi",
  "cooking.timer.start": "Avvia timer {{label}}",
  "cooking.timer.running": "{{time}} rimasti",
  "cooking.timer.finished": "Tempo scaduto!",
  "cooking.timer.stop": "Ferma",
  "cooking.timer.reset": "Ricomincia",

  // ─── Units ─────────────────────────────────────────────────────────────────
  "unit.ml": "ml",
  "unit.g": "g",
  "unit.none": "",
  "unit.to_taste": "q.b.",

  // ─── Planner ───────────────────────────────────────────────────────────────
  "planner.title": "Pianificatore",
  "planner.today": "Oggi cucino…",
  "planner.add": "Aggiungi al piano",
  "planner.empty": "Nessuna ricetta pianificata per oggi",
  "planner.remove": "Rimuovi",

  // ─── Export / Import ───────────────────────────────────────────────────────
  "export.book": "Esporta libro (JSON)",
  "export.recipe": "Esporta ricetta (JSON)",
  "export.success": "File esportato",
  "import.button": "Importa libro (JSON)",
  "import.success": "Importazione completata: {{count}} ricette aggiunte",
  "import.error": "File non valido",
  "import.drag": "Trascina un file recipes.json",

  // ─── Settings ──────────────────────────────────────────────────────────────
  "settings.title": "Impostazioni",
  "settings.language": "Lingua interfaccia",
  "settings.darkMode": "Modalità scura",
  "settings.darkMode.on": "Attiva",
  "settings.darkMode.off": "Disattiva",
  "settings.defaultServings": "Porzioni predefinite",
  "settings.clearData": "Cancella tutti i dati",
  "settings.clearData.confirm":
    "Attenzione: questa azione cancellerà tutte le ricette. Continui?",
  "settings.version": "Versione",

  // ─── Errors ────────────────────────────────────────────────────────────────
  "error.generic": "Qualcosa è andato storto",
  "error.notFound": "Ricetta non trovata",
  "error.db": "Errore di accesso al database",
  "error.parse.empty": "Nessun contenuto da analizzare",
  "error.parse.noIngredients": "Non ho trovato ingredienti nel testo",
  "error.parse.noSteps": "Non ho trovato il procedimento nel testo",
  "error.save": "Errore durante il salvataggio",

  // ─── Misc ──────────────────────────────────────────────────────────────────
  "misc.loading": "Caricamento…",
  "misc.saving": "Salvataggio…",
  "misc.saved": "Salvato",
  "misc.cancel": "Annulla",
  "misc.confirm": "Conferma",
  "misc.close": "Chiudi",
  "misc.edit": "Modifica",
  "misc.delete": "Elimina",
  "misc.back": "Indietro",
  "misc.yes": "Sì",
  "misc.no": "No",
  "misc.minutes_one": "{{count}} minuto",
  "misc.minutes_other": "{{count}} minuti",
  "misc.hours_one": "{{count}} ora",
  "misc.hours_other": "{{count}} ore",
  "misc.and": "e",
  "misc.unknown": "—",

  // ─── PWA ───────────────────────────────────────────────────────────────────
  "pwa.updateAvailable": "È disponibile un aggiornamento",
  "pwa.updateNow": "Aggiorna",
  "pwa.installPrompt": "Installa l'app",
} as const;

export type TranslationKey = keyof typeof it;
export default it;
