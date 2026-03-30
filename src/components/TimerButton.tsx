/**
 * TimerButton.tsx v2 — Apre un timer Google esterno nella stessa tab.
 * Il timer sopravvive alla navigazione tra i passi.
 */

/** Apre Google Timer in una nuova tab con la durata specificata */
function openGoogleTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  // Google search query che attiva il timer integrato
  const query = s > 0 ? `${m} minute ${s} second timer` : `${m} minute timer`;
  window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank", "noopener");
}

function minuteLabel(s: number): string {
  const m = Math.round(s / 60);
  return m === 1 ? "1 min" : `${m} min`;
}

interface TimerButtonProps {
  label: string;
  durationSeconds: number;
}

export default function TimerButton({ label, durationSeconds }: TimerButtonProps) {
  return (
    <button
      className="timer-btn"
      onClick={() => openGoogleTimer(durationSeconds)}
      title={`Apri timer: ${minuteLabel(durationSeconds)}`}
      style={{ cursor: "pointer" }}
    >
      ⏱ {minuteLabel(durationSeconds)}
      <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>↗</span>
    </button>
  );
}
