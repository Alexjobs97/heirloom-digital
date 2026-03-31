/**
 * App.tsx v3 — Cloud sync Supabase + indicatore nell'header.
 */

import { HashRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { LangProvider, useLang } from "./i18n/LangContext";
import { useTranslation } from "./i18n/useTranslation";
import { unlockAudio } from "./lib/audio";
import { useRecipes } from "./hooks/useRecipes";
import { useCloudSync } from "./hooks/useCloudSync";
import type { SyncStatus } from "./types";

import HomePage         from "./pages/HomePage";
import AddRecipePage    from "./pages/AddRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import CookingModePage  from "./pages/CookingModePage";
import PlannerPage      from "./pages/PlannerPage";
import EditRecipePage   from "./pages/EditRecipePage";

function IconBook()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function IconPlus()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="22" height="22"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IconCalendar(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function IconMoon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function IconSun()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>; }

function syncColor(status: SyncStatus): string {
  if (status === "synced")  return "#4a7039";
  if (status === "error")   return "#991b1b";
  if (status === "syncing") return "var(--brand)";
  return "var(--text-muted)";
}

function SyncIndicator({ status, lastSync, syncId, isEnabled, syncNow, errorMessage }: {
  status: SyncStatus; lastSync: string | null; syncId: string;
  isEnabled: boolean; syncNow: () => Promise<void>; errorMessage: string | null;
}) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    try { await navigator.clipboard.writeText(syncId); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { /* noop */ }
  };

  if (!isEnabled) return null;

  const formattedLastSync = lastSync
    ? new Date(lastSync).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    : null;

  const icon = status === "synced"
    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><polyline points="9 12 11 14 15 10" strokeWidth="2.5"/></svg>
    : status === "error"
    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><line x1="12" y1="13" x2="12" y2="16"/><circle cx="12" cy="18" r="0.5" fill="currentColor"/></svg>
    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setShow((v) => !v)} title="Cloud sync"
        style={{
          background: "none", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)",
          cursor: "pointer", color: syncColor(status), padding: "0.3rem 0.5rem",
          display: "flex", alignItems: "center", gap: "0.3rem", transition: "all 0.15s",
          animation: status === "syncing" ? "pulse 1s ease infinite" : "none",
        }}>
        {icon}
        {status === "synced" && formattedLastSync && (
          <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>{formattedLastSync}</span>
        )}
        {status === "syncing" && <span style={{ fontSize: "0.68rem", fontWeight: 700 }}>…</span>}
      </button>

      {show && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 48 }} onClick={() => setShow(false)} />
          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-modal)",
            padding: "1rem 1.125rem", minWidth: 260, zIndex: 49,
            display: "flex", flexDirection: "column", gap: "0.625rem",
            animation: "slideDown 0.15s ease-out",
          }}>
            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>☁️ Cloud Sync</p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Stato:</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)",
                background: status === "synced" ? "#f0f4ed" : status === "error" ? "#fef2f2" : "var(--brand-light)",
                color: syncColor(status) }}>
                {status === "synced" ? "✓ Sincronizzato" : status === "error" ? "✗ Errore" : status === "syncing" ? "⟳ In corso…" : "In attesa"}
              </span>
            </div>

            {lastSync && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Ultimo sync:</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  {new Date(lastSync).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            )}

            {errorMessage && (
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--error)", background: "var(--error-bg)", padding: "0.35rem 0.5rem", borderRadius: 6 }}>
                {errorMessage}
              </p>
            )}

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.625rem" }}>
              <p style={{ margin: "0 0 0.35rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Sync ID — incollalo su un altro dispositivo per condividere le ricette:
              </p>
              <div style={{ display: "flex", gap: "0.35rem" }}>
                <code style={{ flex: 1, fontSize: "0.65rem", padding: "0.3rem 0.5rem", background: "var(--bg-page)", borderRadius: 6, border: "1px solid var(--border)", color: "var(--text-secondary)", wordBreak: "break-all", lineHeight: 1.4 }}>
                  {syncId}
                </code>
                <button onClick={copyId} style={{ background: "var(--brand-light)", border: "none", borderRadius: 6, cursor: "pointer", padding: "0.3rem 0.5rem", color: "var(--brand-dark)", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 }}>
                  {copied ? "✓" : "Copia"}
                </button>
              </div>
            </div>

            <button onClick={async () => { await syncNow(); setShow(false); }} disabled={status === "syncing"}
              style={{ background: "var(--brand)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", padding: "0.5rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", opacity: status === "syncing" ? 0.6 : 1 }}>
              {status === "syncing" ? "Sincronizzazione…" : "⟳ Sincronizza ora"}
            </button>
          </div>
        </>
      )}
      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }`}</style>
    </div>
  );
}

function Header({ dark, onToggleDark, syncProps }: {
  dark: boolean;
  onToggleDark: () => void;
  syncProps: React.ComponentProps<typeof SyncIndicator>;
}) {
  const { t } = useTranslation();
  const { lang, toggleLang } = useLang();
  const location = useLocation();
  if (location.pathname.startsWith("/cucina/")) return null;

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, paddingTop: "env(safe-area-inset-top)" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 1.25rem", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "-0.01em" }}>Heirloom</span>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 3 }}>Digital</span>
        </NavLink>

        <nav style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
          {[
            { to: "/",         label: t("nav.home"),    icon: <IconBook /> },
            { to: "/aggiungi", label: t("nav.add"),     icon: <IconPlus /> },
            { to: "/planner",  label: t("nav.planner"), icon: <IconCalendar /> },
          ].map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === "/"} title={label}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: "0.3rem",
                padding: "0.4rem 0.6rem", borderRadius: "var(--radius-md)",
                color: isActive ? "var(--brand)" : "var(--text-secondary)",
                background: isActive ? "var(--brand-light)" : "transparent",
                textDecoration: "none", transition: "all 0.15s",
                fontSize: "0.8rem", fontWeight: 700,
              })}>
              {icon}
              <span style={{ display: "none" }} className="sm-show">{label}</span>
            </NavLink>
          ))}

          <SyncIndicator {...syncProps} />

          <button onClick={toggleLang} title="Cambia lingua / 言語切替"
            style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-secondary)", padding: "0.3rem 0.6rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.03em", transition: "all 0.15s", display: "flex", alignItems: "center" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}>
            {lang === "it" ? "🇯🇵 JP" : "🇮🇹 IT"}
          </button>

          <button onClick={onToggleDark} aria-label={dark ? "Modalità chiara" : "Modalità scura"}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", padding: "0.4rem 0.5rem", borderRadius: "var(--radius-md)", transition: "color 0.15s" }}>
            {dark ? <IconSun /> : <IconMoon />}
          </button>
        </nav>
      </div>
      <style>{`@media (min-width: 500px) { .sm-show { display: inline !important; } }`}</style>
    </header>
  );
}

function NotFound() {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
      <p style={{ fontSize: "3rem" }}>🍽️</p>
      <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}>{t("error.notFound")}</h2>
      <NavLink to="/" style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.65rem 1.5rem", background: "var(--brand)", color: "#fff", borderRadius: "var(--radius-md)", fontWeight: 700, textDecoration: "none" }}>
        {t("misc.back")}
      </NavLink>
    </div>
  );
}

function AppShell() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleDark = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("heirloom_dark", String(next)); } catch {}
  }, [dark]);

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  const { allRecipes, mergeFromCloud } = useRecipes();
  const allRecipesRef = useRef(allRecipes);
  allRecipesRef.current = allRecipes;

  const syncProps = useCloudSync(allRecipes, {
    onMerge: mergeFromCloud,
    getLocalRecipes: () => allRecipesRef.current,
  });

  return (
    <>
      <Header dark={dark} onToggleDark={toggleDark} syncProps={syncProps} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/"                     element={<HomePage />} />
          <Route path="/aggiungi"             element={<AddRecipePage />} />
          <Route path="/ricette/:id"          element={<RecipeDetailPage />} />
          <Route path="/ricette/:id/modifica" element={<EditRecipePage />} />
          <Route path="/cucina/:id"           element={<CookingModePage />} />
          <Route path="/planner"              element={<PlannerPage />} />
          <Route path="*"                     element={<NotFound />} />
        </Routes>
      </main>
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
