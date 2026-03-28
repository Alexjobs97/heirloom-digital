/**
 * CookingModePage.tsx — Modalità cucina full-screen passo-passo.
 * Timer inline, swipe gesture, audio, aggiornamento lastCooked.
 */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useRecipe } from "../hooks/useRecipes";
import { useRecipes } from "../hooks/useRecipes";
import { useCookingTimer, extractTimersFromStep } from "../hooks/useScaledIngredients";
import { useScaledIngredients } from "../hooks/useScaledIngredients";
import { clampServings, formatTime } from "../lib/scaling";
import { playStepAdvance, playRecipeComplete } from "../lib/audio";
import type { TimerState } from "../types";
import TimerButton from "../components/TimerButton";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconBack()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconCheck() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>; }

// ─── Modale "per quante persone" ──────────────────────────────────────────────

function ServingsModal({
  defaultServings,
  onStart,
  onCancel,
}: {
  defaultServings: number;
  onStart: (n: number) => void;
  onCancel: () => void;
}) {
  const [n, setN] = useState(defaultServings);
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
        <p style={{ fontSize: "2rem", margin: "0 0 0.5rem" }}>🍳</p>
        <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Per quante persone cucini?</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          Le quantità saranno scalate di conseguenza
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.75rem" }}>
          <button
            onClick={() => setN((v) => clampServings(v - 1))}
            style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--border)", background: "var(--bg-card)", fontSize: "1.5rem", cursor: "pointer" }}
          >−</button>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--brand)", minWidth: "2.5ch", textAlign: "center" }}>
            {n}
          </span>
          <button
            onClick={() => setN((v) => clampServings(v + 1))}
            style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--border)", background: "var(--bg-card)", fontSize: "1.5rem", cursor: "pointer" }}
          >+</button>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          {n === 1 ? "1 porzione" : `${n} porzioni`}
        </p>
        <div style={{ display: "flex", gap: "0.625rem", justifyContent: "center" }}>
          <button className="btn btn-secondary" onClick={onCancel}>Annulla</button>
          <button className="btn btn-primary btn-cooking" onClick={() => onStart(n)} style={{ minWidth: 140 }}>
            Inizia →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Schermata finale ─────────────────────────────────────────────────────────

function DoneScreen({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "5rem", marginBottom: "1.25rem", animation: "fadeIn 0.4s ease-out" }}>
        🍽️
      </div>
      <h1 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(2rem, 6vw, 3rem)",
        color: "var(--cooking-brand)",
        margin: "0 0 0.75rem",
      }}>
        Buon appetito!
      </h1>
      <p style={{ color: "var(--cooking-muted)", fontSize: "1.1rem", marginBottom: "2.5rem" }}>
        {title} completata ✓
      </p>
      <button
        className="btn btn-cooking"
        onClick={onClose}
        style={{
          background: "var(--cooking-brand)",
          color: "#fff",
          border: "none",
          minWidth: 180,
        }}
      >
        Chiudi
      </button>
    </div>
  );
}

// ─── CookingModePage ──────────────────────────────────────────────────────────

