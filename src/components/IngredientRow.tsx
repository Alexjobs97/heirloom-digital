/**
 * IngredientRow.tsx — Riga ingrediente con checkbox mise en place e qty scalata.
 */

import { useCallback } from "react";
import type { Ingredient } from "../types";
import { toDisplayQty, scaleQty } from "../lib/scaling";

interface IngredientRowProps {
  ingredient: Ingredient;
  baseYield: number;
  targetYield: number;
  onToggle?: (id: string) => void;
  /** Se true, mostra riga attenuata quando checked */
  showCheck?: boolean;
}

export default function IngredientRow({
  ingredient,
  baseYield,
  targetYield,
  onToggle,
  showCheck = true,
}: IngredientRowProps) {
  const handleToggle = useCallback(() => {
    onToggle?.(ingredient.id);
  }, [onToggle, ingredient.id]);

  const scaled = scaleQty(ingredient.qty, baseYield, targetYield);

  let qtyDisplay = "";
  if (typeof scaled === "string") {
    qtyDisplay = scaled; // "q.b."
  } else if (scaled > 0) {
    qtyDisplay = toDisplayQty(scaled);
  }

  const checked  = !!ingredient.checked;
  const dimmed   = showCheck && checked;

  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: showCheck ? "20px 1fr" : "1fr",
        gap: "0.65rem",
        alignItems: "start",
        padding: "0.45rem 0",
        borderBottom: "1px solid var(--border)",
        opacity: dimmed ? 0.4 : 1,
        transition: "opacity 0.2s",
        listStyle: "none",
      }}
    >
      {/* Checkbox */}
      {showCheck && (
        <input
          type="checkbox"
          className="ingredient-checkbox"
          checked={checked}
          onChange={handleToggle}
          aria-label={`Segna ${ingredient.displayName} come preparato`}
          style={{ marginTop: "0.15rem" }}
        />
      )}

      {/* Contenuto */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: "0.35rem",
        flexWrap: "wrap",
        lineHeight: 1.4,
      }}>
        {/* Quantità */}
        {qtyDisplay && (
          <span style={{
            fontWeight: 700,
            color: dimmed ? "var(--text-muted)" : "var(--brand)",
            fontFamily: "var(--font-serif)",
            fontSize: "1rem",
            whiteSpace: "nowrap",
          }}>
            {qtyDisplay}
          </span>
        )}

        {/* Unità */}
        {ingredient.unit && (
          <span style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
          }}>
            {ingredient.unit}
          </span>
        )}

        {/* Nome */}
        <span style={{
          fontSize: "0.9375rem",
          color: dimmed ? "var(--text-muted)" : "var(--text-primary)",
          textDecoration: dimmed ? "line-through" : "none",
        }}>
          {ingredient.displayName}
        </span>

        {/* Nota opzionale */}
        {ingredient.note && (
          <span style={{ fontSize: "0.825rem", color: "var(--text-muted)", fontStyle: "italic" }}>
            ({ingredient.note})
          </span>
        )}
      </div>
    </li>
  );
}
