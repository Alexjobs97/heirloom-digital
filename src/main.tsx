import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

// Applica la classe PRIMA del primo render per evitare FOUC.
// :root è dark by default. Aggiunge .light se l'utente ha scelto day mode.
try {
  const saved = localStorage.getItem("heirloom_dark");
  if (saved === "false") {
    document.documentElement.classList.add("light");
  }
  // Rimuovi la vecchia classe "dark" se presente da versioni precedenti
  document.documentElement.classList.remove("dark");
} catch {
  // localStorage non disponibile
}

const rootEl = document.getElementById("root");

if (!rootEl) {
  document.body.innerHTML = '<p style="font-family:sans-serif;padding:2rem;color:#991b1b">Elemento #root non trovato.</p>';
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
