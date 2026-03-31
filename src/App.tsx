import { HashRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { LangProvider, useLang } from "./i18n/LangContext";
import { useTranslation } from "./i18n/useTranslation";
import { unlockAudio } from "./lib/audio";

import HomePage         from "./pages/HomePage";
import AddRecipePage    from "./pages/AddRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import CookingModePage  from "./pages/CookingModePage";
import PlannerPage      from "./pages/PlannerPage";
import EditRecipePage   from "./pages/EditRecipePage";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconBook()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function IconPlus()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="22" height="22"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IconCalendar(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function IconMoon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function IconSun()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>; }

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ dark, onToggleDark }: {
  dark: boolean;
  onToggleDark: () => void;
}) {
  const { t } = useTranslation();
  const { lang, toggleLang } = useLang();
  const location = useLocation();
  if (location.pathname.startsWith("/cucina/")) return null;

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      paddingTop: "env(safe-area-inset-top)",
    }}>
      <div style={{
        maxWidth: 920, margin: "0 auto", padding: "0 1.25rem",
        height: 58, display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "0.5rem",
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <span style={{
            fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 700,
            color: "var(--brand)", letterSpacing: "-0.01em",
          }}>
            Heirloom
          </span>
          <span style={{
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--text-muted)", marginTop: 3,
          }}>
            Digital
          </span>
        </NavLink>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
          {[
            { to: "/",         label: t("nav.home"),    icon: <IconBook /> },
            { to: "/aggiungi", label: t("nav.add"),     icon: <IconPlus /> },
            { to: "/planner",  label: t("nav.planner"), icon: <IconCalendar /> },
          ].map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === "/"}
              title={label}
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

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            title="Cambia lingua / 言語切替"
            style={{
              background: "none",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              color: "var(--text-secondary)",
              padding: "0.3rem 0.6rem",
              fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.03em",
              transition: "all 0.15s", display: "flex", alignItems: "center",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)";
              (e.currentTarget as HTMLElement).style.color = "var(--brand)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            }}
          >
            {lang === "it" ? "🇯🇵 JP" : "🇮🇹 IT"}
          </button>

          {/* Dark mode */}
          <button
            onClick={onToggleDark}
            aria-label={dark ? "Modalità chiara" : "Modalità scura"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-secondary)", display: "flex",
              alignItems: "center", padding: "0.4rem 0.5rem",
              borderRadius: "var(--radius-md)", transition: "color 0.15s",
            }}
          >
            {dark ? <IconSun /> : <IconMoon />}
          </button>
        </nav>
      </div>

      <style>{`
        @media (min-width: 500px) { .sm-show { display: inline !important; } }
      `}</style>
    </header>
  );
}

// ─── 404 ──────────────────────────────────────────────────────────────────────

function NotFound() {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
      <p style={{ fontSize: "3rem" }}>🍽️</p>
      <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}>
        {t("error.notFound")}
      </h2>
      <NavLink to="/"
        style={{
          display: "inline-block", marginTop: "1.5rem",
          padding: "0.65rem 1.5rem", background: "var(--brand)",
          color: "#fff", borderRadius: "var(--radius-md)",
          fontWeight: 700, textDecoration: "none",
        }}>
        {t("misc.back")}
      </NavLink>
    </div>
  );
}

// ─── AppShell ─────────────────────────────────────────────────────────────────

function AppShell() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

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

  return (
    <>
      <Header dark={dark} onToggleDark={toggleDark} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/"                    element={<HomePage />} />
          <Route path="/aggiungi"            element={<AddRecipePage />} />
          <Route path="/ricette/:id"         element={<RecipeDetailPage />} />
          <Route path="/ricette/:id/modifica" element={<EditRecipePage />} />
          <Route path="/cucina/:id"          element={<CookingModePage />} />
          <Route path="/planner"             element={<PlannerPage />} />
          <Route path="*"                    element={<NotFound />} />
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
