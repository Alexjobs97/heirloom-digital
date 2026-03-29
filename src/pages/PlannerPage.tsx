/**
 * PlannerPage.tsx — Pianificatore giornaliero semplice.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDailyPlan } from "../hooks/useDailyPlan";
import { useRecipes } from "../hooks/useRecipes";

function IconX() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function IconClock() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDateIT(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("it-IT", {
    weekday: "long", day: "numeric", month: "long",
  });
}

export default function PlannerPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(todayISO());
  const [showPicker, setShowPicker] = useState(false);

  const { recipeIds, addRecipe, removeRecipe, loading } = useDailyPlan(date);
  const { allRecipes } = useRecipes();

  const plannedRecipes = allRecipes.filter((r) => recipeIds.includes(r.id));
  const available = allRecipes.filter((r) => !recipeIds.includes(r.id));

  const isToday = date === todayISO();

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.25rem 1rem 3rem" }}>
      <h1 style={{ marginBottom: "0.35rem" }}>Pianificatore</h1>

      {/* Selettore data */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1rem",
          color: "var(--text-secondary)",
          textTransform: "capitalize",
        }}>
          {formatDateIT(date)}
        </span>

        <div style={{ display: "flex", gap: "0.4rem", marginLeft: "auto" }}>
          {!isToday && (
            <button
              className="btn btn-ghost"
              onClick={() => setDate(todayISO())}
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
            >
              Oggi
            </button>
          )}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
            style={{ width: "auto", padding: "0.35rem 0.625rem", fontSize: "0.875rem", minHeight: "auto" }}
          />
        </div>
      </div>

      {/* Lista ricette pianificate */}
      {loading ? (
        <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
          Caricamento…
        </div>
      ) : plannedRecipes.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "2.5rem 1rem",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "2px dashed var(--border)",
          marginBottom: "1.5rem",
          color: "var(--text-muted)",
        }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</p>
          <p style={{ fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
            Nessuna ricetta per {isToday ? "oggi" : "questo giorno"}
          </p>
          <p style={{ fontSize: "0.875rem" }}>Aggiungi una ricetta dal menù qui sotto</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.5rem" }}>
          {plannedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                padding: "0.875rem 1rem",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/ricette/${recipe.id}`)}
            >
              {/* Thumbnail */}
              <div style={{
                width: 52, height: 52, flexShrink: 0,
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                background: "var(--brand-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {recipe.coverImage ? (
                  <img src={recipe.coverImage} alt={recipe.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, color: "var(--brand)", fontSize: "1.5rem" }}>
                    {recipe.title[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {recipe.title}
                </p>
                {recipe.totalTime > 0 && (
                  <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <IconClock /> {recipe.totalTime} min
                  </p>
                )}
              </div>

              {/* Rimuovi */}
              <button
                onClick={(e) => { e.stopPropagation(); removeRecipe(recipe.id); }}
                aria-label="Rimuovi dal piano"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", padding: "0.35rem",
                  display: "flex", flexShrink: 0,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <IconX />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Aggiungi ricette */}
      {available.length > 0 && (
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.625rem" }}>
            Aggiungi al piano
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {available.slice(0, showPicker ? undefined : 6).map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => addRecipe(recipe.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.15s, background 0.15s",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-light)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                }}
              >
                <span style={{ color: "var(--brand)", fontSize: "1.1rem", lineHeight: 1 }}>+</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {recipe.title}
                </span>
                {recipe.totalTime > 0 && (
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <IconClock /> {recipe.totalTime} min
                  </span>
                )}
              </button>
            ))}

            {available.length > 6 && !showPicker && (
              <button
                className="btn btn-ghost"
                onClick={() => setShowPicker(true)}
                style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}
              >
                Mostra altre {available.length - 6} ricette
              </button>
            )}
          </div>
        </div>
      )}

      {allRecipes.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "1rem" }}>
          <p style={{ fontSize: "0.875rem" }}>Aggiungi prima qualche ricetta al libro.</p>
          <button className="btn btn-primary" onClick={() => navigate("/aggiungi")} style={{ marginTop: "0.75rem" }}>
            Aggiungi ricetta
          </button>
        </div>
      )}
    </div>
  );
}
