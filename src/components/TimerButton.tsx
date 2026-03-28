/**
 * TimerButton.tsx — Pulsante timer inline con countdown e controlli.
 */

import { useEffect } from "react";
import type { TimerState } from "../types";

function IconPlay()  { return <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="5 3 19 12 5 21 5 3"/></svg>; }
function IconPause() { return <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>; }
function IconReset() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>; }

interface TimerButtonProps {
  /** Testo del timer da mostrare prima di avviarlo (es. "cuoci 12 minuti") */
  label: string;
  durationSeconds: number;
  /** Timer state se già avviato (fornito da useCookingTimer) */
  timer?: TimerState;
  onStart: (label: string, seconds: number) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onReset: (id: string) => void;
}

function formatTime(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function minuteLabel(s: number): string {
  const m = Math.round(s / 60);
  return m === 1 ? "1 min" : `${m} min`;
}

export default function TimerButton({
  label,
  durationSeconds,
  timer,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerButtonProps) {
  // Quando il timer finisce, il componente padre (CookingMode) lo sa già
  // tramite timer.finished — qui mostriamo solo lo stato visivo.

  if (!timer) {
    // Timer non ancora avviato
    return (
      <button
        className="timer-btn"
        onClick={() => onStart(label, durationSeconds)}
        title={`Avvia timer: ${minuteLabel(durationSeconds)}`}
      >
        <IconPlay />
        <span>⏱ {minuteLabel(durationSeconds)}</span>
      </button>
    );
  }

  if (timer.finished) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.3rem 0.75rem",
          background: "var(--success-bg)",
          border: "1.5px solid var(--success)",
          color: "var(--success)",
          borderRadius: "var(--radius-full)",
          fontSize: "0.875rem",
          fontWeight: 700,
        }}
      >
        ✓ Tempo scaduto!
        <button
          onClick={() => onReset(timer.id)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", padding: "0 0 0 0.25rem" }}
          title="Ricomincia"
        >
          <IconReset />
        </button>
      </span>
    );
  }

  // Timer in esecuzione o in pausa
  const pct = timer.remainingSeconds / timer.durationSeconds;
  const urgent = timer.remainingSeconds <= 30 && timer.remainingSeconds > 0;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.3rem 0.75rem",
        background: urgent ? "rgba(220,38,38,0.1)" : "rgba(181,84,30,0.1)",
        border: `1.5px solid ${urgent ? "var(--error)" : "var(--brand)"}`,
        borderRadius: "var(--radius-full)",
        fontSize: "0.9rem",
        fontWeight: 700,
        color: urgent ? "var(--error)" : "var(--brand-dark)",
      }}
    >
      {/* Mini progress arc (barra orizzontale lineare) */}
      <span style={{
        display: "inline-block",
        width: 32,
        height: 4,
        background: "var(--border)",
        borderRadius: "var(--radius-full)",
        overflow: "hidden",
      }}>
        <span style={{
          display: "block",
          height: "100%",
          width: `${Math.max(0, pct * 100)}%`,
          background: urgent ? "var(--error)" : "var(--brand)",
          transition: "width 0.9s linear",
        }} />
      </span>

      {/* Countdown */}
      <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.9rem", minWidth: "3.5ch" }}>
        {formatTime(timer.remainingSeconds)}
      </span>

      {/* Play / Pause */}
      <button
        onClick={() => timer.running ? onPause(timer.id) : onResume(timer.id)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex" }}
        title={timer.running ? "Pausa" : "Riprendi"}
      >
        {timer.running ? <IconPause /> : <IconPlay />}
      </button>

      {/* Reset */}
      <button
        onClick={() => onReset(timer.id)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex" }}
        title="Ricomincia"
      >
        <IconReset />
      </button>
    </span>
  );
}
