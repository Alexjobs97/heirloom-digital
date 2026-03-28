/**
 * audio.ts — Suoni timer via Web Audio API.
 * Zero file audio esterni. Funziona completamente offline.
 */

// ─── Context singleton ────────────────────────────────────────────────────────

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_ctx || _ctx.state === "closed") {
    _ctx = new AudioContext();
  }
  // Safari/iOS: il context parte sospeso finché non c'è un gesto utente
  if (_ctx.state === "suspended") {
    _ctx.resume();
  }
  return _ctx;
}

// ─── Primitiva: singolo beep ──────────────────────────────────────────────────

interface BeepOptions {
  frequency?: number;    // Hz — default 880
  duration?:  number;    // secondi — default 0.15
  volume?:    number;    // 0–1 — default 0.4
  type?:      OscillatorType;
  startAt?:   number;    // AudioContext.currentTime offset
}

function beep(opts: BeepOptions = {}): void {
  const ctx = getCtx();
  const {
    frequency = 880,
    duration  = 0.15,
    volume    = 0.4,
    type      = "sine",
    startAt   = ctx.currentTime,
  } = opts;

  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startAt);

  // Envelope: attacco rapido, release esponenziale per evitare click
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

// ─── Suoni predefiniti ────────────────────────────────────────────────────────

/**
 * Tre beep ascendenti — "timer completato".
 * Do–Mi–Sol (523 → 659 → 784 Hz)
 */
export function playTimerFinished(): void {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    beep({ frequency: 523, duration: 0.18, volume: 0.45, startAt: now });
    beep({ frequency: 659, duration: 0.18, volume: 0.45, startAt: now + 0.22 });
    beep({ frequency: 784, duration: 0.25, volume: 0.50, startAt: now + 0.44 });
  } catch { /* AudioContext non disponibile — silenzioso */ }
}

/**
 * Singolo beep basso — conferma avvio timer.
 */
export function playTimerStart(): void {
  try {
    beep({ frequency: 440, duration: 0.1, volume: 0.3 });
  } catch { /* silenzioso */ }
}

/**
 * Due beep medi — avanzamento passo CookingMode.
 */
export function playStepAdvance(): void {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    beep({ frequency: 660, duration: 0.08, volume: 0.25, startAt: now });
    beep({ frequency: 880, duration: 0.08, volume: 0.25, startAt: now + 0.15 });
  } catch { /* silenzioso */ }
}

/**
 * Arpeggio ascendente — ricetta completata.
 * Do–Mi–Sol–Do8
 */
export function playRecipeComplete(): void {
  try {
    const ctx   = getCtx();
    const now   = ctx.currentTime;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      beep({
        frequency: freq,
        duration:  i === notes.length - 1 ? 0.4 : 0.15,
        volume:    0.35,
        startAt:   now + i * 0.18,
      });
    });
  } catch { /* silenzioso */ }
}

// ─── Utilità ──────────────────────────────────────────────────────────────────

export function isAudioSupported(): boolean {
  return typeof window !== "undefined" && "AudioContext" in window;
}

/**
 * Chiama al primo tap/click per sbloccare AudioContext su iOS/Safari.
 * Riproduce un buffer vuoto — sufficiente a sbloccare il context.
 */
export function unlockAudio(): void {
  try {
    const ctx = getCtx();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  } catch { /* silenzioso */ }
}
