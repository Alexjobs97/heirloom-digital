/**
 * App.tsx v5 — Bottom navigation + slim header + cloud sync.
 */

import { HashRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { LangProvider, useLang } from "./i18n/LangContext";
import { useTranslation } from "./i18n/useTranslation";
import { unlockAudio } from "./lib/audio";
import { useRecipes } from "./hooks/useRecipes";
import { useCloudSync } from "./hooks/useCloudSync";
import type { SyncStatus } from "./types";

import HomePage          from "./pages/HomePage";
import AddRecipePage     from "./pages/AddRecipePage";
import RecipeDetailPage  from "./pages/RecipeDetailPage";
import CookingModePage   from "./pages/CookingModePage";
import ShoppingListPage  from "./pages/ShoppingListPage";
import EditRecipePage    from "./pages/EditRecipePage";

// ─── SVG icons ────────────────────────────────────────────────────────────────

const IconBook     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IconPlus     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="22" height="22"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconCart     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IconMoon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconSun      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IconCloudOk  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><polyline points="9 12 11 14 15 10" strokeWidth="2.5"/></svg>;
const IconCloudErr = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><line x1="12" y1="13" x2="12" y2="16"/><circle cx="12" cy="18" r="0.5" fill="currentColor"/></svg>;
const IconCloud    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>;

// ─── Sync helpers ─────────────────────────────────────────────────────────────

const LS_SYNC_ID = "heirloom_sync_id";
function getOrCreateSyncId(): string {
  try {
    let id = localStorage.getItem(LS_SYNC_ID);
    if (!id) {
      id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      localStorage.setItem(LS_SYNC_ID, id);
    }
    return id;
  } catch { return "local"; }
}
function saveSyncId(id: string) { try { localStorage.setItem(LS_SYNC_ID, id); } catch {} }
function syncColor(s: SyncStatus) { return s === "synced" ? "#4a7039" : s === "error" ? "#C62828" : s === "syncing" ? "var(--brand)" : "var(--text-muted)"; }
function isUUID(s: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s.trim()); }

// ─── Sync indicator ───────────────────────────────────────────────────────────

