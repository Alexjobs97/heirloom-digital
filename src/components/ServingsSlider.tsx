/**
 * ServingsSlider.tsx — Slider porzioni con controlli +/- e display live.
 */

import { useCallback } from "react";
import { clampServings } from "../lib/scaling";

interface ServingsSliderProps {
  value: number;
  baseYield: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}

export default function ServingsSlider({
  value,
  baseYield,
  onChange,
  min = 1,
  max = 20,
}: ServingsSliderProps) {
  const dec = useCallback(() => onChange(clampServings(value - 1)), [value, onChange]);
  const inc = useCallback(() => onChange(clampServings(value + 1)), [value, onChange]);

  const label = value === 1 ? "1 porzione" : `${value} porzioni`;
  const isBase = value === baseYield;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Bottone − */}
        <button
          onClick={dec}
          disabled={value <= min}
          aria-label="Riduci porzioni"
          style={{
            width: 36, height: 36,
            borderRadius: "50%",
            border: "1.5px solid var(--border)",
            background: "var(--bg-card)",
            color: value <= min ? "var(--text-muted)" : "var(--text-primary)",
            cursor: value <= min ? "not-allowed" : "pointer",
            fontSize: "1.25rem",
            lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "border-color 0.15s",
            flexShrink: 0,
          }}
        >
          −
        </button>

        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(clampServings(parseInt(e.target.value)))}
          aria-label="Numero di porzioni"
          style={{ flex: 1 }}
        />

        {/* Bottone + */}
        <button
          onClick={inc}
          disabled={value >= max}
          aria-label="Aumenta porzioni"
          style={{
            width: 36, height: 36,
            borderRadius: "50%",
            border: "1.5px solid var(--border)",
            background: "var(--bg-card)",
            color: value >= max ? "var(--text-muted)" : "var(--text-primary)",
            cursor: value >= max ? "not-allowed" : "pointer",
            fontSize: "1.25rem",
            lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "border-color 0.15s",
            flexShrink: 0,
          }}
        >
          +
        </button>
      </div>

      {/* Label + reset */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--brand)",
          fontFamily: "var(--font-serif)",
        }}>
          {label}
        </span>

        {!isBase && (
          <button
            onClick={() => onChange(baseYield)}
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Ripristina ({baseYield})
          </button>
        )}
      </div>
    </div>
  );
}
