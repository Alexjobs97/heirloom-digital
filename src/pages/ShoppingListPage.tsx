/**
 * ShoppingListPage.tsx — Lista della spesa con aggregazione, sync e swipe-to-delete.
 */

import { useState, useRef, useCallback } from "react";
import { useShoppingList } from "../hooks/useShoppingList";
import { useTranslation } from "../i18n/useTranslation";

function IconTrash() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function IconCopy()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>; }
function IconPlus()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }

// ── Swipe-to-delete row ───────────────────────────────────────────────────────

function ShoppingRow({ item, onToggle, onRemove }: {
  item: import("../types").ShoppingListItem;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const startX = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const THRESHOLD = 80;

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) { setSwiping(true); setOffset(Math.max(dx, -140)); }
  };
  const onTouchEnd = () => {
    if (offset < -THRESHOLD) { onRemove(); }
    else { setOffset(0); setSwiping(false); }
    startX.current = null;
  };

  const qtyLabel = item.qty > 0 ? `${item.qty}${item.unit ? " " + item.unit : ""}` : "";

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius-md)", marginBottom: 6 }}>
      {/* Background rossa */}
      <div style={{ position: "absolute", inset: 0, background: "var(--error)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "1.25rem", color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>
        <IconTrash />
      </div>
      {/* Contenuto */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "0.75rem 1rem",
          display: "flex", alignItems: "center", gap: "0.75rem",
          transform: `translateX(${offset}px)`,
          transition: swiping ? "none" : "transform 0.25s ease",
          cursor: "pointer",
        }}
      >
        <input type="checkbox" className="ingredient-checkbox" checked={item.checked} onChange={onToggle} onClick={(e) => e.stopPropagation()} />
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: "0.9375rem", color: item.checked ? "var(--text-muted)" : "var(--text-primary)",
            textDecoration: item.checked ? "line-through" : "none",
            fontWeight: item.checked ? 400 : 600,
            transition: "all 0.2s",
          }}>
            {qtyLabel && <span style={{ color: "var(--brand)", fontWeight: 700, marginRight: "0.4rem", fontFamily: "var(--font-serif)" }}>{qtyLabel}</span>}
            {item.displayName}
          </span>
          {item.addedFrom && !item.isManual && (
            <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-muted)" }}>da {item.addedFrom}</p>
          )}
        </div>
        {/* Tasto rimuovi desktop */}
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem", display: "flex", opacity: 0.6, transition: "opacity 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

// ── Pagina ────────────────────────────────────────────────────────────────────

export default function ShoppingListPage() {
  const { t, locale } = useTranslation();
  const { items, checkedCount, totalCount, addManual, toggleItem, removeItem, clearAll, clearChecked, copyToClipboard } = useShoppingList();
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showClearMenu, setShowClearMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = useCallback(() => {
    const v = input.trim();
    if (!v) return;
    addManual(v);
    setInput("");
    inputRef.current?.focus();
  }, [input, addManual]);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard();
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }, [copyToClipboard]);

  const unchecked = items.filter((i) => !i.checked);
  const checked   = items.filter((i) => i.checked);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.25rem 1rem 2rem" }}>

      {/* ── Intestazione ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>{locale === "ja" ? "お買い物リスト" : "Lista della spesa"}</h1>
          {totalCount > 0 && (
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {checkedCount}/{totalCount} {locale === "ja" ? "完了" : "completati"}
            </p>
          )}
        </div>

        {totalCount > 0 && (
          <div style={{ display: "flex", gap: "0.4rem", position: "relative" }}>
            <button className="btn btn-ghost" onClick={handleCopy} style={{ padding: "0.45rem 0.75rem", gap: "0.35rem", fontSize: "0.82rem" }}>
              <IconCopy /> {copied ? "✓ Copiato!" : (locale === "ja" ? "コピー" : "Copia")}
            </button>
            <button className="btn btn-ghost" onClick={() => setShowClearMenu((v) => !v)}
              style={{ padding: "0.45rem 0.75rem", fontSize: "0.82rem", color: "var(--error)" }}>
              {locale === "ja" ? "削除" : "Svuota"}
            </button>
            {showClearMenu && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowClearMenu(false)} />
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-modal)", padding: "0.5rem", zIndex: 11, minWidth: 180, animation: "slideDown 0.15s ease-out" }}>
                  {checkedCount > 0 && (
                    <button onClick={() => { clearChecked(); setShowClearMenu(false); }}
                      style={{ width: "100%", textAlign: "left", padding: "0.55rem 0.75rem", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", color: "var(--text-secondary)", borderRadius: 8, display: "block" }}>
                      ✓ {locale === "ja" ? "チェック済みを削除" : "Rimuovi spuntati"} ({checkedCount})
                    </button>
                  )}
                  <button onClick={() => { clearAll(); setShowClearMenu(false); }}
                    style={{ width: "100%", textAlign: "left", padding: "0.55rem 0.75rem", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", color: "var(--error)", borderRadius: 8, display: "block" }}>
                    🗑 {locale === "ja" ? "すべて削除" : "Svuota tutto"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Input aggiunta manuale ───────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.75rem" }}>
        <input
          ref={inputRef}
          type="text"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={locale === "ja" ? "食材を追加…" : "Aggiungi un ingrediente…"}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={handleAdd} disabled={!input.trim()} style={{ gap: "0.35rem", padding: "0.6rem 1rem" }}>
          <IconPlus /> {locale === "ja" ? "追加" : "Aggiungi"}
        </button>
      </div>

      {/* ── Lista vuota ─────────────────────────────────────────────────── */}
      {totalCount === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛒</div>
          <h3 style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            {locale === "ja" ? "リストが空です" : "Lista vuota"}
          </h3>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 300, margin: "0 auto" }}>
            {locale === "ja"
              ? "レシピのページから食材を追加するか、上のフィールドに手動で入力してください"
              : "Aggiungi ingredienti da una ricetta oppure digitali qui sopra"}
          </p>
        </div>
      )}

      {/* ── Da fare ──────────────────────────────────────────────────────── */}
      {unchecked.length > 0 && (
        <section style={{ marginBottom: "1.5rem" }}>
          <p style={{ margin: "0 0 0.625rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {locale === "ja" ? "未購入" : "Da comprare"} · {unchecked.length}
          </p>
          {unchecked.map((item) => (
            <ShoppingRow key={item.id} item={item} onToggle={() => toggleItem(item.id)} onRemove={() => removeItem(item.id)} />
          ))}
        </section>
      )}

      {/* ── Completati ───────────────────────────────────────────────────── */}
      {checked.length > 0 && (
        <section>
          <p style={{ margin: "0 0 0.625rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {locale === "ja" ? "購入済み" : "Nel carrello"} · {checked.length}
          </p>
          {checked.map((item) => (
            <ShoppingRow key={item.id} item={item} onToggle={() => toggleItem(item.id)} onRemove={() => removeItem(item.id)} />
          ))}
        </section>
      )}
    </div>
  );
}