export default function CookingModePage() {
  const { id }          = useParams<{ id: string }>();
  const navigate        = useNavigate();
  const [searchParams]  = useSearchParams();

  const { recipe, loading } = useRecipe(id);
  const { markCooked }      = useRecipes();

  // Porzioni passate dalla RecipeDetailPage via query string
  const qsServings = parseInt(searchParams.get("servings") ?? "0") || null;

  const [phase,    setPhase]    = useState<"modal" | "cooking" | "done">("modal");
  const [servings, setServings] = useState<number>(qsServings ?? 4);
  const [step,     setStep]     = useState(0);

  const {
    timers, startTimer, pauseTimer, resumeTimer, resetTimer, clearAll,
  } = useCookingTimer();

  // Ingredienti scalati (mostrati nel riepilogo passo)
  const scaled = useScaledIngredients(
    recipe?.ingredients ?? [],
    recipe?.yield ?? 4,
    servings
  );

  // Timer estratti dal passo corrente
  const currentStepText = recipe?.steps[step] ?? "";
  const stepTimers = useMemo(
    () => extractTimersFromStep(currentStepText),
    [currentStepText]
  );

  // Mappa label → TimerState (per passare allo stesso timer se già avviato)
  const timerByLabel = useCallback(
    (label: string): TimerState | undefined =>
      timers.find((t) => t.label === label && !t.finished),
    [timers]
  );

  // ── Swipe gesture ─────────────────────────────────────────────────────────

  const touchStart = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart.current === null || !recipe) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0 && step < recipe.steps.length - 1) goNext();
    if (delta > 0 && step > 0) goPrev();
  }, [touchStart, step, recipe]);

  // ── Navigazione passi ─────────────────────────────────────────────────────

  function goNext() {
    if (!recipe) return;
    if (step < recipe.steps.length - 1) {
      playStepAdvance();
      clearAll();
      setStep((s) => s + 1);
    } else {
      handleFinish();
    }
  }

  function goPrev() {
    if (step > 0) {
      clearAll();
      setStep((s) => s - 1);
    }
  }

  async function handleFinish() {
    playRecipeComplete();
    if (id) await markCooked(id);
    setPhase("done");
  }

  // ── Avvio ─────────────────────────────────────────────────────────────────

  function handleStart(n: number) {
    setServings(n);
    setPhase("cooking");
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading || !recipe) {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--cooking-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--cooking-muted)", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "var(--cooking-brand)", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin-slow 0.8s linear infinite" }} />
          <p>Caricamento…</p>
        </div>
      </div>
    );
  }

  const totalSteps = recipe.steps.length;

  return (
    <div className="cooking-mode" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* Modale iniziale */}
      {phase === "modal" && (
        <ServingsModal
          defaultServings={qsServings ?? recipe.yield}
          onStart={handleStart}
          onCancel={() => navigate(-1)}
        />
      )}

      {/* Schermata "Fatto" */}
      {phase === "done" && (
        <DoneScreen title={recipe.title} onClose={() => navigate("/")} />
      )}

      {/* Modalità cucina attiva */}
      {phase === "cooking" && (
        <>
          {/* Barra superiore */}
          <div style={{
            background: "var(--cooking-surface)",
            padding: "0.75rem 1rem",
            paddingTop: "calc(0.75rem + env(safe-area-inset-top))",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cooking-muted)", display: "flex", padding: "0.25rem" }}
              aria-label="Esci dalla modalità cucina"
            >
              <IconBack />
            </button>

            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--cooking-muted)", fontWeight: 700, letterSpacing: "0.05em" }}>
                {recipe.title.toUpperCase()}
              </p>
              <p style={{ margin: "0.15rem 0 0", fontSize: "0.82rem", color: "var(--cooking-muted)" }}>
                Passo {step + 1} di {totalSteps} · {servings === 1 ? "1 porzione" : `${servings} porzioni`}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" style={{ borderRadius: 0, background: "rgba(255,255,255,0.08)" }}>
            <div
              className="progress-fill"
              style={{ width: `${((step + 1) / totalSteps) * 100}%`, background: "var(--cooking-brand)" }}
            />
          </div>

          {/* Contenuto step */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "1.75rem 1.25rem",
            gap: "1.25rem",
            overflowY: "auto",
          }}>
            {/* Numero passo */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{
                width: 40, height: 40,
                borderRadius: "50%",
                background: "var(--cooking-brand)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#fff",
                flexShrink: 0,
              }}>
                {step + 1}
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--cooking-muted)" }}>
                {step < totalSteps - 1 ? `ancora ${totalSteps - step - 1} passi` : "ultimo passo"}
              </span>
            </div>

            {/* Testo del passo */}
            <p className="cooking-step-text" style={{ flex: 1 }}>
              {currentStepText}
            </p>

            {/* Timer estratti dal testo */}
            {stepTimers.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
                {stepTimers.map((t, i) => {
                  const existing = timerByLabel(t.label);
                  return (
                    <TimerButton
                      key={i}
                      label={t.label}
                      durationSeconds={t.seconds}
                      timer={existing ?? timers.find((tm) => tm.label === t.label && tm.finished)}
                      onStart={startTimer}
                      onPause={pauseTimer}
                      onResume={resumeTimer}
                      onReset={resetTimer}
                    />
                  );
                })}
              </div>
            )}

            {/* Ingredienti rilevanti (chip) */}
            {scaled.length > 0 && step === 0 && (
              <div style={{
                background: "var(--cooking-surface)",
                borderRadius: "var(--radius-md)",
                padding: "0.875rem 1rem",
              }}>
                <p style={{ margin: "0 0 0.625rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--cooking-muted)", letterSpacing: "0.06em" }}>
                  INGREDIENTI ({servings === 1 ? "1 porzione" : `${servings} porzioni`})
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {scaled.map((ing) => (
                    <li key={ing.id} style={{ fontSize: "0.9rem", color: "var(--cooking-text)", display: "flex", gap: "0.4rem" }}>
                      <span style={{ fontWeight: 700, color: "var(--cooking-brand)", minWidth: 50, textAlign: "right" }}>
                        {ing.qtyDisplay} {ing.unit}
                      </span>
                      <span>{ing.displayName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Navigazione passi */}
          <div style={{
            background: "var(--cooking-surface)",
            padding: "1rem 1.25rem",
            paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
            display: "grid",
            gridTemplateColumns: step > 0 ? "1fr 1fr" : "1fr",
            gap: "0.625rem",
          }}>
            {step > 0 && (
              <button
                className="cooking-nav-btn"
                onClick={goPrev}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "var(--cooking-muted)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← Indietro
              </button>
            )}
            <button
              className="cooking-nav-btn"
              onClick={goNext}
              style={{
                background: "var(--cooking-brand)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {step === totalSteps - 1 ? (
                <><IconCheck /> Fatto!</>
              ) : (
                <>Passo successivo →</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
