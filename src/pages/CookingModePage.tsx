/**
 * CookingModePage.tsx v4 — Supporto bilingue IT/JP.
 * Usa useLang() (reattivo) invece di getCurrentLocale() (snapshot localStorage).
 */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useRecipe, useRecipes } from "../hooks/useRecipes";
import { useScaledIngredients, extractTimersFromStep } from "../hooks/useScaledIngredients";
import { clampServings } from "../lib/scaling";
import { playStepAdvance, playRecipeComplete } from "../lib/audio";
import { getLocalizedContent } from "../lib/recipeLocale";
import type { Locale } from "../lib/recipeLocale";
import TimerButton from "../components/TimerButton";
import { useTranslation } from "../i18n/useTranslation";
import { useLang } from "../i18n/LangContext";

function IconBack()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconCheck() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>; }

function useWakeLock() {
  const lockRef = useRef<WakeLockSentinel | null>(null);
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").then((l) => { lockRef.current = l; }).catch(() => {});
    const reacquire = () => {
      if (document.visibilityState === "visible" && !lockRef.current) {
        navigator.wakeLock.request("screen").then((l) => { lockRef.current = l; }).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", reacquire);
    return () => {
      document.removeEventListener("visibilitychange", reacquire);
      lockRef.current?.release().catch(() => {});
    };
  }, []);
}

function ServingsModal({ defaultServings, onStart, onCancel }: {
  defaultServings: number; onStart: (n: number) => void; onCancel: () => void;
}) {
  const [n, setN] = useState(defaultServings);
  const { t } = useTranslation();
  const { lang } = useLang();
  const servingsLabel = lang === "ja" ? (n === 1 ? "1人分" : `${n}人分`) : (n === 1 ? "1 porzione" : `${n} porzioni`);
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
        <p style={{ fontSize: "2rem", margin: "0 0 0.5rem" }}>🍳</p>
        <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>{t("cooking.modal.question")}</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          {lang === "ja" ? "分量は自動で計算されます" : "Le quantità verranno scalate automaticamente"}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <button onClick={() => setN((v) => clampServings(v - 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--border)", background: "var(--bg-card)", fontSize: "1.5rem", cursor: "pointer" }}>−</button>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--brand)", minWidth: "2.5ch", textAlign: "center" }}>{n}</span>
          <button onClick={() => setN((v) => clampServings(v + 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--border)", background: "var(--bg-card)", fontSize: "1.5rem", cursor: "pointer" }}>+</button>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>{servingsLabel}</p>
        <div style={{ display: "flex", gap: "0.625rem", justifyContent: "center" }}>
          <button className="btn btn-secondary" onClick={onCancel}>{t("cooking.modal.cancel")}</button>
          <button className="btn btn-primary btn-cooking" onClick={() => onStart(n)} style={{ minWidth: 140 }}>{t("cooking.modal.start")}</button>
        </div>
      </div>
    </div>
  );
}

function DoneScreen({ title, onClose }: { title: string; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: "5rem", marginBottom: "1.25rem" }}>🍽️</div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,6vw,3rem)", color: "var(--cooking-brand)", margin: "0 0 0.75rem" }}>
        {t("cooking.done.title")}
      </h1>
      <p style={{ color: "var(--cooking-muted)", fontSize: "1.1rem", marginBottom: "2.5rem" }}>{title} ✓</p>
      <button onClick={onClose} style={{ background: "var(--cooking-brand)", color: "#fff", border: "none", borderRadius: "var(--radius-lg)", padding: "1rem 2rem", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", minWidth: 180 }}>
        {t("cooking.done.close")}
      </button>
    </div>
  );
}

