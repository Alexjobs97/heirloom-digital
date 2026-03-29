/**
 * ErrorBoundary.tsx — Cattura errori React e mostra un messaggio utile.
 * Indispensabile in produzione per non avere schermate bianche mute.
 */

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Heirloom] Errore catturato:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const msg = this.state.error.message;

    return (
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        background: "#faf7f2",
      }}>
        <div style={{
          maxWidth: 500,
          background: "#fff",
          border: "1px solid #e7e5e4",
          borderRadius: 14,
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}>
          <p style={{ fontSize: "2.5rem", margin: "0 0 1rem" }}>⚠️</p>
          <h2 style={{ margin: "0 0 0.5rem", color: "#1c1917", fontFamily: "Georgia, serif" }}>
            Qualcosa è andato storto
          </h2>
          <p style={{ color: "#57534e", marginBottom: "1.25rem", fontSize: "0.9rem", lineHeight: 1.6 }}>
            L'app ha incontrato un errore imprevisto. Apri la console del browser (F12) per i dettagli.
          </p>
          {msg && (
            <pre style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "0.75rem",
              fontSize: "0.8rem",
              color: "#991b1b",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              marginBottom: "1.25rem",
            }}>
              {msg}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#b5541e",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.6rem 1.25rem",
              fontSize: "0.9375rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Ricarica la pagina
          </button>
        </div>
      </div>
    );
  }
}
