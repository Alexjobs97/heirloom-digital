/**
 * HomePage.tsx — Premium recipe browser with categories, greeting, and modern grid.
 * Matches design reference with category pills and search.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { SearchFilters } from "../types";
import { useRecipes } from "../hooks/useRecipes";
import { importBook, exportBook } from "../lib/io";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { useTranslation } from "../i18n/useTranslation";

// Icons
function IconPlus() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function IconUpload() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}
function IconDownload() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
function IconSearch() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}

// Category icons (matching reference design)
const CATEGORY_ICONS: Record<string, string> = {
  "pasta": "🍝", "pizza": "🍕", "carne": "🥩", "pesce": "🐟", "insalata": "🥗",
  "dolce": "🍰", "antipasto": "🥗", "primo": "🍝", "secondo": "🍖", "contorno": "🥦",
  "colazione": "🥐", "merenda": "🍪", "vegetariano": "🥬", "vegano": "🌱",
  "快速": "⚡", "肉料理": "🥩", "魚料理": "🐟", "パスタ": "🍝", "デザート": "🍰",
};

// Get time-based greeting
function getGreeting(locale: string): string {
  const hour = new Date().getHours();
  if (locale === "ja") {
    if (hour < 12) return "おはようございます";
    if (hour < 18) return "こんにちは";
    return "こんばんは";
  }
  if (hour < 12) return "Buongiorno";
  if (hour < 18) return "Buon pomeriggio";
  return "Buonasera";
}

// Toast component
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);
  return <div className="toast" role="status">{message}</div>;
}

// Skeleton grid
function SkeletonGrid() {
  return (
    <div className="recipe-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="recipe-card" style={{ background: "var(--bg-card)" }}>
          <div className="recipe-card-image">
            <div className="skeleton" style={{ width: "100%", height: "100%", borderRadius: "var(--radius-lg)" }} />
          </div>
          <div className="recipe-card-content">
            <div className="skeleton" style={{ height: 16, width: "80%", marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 12, width: "50%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state
function EmptyState({ hasFilters, onAdd }: { hasFilters: boolean; onAdd: () => void }) {
  const { t, locale } = useTranslation();

  if (hasFilters) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>{t("search.noResults")}</h3>
        <p>{t("search.noResults.hint")}</p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-icon">📖</div>
      <h2>{t("home.empty.title")}</h2>
      <p>{t("home.empty.subtitle")}</p>
      <button className="btn btn-primary" onClick={onAdd} style={{ marginTop: "1.5rem" }}>
        <IconPlus /> {t("home.empty.cta")}
      </button>
    </div>
  );
}

// Category pill component
function CategoryPill({ 
  tag, 
  active, 
  onClick 
}: { 
  tag: string; 
  active: boolean; 
  onClick: () => void;
}) {
  const icon = CATEGORY_ICONS[tag.toLowerCase()] || "🍽️";
  
  return (
    <button
      onClick={onClick}
      className={`category-pill ${active ? "active" : ""}`}
    >
      <span className="category-pill-icon">{icon}</span>
      <span className="category-pill-label">{tag}</span>
    </button>
  );
}

// Main component
const DEFAULT_FILTERS: SearchFilters = { query: "" };

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t, locale } = useTranslation();

  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [toast, setToast] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { recipes, allTags, allRecipes, loading, toggleStar, reload } = useRecipes(filters);

  // Auto-focus search when ?search=1 is in URL
  useEffect(() => {
    if (searchParams.get("search") === "1" && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchParams]);

  // Get top categories (most used tags)
  const topCategories = useMemo(() => {
    const tagCounts = new Map<string, number>();
    allRecipes.forEach(r => {
      r.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [allRecipes]);

  const handleFilterChange = useCallback((partial: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleCategoryClick = useCallback((tag: string) => {
    if (selectedCategory === tag) {
      setSelectedCategory(null);
      setFilters(prev => ({ ...prev, tags: undefined }));
    } else {
      setSelectedCategory(tag);
      setFilters(prev => ({ ...prev, tags: [tag] }));
    }
  }, [selectedCategory]);

  const hasActiveFilters = !!filters.query || filters.starred || filters.recentOnly || 
    filters.maxTime !== undefined || (filters.tags?.length ?? 0) > 0;

  // Import handlers
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

  // Drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImport(file);
  }, [handleImport]);

  const greeting = getGreeting(locale);
  const subtitle = locale === "ja" 
    ? "今日は何を作りますか？" 
    : "Cosa vuoi cucinare oggi?";

  return (
    <div
      className="home-page"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop zone overlay */}
      {isDragging && (
        <div className="drop-overlay">
          <div className="drop-overlay-content">
            <span style={{ fontSize: "2.5rem" }}>📂</span>
            <p>{t("home.import.drop")}</p>
          </div>
        </div>
      )}

      {/* Header with greeting */}
      {allRecipes.length > 0 && (
        <header className="home-header">
          <div className="home-greeting">
            <span className="greeting-text">{greeting}</span>
            <h1 className="greeting-question">{subtitle}</h1>
          </div>
          <div className="home-actions">
            <button className="btn btn-ghost btn-icon" onClick={handleExport} title={t("export.book")}>
              <IconDownload />
            </button>
            <button 
              className="btn btn-ghost btn-icon" 
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              title={t("import.button")}
            >
              <IconUpload />
            </button>
            <input ref={fileInputRef} type="file" accept=".json,application/json"
              onChange={handleFileInput} style={{ display: "none" }} />
            <button className="btn btn-primary" onClick={() => navigate("/aggiungi")}>
              <IconPlus />
            </button>
          </div>
        </header>
      )}

      {/* Search bar */}
      {allRecipes.length > 0 && (
        <div className="home-search">
          <div className="search-input-wrapper">
            <IconSearch />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={locale === "ja" ? "レシピを検索..." : "Cerca ricette..."}
              value={filters.query || ""}
              onChange={(e) => handleFilterChange({ query: e.target.value })}
              className="search-input"
            />
          </div>
        </div>
      )}

      {/* Category pills */}
      {allRecipes.length > 0 && topCategories.length > 0 && (
        <div className="home-categories">
          <span className="categories-label">{locale === "ja" ? "カテゴリー" : "Categorie"}</span>
          <div className="categories-scroll">
            {topCategories.map(tag => (
              <CategoryPill
                key={tag}
                tag={tag}
                active={selectedCategory === tag}
                onClick={() => handleCategoryClick(tag)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section title */}
      {allRecipes.length > 0 && (
        <div className="home-section-header">
          <h2 className="section-title">
            {selectedCategory 
              ? selectedCategory 
              : (locale === "ja" ? "人気のレシピ" : "Ricette popolari")}
          </h2>
          <span className="section-count">
            {recipes.length} {recipes.length === 1 
              ? (locale === "ja" ? "件" : "ricetta") 
              : (locale === "ja" ? "件" : "ricette")}
          </span>
        </div>
      )}

      {/* Recipe grid */}
      {loading ? (
        <SkeletonGrid />
      ) : recipes.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} onAdd={() => navigate("/aggiungi")} />
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onToggleStar={toggleStar} />
          ))}
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
