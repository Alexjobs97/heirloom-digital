/**
 * HomePage.tsx — Lista ricette con griglia, ricerca, filtri e import drag&drop.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SearchFilters } from "../types";
import { useRecipes } from "../hooks/useRecipes";
import { importBook } from "../lib/io";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconPlus() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function IconUpload() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}
function IconBook() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="toast" role="status">{message}</div>;
}

// ─── Skeleton griglia ─────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "1rem",
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card" style={{ overflow: "hidden" }}>
          <div className="skeleton" style={{ aspectRatio: "4/3" }} />
          <div style={{ padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="skeleton" style={{ height: 18, width: "80%" }} />
            <div className="skeleton" style={{ height: 14, width: "55%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onAdd }: { hasFilters: boolean; onAdd: () => void }) {
  if (hasFilters) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
        <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</p>
        <p style={{ fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
          Nessuna ricetta trovata
        </p>
        <p style={{ fontSize: "0.875rem" }}>Prova con un termine diverso o azzera i filtri</p>
      </div>
    );
  }
  return (
    <div style={{ textAlign: "center", padding: "4rem 1.5rem", color: "var(--text-muted)" }}>
      <div style={{ color: "var(--border)", marginBottom: "1.25rem" }}>
        <IconBook />
      </div>
      <h2 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "1.5rem",
        color: "var(--text-primary)",
        marginBottom: "0.5rem",
      }}>
        Il tuo libro è ancora vuoto
      </h2>
      <p style={{ fontSize: "0.9rem", maxWidth: 320, margin: "0 auto 1.75rem" }}>
        Aggiungi la tua prima ricetta incollando qualsiasi testo — convertiamo automaticamente cup, once e libbre.
      </p>
      <button className="btn btn-primary" onClick={onAdd} style={{ gap: "0.4rem" }}>
        <IconPlus /> Aggiungi la prima ricetta
      </button>
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: SearchFilters = { query: "" };

export default function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [toast, setToast]     = useState<string | null>(null);
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
      setToast("Formato non valido — usa un file .json");
      return;
    }
    setImporting(true);
    try {
      const result = await importBook(file, "merge");
      if (result.success) {
        reload();
        setToast(`✓ ${result.count} ricette importate`);
      } else {
        setToast("Errore durante l'importazione");
      }
    } finally {
      setImporting(false);
    }
  }, [reload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImport(file);
    e.target.value = "";
  }, [handleImport]);

  // ─── Drag & Drop globale sulla pagina ─────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImport(file);
  }, [handleImport]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{ maxWidth: 900, margin: "0 auto", padding: "1.25rem 1rem 3rem", width: "100%" }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop zone overlay */}
      {isDragging && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(181,84,30,0.12)",
          border: "3px dashed var(--brand)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(2px)",
          pointerEvents: "none",
        }}>
          <div style={{
            background: "var(--bg-card)",
            borderRadius: "var(--radius-xl)",
            padding: "2rem 3rem",
            textAlign: "center",
            boxShadow: "var(--shadow-modal)",
          }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📂</p>
            <p style={{ fontWeight: 700, color: "var(--brand)", fontSize: "1.05rem" }}>
              Rilascia per importare
            </p>
          </div>
        </div>
      )}

      {/* Header row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.25rem",
        gap: "0.75rem",
        flexWrap: "wrap",
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(1.3rem, 4vw, 1.75rem)" }}>
            Le mie ricette
          </h1>
          {allRecipes.length > 0 && (
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {allRecipes.length === 1 ? "1 ricetta nel libro" : `${allRecipes.length} ricette nel libro`}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          {/* Importa */}
          <button
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            title="Importa libro JSON"
            style={{ gap: "0.4rem", padding: "0.5rem 0.875rem" }}
          >
            <IconUpload />
            <span style={{ fontSize: "0.875rem" }}>
              {importing ? "Importo…" : "Importa"}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileInput}
            style={{ display: "none" }}
          />

          {/* Aggiungi */}
          <button
            className="btn btn-primary"
            onClick={() => navigate("/aggiungi")}
            style={{ gap: "0.4rem" }}
          >
            <IconPlus />
            <span>Aggiungi</span>
          </button>
        </div>
      </div>

      {/* Search + filtri */}
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

      {/* Griglia ricette */}
      {loading ? (
        <SkeletonGrid />
      ) : recipes.length === 0 ? (
        <EmptyState
          hasFilters={hasActiveFilters}
          onAdd={() => navigate("/aggiungi")}
        />
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
          animation: "fadeIn 0.2s ease-out",
        }}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleStar={toggleStar}
            />
          ))}
        </div>
      )}

      {/* Hint drag & drop (solo se ci sono già ricette) */}
      {!loading && allRecipes.length > 0 && (
        <p style={{
          textAlign: "center",
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          marginTop: "2rem",
        }}>
          Trascina un file <code>.json</code> in questa pagina per importare ricette
        </p>
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
