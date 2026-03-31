/**
 * HomePage.tsx v2 — Lista ricette con griglia, ricerca, filtri e import drag&drop.
 * Tutte le stringhe passano per useTranslation(). SkeletonGrid aggiornato per card compatte.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SearchFilters } from "../types";
import { useRecipes } from "../hooks/useRecipes";
import { importBook, exportBook } from "../lib/io";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { useTranslation } from "../i18n/useTranslation";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconPlus() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function IconUpload() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}
function IconDownload() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);
  return <div className="toast" role="status">{message}</div>;
}

// ─── Skeleton griglia (card compatte) ─────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="recipe-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          borderRadius: "var(--radius-lg)", overflow: "hidden",
          height: 88, display: "flex", gap: 0,
          background: "var(--bg-card)", border: "1px solid var(--border)",
        }}>
          <div className="skeleton" style={{ width: 88, flexShrink: 0 }} />
          <div style={{ flex: 1, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="skeleton" style={{ height: 16, width: "70%" }} />
            <div className="skeleton" style={{ height: 12, width: "45%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onAdd }: { hasFilters: boolean; onAdd: () => void }) {
  const { t } = useTranslation();

  if (hasFilters) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
        <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</p>
        <p style={{ fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.4rem", fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>
          {t("search.noResults")}
        </p>
        <p style={{ fontSize: "0.875rem" }}>{t("search.noResults.hint")}</p>
      </div>
    );
  }

  return (
    <div style={{
      textAlign: "center", padding: "4rem 1.5rem 5rem",
      color: "var(--text-muted)", maxWidth: 440, margin: "0 auto",
    }}>
      <div style={{
        width: 120, height: 120, margin: "0 auto 2rem",
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--brand-light) 0%, var(--bg-card) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "3.5rem",
        boxShadow: "0 8px 32px rgba(181,84,30,0.12)",
      }}>
        📖
      </div>

      <h2 style={{
        fontFamily: "var(--font-serif)", fontSize: "1.75rem",
        color: "var(--text-primary)", marginBottom: "0.65rem", lineHeight: 1.2,
      }}>
        {t("home.empty.title")}
      </h2>
      <p style={{ fontSize: "0.925rem", lineHeight: 1.7, marginBottom: "2rem", color: "var(--text-secondary)" }}>
        {t("home.empty.subtitle")}
      </p>
      <button className="btn btn-primary" onClick={onAdd}
        style={{ gap: "0.4rem", padding: "0.75rem 1.75rem", fontSize: "1rem" }}>
        <IconPlus /> {t("home.empty.cta")}
      </button>

      <div style={{
        marginTop: "2.5rem", padding: "1rem 1.25rem",
        background: "var(--brand-light)", borderRadius: "var(--radius-md)",
        fontSize: "0.82rem", color: "var(--brand-dark)", lineHeight: 1.7, textAlign: "left",
      }}>
        <strong>Conversioni automatiche:</strong><br />
        1 cup → 240 ml · 1 tbsp → 15 ml · 1 oz → 28 g · 1 lb → 454 g
      </div>
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: SearchFilters = { query: "" };

export default function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const [filters,   setFilters]   = useState<SearchFilters>(DEFAULT_FILTERS);
  const [toast,     setToast]     = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { recipes, allTags, allRecipes, loading, toggleStar, reload } = useRecipes(filters);

  const handleFilterChange = useCallback((partial: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const hasActiveFilters =
    !!filters.query ||
    filters.starred ||
    filters.recentOnly ||
    filters.maxTime !== undefined ||
    (filters.tags?.length ?? 0) > 0;

  // ─── Import ────────────────────────────────────────────────────────────────

  const handleImport = useCallback(async (file: File) => {
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      setToast(t("import.error"));
      return;
    }
    setImporting(true);
    try {
      const result = await importBook(file, "merge");
      if (result.success) {
        reload();
        setToast(`✓ ${result.count} ${result.count === 1 ? "ricetta importata" : "ricette importate"}`);
      } else {
        setToast(t("import.error"));
      }
    } finally {
      setImporting(false);
    }
  }, [reload, t]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImport(file);
    e.target.value = "";
  }, [handleImport]);

  const handleExport = useCallback(async () => {
    await exportBook();
    setToast("📥 Backup esportato");
  }, []);

  // ─── Drag & Drop ──────────────────────────────────────────────────────────

  const handleDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImport(file);
  }, [handleImport]);

  // ─── Contatore ricette ───────────────────────────────────────────────────

  const recipeCountLabel = allRecipes.length === 1
    ? t("home.recipes.count_one", { count: 1 })
    : t("home.recipes.count_other", { count: allRecipes.length });

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{ maxWidth: 980, margin: "0 auto", padding: "0 1rem 3rem", width: "100%" }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop zone overlay */}
      {isDragging && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(181,84,30,0.10)",
          border: "3px dashed var(--brand)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(2px)", pointerEvents: "none",
        }}>
          <div style={{
            background: "var(--bg-card)", borderRadius: "var(--radius-xl)",
            padding: "2rem 3rem", textAlign: "center", boxShadow: "var(--shadow-modal)",
          }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📂</p>
            <p style={{ fontWeight: 700, color: "var(--brand)", fontSize: "1.05rem" }}>
              {t("home.import.drop")}
            </p>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      {allRecipes.length > 0 ? (
        <div style={{
          padding: "1.5rem 0 1.25rem",
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", gap: "1rem", flexWrap: "wrap",
          borderBottom: "1px solid var(--border)", marginBottom: "1.5rem",
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 4vw, 1.9rem)", letterSpacing: "-0.02em" }}>
              {t("nav.home")}
            </h1>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {recipeCountLabel}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            <button className="btn btn-ghost" onClick={handleExport} title={t("export.book")}
              style={{ gap: "0.35rem", padding: "0.5rem 0.75rem", fontSize: "0.825rem" }}>
              <IconDownload />
              <span className="sm-show">Backup</span>
            </button>
            <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}
              disabled={importing} title={t("import.button")}
              style={{ gap: "0.35rem", padding: "0.5rem 0.875rem", fontSize: "0.825rem" }}>
              <IconUpload />
              <span>{importing ? t("misc.loading") : "Importa"}</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".json,application/json"
              onChange={handleFileInput} style={{ display: "none" }} />
            <button className="btn btn-primary" onClick={() => navigate("/aggiungi")}
              style={{ gap: "0.4rem" }}>
              <IconPlus /> {t("nav.add")}
            </button>
          </div>
        </div>
      ) : null}

      {/* ── Search + filtri ──────────────────────────────────────────────── */}
      {allRecipes.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <SearchBar
            filters={filters}
            onChange={handleFilterChange}
            allTags={allTags}
            totalCount={recipes.length}
          />
        </div>
      )}

      {/* ── Griglia ricette ──────────────────────────────────────────────── */}
      {loading ? (
        <SkeletonGrid />
      ) : recipes.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} onAdd={() => navigate("/aggiungi")} />
      ) : (
        <div className="recipe-grid" style={{ animation: "fadeIn 0.2s ease-out" }}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onToggleStar={toggleStar} />
          ))}
        </div>
      )}

      {/* Hint drag & drop */}
      {!loading && allRecipes.length > 0 && (
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2rem" }}>
          {t("home.import.drop")}
        </p>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <style>{`@media (min-width: 500px) { .sm-show { display: inline !important; } }`}</style>
    </div>
  );
}
