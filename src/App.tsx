import { HashRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "./i18n/useTranslation";
import { unlockAudio } from "./lib/audio";

// Lazy-load pages per chunk splitting
import { lazy, Suspense } from "react";
const HomePage         = lazy(() => import("./pages/HomePage"));
const AddRecipePage    = lazy(() => import("./pages/AddRecipePage"));
const RecipeDetailPage = lazy(() => import("./pages/RecipeDetailPage"));
const CookingModePage  = lazy(() => import("./pages/CookingModePage"));
const PlannerPage      = lazy(() => import("./pages/PlannerPage"));

// ─── Icone inline SVG (nessuna dipendenza) ────────────────────────────────────

function IconBook()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function IconPlus()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="22" height="22"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IconCalendar(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function IconMoon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function IconSun()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>; }

// ─── Loading fallback ─────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{
          width: 36, height: 36, border: "3px solid var(--border)",
          borderTopColor: "var(--brand)", borderRadius: "50%",
          margin: "0 auto 1rem",
          animation: "spin 0.8s linear infinite",
        }} />
        <span style={{ fontSize: "0.875rem" }}>Caricamento…</span>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const { t } = useTranslation();
  const location = useLocation();

  // Nascondi header durante la modalità cucina
  if (location.pathname.startsWith("/cucina/")) return null;

  return (
    <header style={{
      background: "var(--bg-card)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 40,
      paddingTop: "env(safe-area-inset-top)",
    }}>
      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "0 1rem",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
      }}>
        {/* Logo / titolo */}
        <NavLink
          to="/"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <span style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--brand)",
          }}>
            The
          </span>
          <span style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}>
            Heirloom
          </span>
        </NavLink>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <NavItem to="/"         label={t("nav.home")}    icon={<IconBook />} />
          <NavItem to="/aggiungi" label={t("nav.add")}     icon={<IconPlus />} />
          <NavItem to="/planner"  label={t("nav.planner")} icon={<IconCalendar />} hideLabel />

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="btn btn-ghost"
            style={{ padding: "0.5rem", minHeight: "auto" }}
            aria-label={dark ? "Disattiva modalità scura" : "Attiva modalità scura"}
            title={dark ? "Modalità chiara" : "Modalità scura"}
          >
            {dark ? <IconSun /> : <IconMoon />}
          </button>
        </nav>
      </div>
    </header>
  );
}

function NavItem({
  to, label, icon, hideLabel = false,
}: {
  to: string; label: string; icon: React.ReactNode; hideLabel?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.45rem 0.65rem",
        borderRadius: "var(--radius-md)",
        fontSize: "0.875rem",
        fontWeight: 700,
        color: isActive ? "var(--brand)" : "var(--text-secondary)",
        background: isActive ? "var(--brand-light)" : "transparent",
        textDecoration: "none",
        transition: "background 0.15s, color 0.15s",
        whiteSpace: "nowrap",
      })}
    >
      {icon}
      {!hideLabel && (
        <span style={{ display: "none" }}
          className="sm:inline">
          {label}
        </span>
      )}
    </NavLink>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────

function AppShell() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const toggleDark = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("heirloom_dark", String(next));
  }, [dark]);

  // Sblocca AudioContext al primo gesto
  useEffect(() => {
    const unlock = () => { unlockAudio(); window.removeEventListener("pointerdown", unlock); };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  return (
    <>
      <Header dark={dark} onToggleDark={toggleDark} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"               element={<HomePage />} />
            <Route path="/aggiungi"       element={<AddRecipePage />} />
            <Route path="/ricette/:id"    element={<RecipeDetailPage />} />
            <Route path="/cucina/:id"     element={<CookingModePage />} />
            <Route path="/planner"        element={<PlannerPage />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
      <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</p>
      <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}>
        Pagina non trovata
      </h2>
      <NavLink to="/" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
        Torna alle ricette
      </NavLink>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