function SyncIndicator({ status, lastSync, syncId, isEnabled, syncNow, errorMessage, onChangeSyncId }: {
  status: SyncStatus; lastSync: string | null; syncId: string; isEnabled: boolean;
  syncNow: () => Promise<void>; errorMessage: string | null; onChangeSyncId: (id: string) => void;
}) {
  const [show, setShow]       = useState(false);
  const [copied, setCopied]   = useState(false);
  const [paste, setPaste]     = useState(false);
  const [pVal, setPVal]       = useState("");
  const [pErr, setPErr]       = useState("");
  const pRef = useRef<HTMLInputElement>(null);

  const copyId = async () => { try { await navigator.clipboard.writeText(syncId); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} };
  const apply  = () => {
    const v = pVal.trim();
    if (!v) { setPErr("ID vuoto"); return; }
    if (!isUUID(v)) { setPErr("Formato non valido"); return; }
    if (v === syncId) { setPErr("È già il tuo ID"); return; }
    onChangeSyncId(v); setPaste(false); setPVal(""); setPErr(""); setShow(false);
  };

  if (!isEnabled) return null;
  const fmtLast = lastSync ? new Date(lastSync).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : null;
  const Icon = status === "synced" ? IconCloudOk : status === "error" ? IconCloudErr : IconCloud;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => { setShow((v) => !v); if (!show) { setPaste(false); setPVal(""); setPErr(""); } }}
        style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", color: syncColor(status), padding: "0.28rem 0.5rem", display: "flex", alignItems: "center", gap: "0.3rem", transition: "all 0.15s", animation: status === "syncing" ? "pulse 1s ease infinite" : "none" }}>
        <Icon />
        {status === "synced" && fmtLast && <span style={{ fontSize: "0.63rem", fontWeight: 700 }}>{fmtLast}</span>}
        {status === "syncing" && <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>…</span>}
      </button>

      {show && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 48 }} onClick={() => setShow(false)} />
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-modal)", padding: "1rem 1.1rem", width: 280, zIndex: 49, display: "flex", flexDirection: "column", gap: "0.7rem", animation: "slideDown 0.15s ease-out" }}>
            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>☁️ Cloud Sync</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Stato:</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)", background: status === "synced" ? "#f0f4ed" : status === "error" ? "#fef2f2" : "var(--brand-light)", color: syncColor(status) }}>
                {status === "synced" ? "✓ Sincronizzato" : status === "error" ? "✗ Errore" : status === "syncing" ? "⟳ In corso" : "In attesa"}
              </span>
            </div>
            {lastSync && <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Ultimo:</span><span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{new Date(lastSync).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span></div>}
            {errorMessage && <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--error)", background: "var(--error-bg)", padding: "0.35rem 0.5rem", borderRadius: 6 }}>{errorMessage}</p>}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.7rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)" }}>Il tuo Sync ID</p>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                <code style={{ flex: 1, fontSize: "0.63rem", padding: "0.3rem 0.5rem", background: "var(--bg-page)", borderRadius: 6, border: "1px solid var(--border)", color: "var(--text-secondary)", wordBreak: "break-all", lineHeight: 1.5 }}>{syncId}</code>
                <button onClick={copyId} style={{ background: "var(--brand-light)", border: "none", borderRadius: 6, cursor: "pointer", padding: "0.3rem 0.5rem", color: "var(--brand-dark)", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 }}>{copied ? "✓" : "Copia"}</button>
              </div>
              {!paste
                ? <button onClick={() => { setPaste(true); setTimeout(() => pRef.current?.focus(), 50); }} style={{ background: "transparent", border: "1.5px dashed var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", padding: "0.4rem 0.7rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", textAlign: "left" }}>📋 Usa ID di un altro dispositivo…</button>
                : <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-muted)" }}>Incolla il Sync ID:</p>
                    <input ref={pRef} type="text" value={pVal} onChange={(e) => { setPVal(e.target.value); setPErr(""); }} onKeyDown={(e) => { if (e.key === "Enter") apply(); if (e.key === "Escape") { setPaste(false); setPVal(""); } }} placeholder="xxxxxxxx-xxxx-4xxx-…" style={{ padding: "0.4rem 0.6rem", border: `1.5px solid ${pErr ? "var(--error)" : "var(--border-focus)"}`, borderRadius: "var(--radius-md)", fontSize: "0.75rem", fontFamily: "monospace", background: "var(--bg-input)", color: "var(--text-primary)", outline: "none", width: "100%" }} />
                    {pErr && <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--error)" }}>{pErr}</p>}
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                      <button onClick={() => { setPaste(false); setPVal(""); setPErr(""); }} style={{ flex: 1, background: "var(--bg-page)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "0.4rem", fontSize: "0.78rem", cursor: "pointer", color: "var(--text-secondary)", fontWeight: 700 }}>Annulla</button>
                      <button onClick={apply} style={{ flex: 2, background: "var(--brand)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", padding: "0.4rem", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>Usa e sincronizza</button>
                    </div>
                  </div>
              }
            </div>
            <button onClick={async () => { await syncNow(); setShow(false); }} disabled={status === "syncing"} style={{ background: "var(--brand)", color: "var(--brand-text)", border: "none", borderRadius: "var(--radius-md)", padding: "0.5rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", opacity: status === "syncing" ? 0.6 : 1 }}>
              {status === "syncing" ? "Sincronizzazione…" : "⟳ Sincronizza ora"}
            </button>
          </div>
        </>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
    </div>
  );
}

// ─── Header (slim: logo + utility) ───────────────────────────────────────────

function Header({ dark, onToggleDark, syncProps }: { dark: boolean; onToggleDark: () => void; syncProps: React.ComponentProps<typeof SyncIndicator> }) {
  const { lang, toggleLang } = useLang();
  const location = useLocation();
  if (location.pathname.startsWith("/cucina/")) return null;
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, paddingTop: "env(safe-area-inset-top)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1rem", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "-0.01em" }}>Heirloom</span>
          <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 2 }}>Digital</span>
        </NavLink>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <SyncIndicator {...syncProps} />
          <button onClick={toggleLang} style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-secondary)", padding: "0.28rem 0.55rem", fontSize: "0.72rem", fontWeight: 700, transition: "all 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}>
            {lang === "it" ? "🇯🇵 JP" : "🇮🇹 IT"}
          </button>
          <button onClick={onToggleDark} aria-label="Toggle dark mode" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", padding: "0.4rem", borderRadius: "var(--radius-md)", transition: "color 0.15s" }}>
            {dark ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav() {
  const { t, locale } = useTranslation();
  const location = useLocation();
  if (location.pathname.startsWith("/cucina/")) return null;

  const items = [
    { to: "/",         label: locale === "ja" ? "レシピ" : "Ricette",  Icon: IconBook  },
    { to: "/aggiungi", label: locale === "ja" ? "追加" : "Aggiungi",   Icon: IconPlus  },
    { to: "/lista",    label: locale === "ja" ? "買い物" : "Lista",    Icon: IconCart  },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, Icon }) => {
        const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
        return (
          <NavLink key={to} to={to} end={to === "/"} className={`bottom-nav-item${isActive ? " active" : ""}`}>
            <span className="nav-icon"><Icon /></span>
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

// ─── 404 ─────────────────────────────────────────────────────────────────────

function NotFound() {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
      <p style={{ fontSize: "3rem" }}>🍽️</p>
      <h2 style={{ color: "var(--text-primary)" }}>{t("error.notFound")}</h2>
      <NavLink to="/" style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.65rem 1.5rem", background: "var(--brand)", color: "var(--brand-text)", borderRadius: "var(--radius-md)", fontWeight: 700, textDecoration: "none" }}>
        {t("misc.back")}
      </NavLink>
    </div>
  );
}

// ─── AppShell ─────────────────────────────────────────────────────────────────

function AppShell() {
  const [dark, setDark] = useState(() => !document.documentElement.classList.contains("light"));
  const [syncId, setSyncId] = useState<string>(getOrCreateSyncId);

  const toggleDark = useCallback(() => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle("light", !next);
    try { localStorage.setItem("heirloom_dark", String(next)); } catch {}
  }, [dark]);

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  const { allRecipes, mergeFromCloud } = useRecipes();
  const allRef = useRef(allRecipes);
  allRef.current = allRecipes;

  const handleChangeSyncId = useCallback((newId: string) => {
    saveSyncId(newId); setSyncId(newId);
    try { localStorage.removeItem("heirloom_last_sync"); localStorage.removeItem("heirloom_remote_updated"); } catch {}
  }, []);

  const syncProps = useCloudSync(allRecipes, {
    onMerge: mergeFromCloud,
    getLocalRecipes: () => allRef.current,
    syncId,
  });

  return (
    <>
      <Header dark={dark} onToggleDark={toggleDark} syncProps={{ ...syncProps, onChangeSyncId: handleChangeSyncId }} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/"                     element={<HomePage />} />
          <Route path="/aggiungi"             element={<AddRecipePage />} />
          <Route path="/ricette/:id"          element={<RecipeDetailPage />} />
          <Route path="/ricette/:id/modifica" element={<EditRecipePage />} />
          <Route path="/cucina/:id"           element={<CookingModePage />} />
          <Route path="/lista"                element={<ShoppingListPage />} />
          <Route path="*"                     element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </LangProvider>
  );
}
