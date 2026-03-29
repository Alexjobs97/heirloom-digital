import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

// Applica dark mode prima del primo render per evitare FOUC
try {
  const saved = localStorage.getItem("heirloom_dark");
  if (saved === "true") document.documentElement.classList.add("dark");
} catch {
  // localStorage non disponibile (es. Firefox strictmode)
}

const rootEl = document.getElementById("root");

if (!rootEl) {
  document.body.innerHTML =
    '<p style="font-family:sans-serif;padding:2rem;color:#991b1b">Elemento #root non trovato.</p>';
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