export default function CookingModePage() {
  const { id }         = useParams<{ id: string }>();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const { t }          = useTranslation();
  const { lang }       = useLang();
  const locale         = lang as Locale;

  const { recipe, loading } = useRecipe(id);
  const { markCooked }      = useRecipes();
  const qsServings = parseInt(searchParams.get("servings") ?? "0") || null;

  const [phase,    setPhase]    = useState<"modal" | "cooking" | "done">("modal");
  const [servings, setServings] = useState<number>(qsServings ?? 4);
  const [step,     setStep]     = useState(0);
  const [fontSize, setFontSize] = useState(1);

  useWakeLock();

  const localized = useMemo(
    () => recipe ? getLocalizedContent(recipe, locale) : null,
    [recipe, locale]
  );

  const scaled = useScaledIngredients(localized?.ingredients ?? [], recipe?.yield ?? 4, servings);
  const currentStepText = localized?.steps[step] ?? "";
  const stepTimers = useMemo(() => extractTimersFromStep(currentStepText), [currentStepText]);

  const touchStart = useRef<number | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; }, []);
  const onTouchEnd   = useCallback((e: React.TouchEvent) => {
    if (touchStart.current === null || !localized) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0 && step < localized.steps.length - 1) goNext();
    if (delta > 0 && step > 0) goPrev();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touchStart, step, localized]);

  function goNext() {
    if (!localized) return;
    if (step < localized.steps.length - 1) { playStepAdvance(); setStep((s) => s + 1); }
    else handleFinish();
  }
  function goPrev() { if (step > 0) setStep((s) => s - 1); }
  async function handleFinish() {
    playRecipeComplete();
    if (id) await markCooked(id).catch(() => {});
    setPhase("done");
  }

  if (loading || !recipe || !localized) {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--cooking-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--cooking-muted)" }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "var(--cooking-brand)", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
        </div>
      </div>
    );
  }

  const totalSteps = localized.steps.length;
  const servingsLabel = locale === "ja" ? (servings === 1 ? "1人分" : `${servings}人分`) : (servings === 1 ? "1 porzione" : `${servings} porzioni`);
  const remainingLabel = locale === "ja"
    ? (totalSteps - step - 1 === 1 ? "あと1ステップ" : `あと${totalSteps - step - 1}ステップ`)
    : (totalSteps - step - 1 === 1 ? "ancora 1 passo" : `ancora ${totalSteps - step - 1} passi`);
  const lastStepLabel = locale === "ja" ? "最後のステップ" : "ultimo passo";

  return (
    <div className="cooking-mode" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {phase === "modal" && (
        <ServingsModal
          defaultServings={qsServings ?? recipe.yield}
          onStart={(n) => { setServings(n); setPhase("cooking"); }}
          onCancel={() => navigate(-1)}
        />
      )}
      {phase === "done" && <DoneScreen title={localized.title} onClose={() => navigate("/")} />}
      {phase === "cooking" && (
        <>
          <div style={{ background: "var(--cooking-surface)", padding: "0.75rem 1rem", paddingTop: "calc(0.75rem + env(safe-area-inset-top))", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cooking-muted)", display: "flex", padding: "0.25rem" }}>
              <IconBack />
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--cooking-muted)", fontWeight: 700, letterSpacing: "0.05em" }}>{localized.title.toUpperCase()}</p>
              <p style={{ margin: "0.1rem 0 0", fontSize: "0.8rem", color: "var(--cooking-muted)" }}>
                {t("cooking.progress", { current: String(step + 1), total: String(totalSteps) })} · {servingsLabel}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button onClick={() => setFontSize((f) => Math.max(0.85, f - 0.15))} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, color: "var(--cooking-muted)", cursor: "pointer", padding: "0.3rem 0.5rem", fontSize: "0.9rem" }}>A−</button>
              <button onClick={() => setFontSize((f) => Math.min(1.6, f + 0.15))} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, color: "var(--cooking-muted)", cursor: "pointer", padding: "0.3rem 0.5rem", fontSize: "0.9rem" }}>A+</button>
            </div>
          </div>

          <div style={{ height: 4, background: "rgba(255,255,255,0.08)" }}>
            <div style={{ height: "100%", width: `${((step + 1) / totalSteps) * 100}%`, background: "var(--cooking-brand)", transition: "width 0.4s ease" }} />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1.75rem 1.25rem", gap: "1.25rem", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--cooking-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "1.1rem", color: "#fff", flexShrink: 0 }}>{step + 1}</span>
              <span style={{ fontSize: "0.875rem", color: "var(--cooking-muted)" }}>
                {step < totalSteps - 1 ? remainingLabel : lastStepLabel}
              </span>
            </div>

            <p style={{ fontSize: `${fontSize * 1.4}rem`, lineHeight: 1.55, color: "var(--cooking-text)", flex: 1, margin: 0 }}>{currentStepText}</p>

            {stepTimers.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
                {stepTimers.map((tm, i) => <TimerButton key={i} label={tm.label} durationSeconds={tm.seconds} />)}
              </div>
            )}

            {step === 0 && scaled.length > 0 && (
              <div style={{ background: "var(--cooking-surface)", borderRadius: "var(--radius-md)", padding: "0.875rem 1rem" }}>
                <p style={{ margin: "0 0 0.625rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--cooking-muted)", letterSpacing: "0.06em" }}>
                  {locale === "ja" ? `材料 (${servingsLabel})` : `INGREDIENTI (${servingsLabel})`}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {scaled.map((ing) => (
                    <li key={ing.id} style={{ fontSize: `${fontSize * 0.9}rem`, color: "var(--cooking-text)", display: "flex", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 700, color: "var(--cooking-brand)", minWidth: 60, textAlign: "right" }}>{ing.qtyDisplay} {ing.unit}</span>
                      <span>{ing.displayName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ background: "var(--cooking-surface)", padding: "1rem 1.25rem", paddingBottom: "calc(1rem + env(safe-area-inset-bottom))", display: "grid", gridTemplateColumns: step > 0 ? "1fr 1fr" : "1fr", gap: "0.625rem" }}>
            {step > 0 && (
              <button onClick={goPrev} style={{ minHeight: 60, fontSize: "1.1rem", borderRadius: "var(--radius-lg)", fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "var(--cooking-muted)", border: "none", cursor: "pointer" }}>
                ← {t("misc.back")}
              </button>
            )}
            <button onClick={goNext} style={{ minHeight: 60, fontSize: "1.1rem", borderRadius: "var(--radius-lg)", fontWeight: 700, background: "var(--cooking-brand)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              {step === totalSteps - 1
                ? <><IconCheck /> {t("cooking.finish")}</>
                : <>{t("cooking.next")} →</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
