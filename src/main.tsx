import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Applica dark mode prima del primo render per evitare FOUC
const saved = localStorage.getItem("heirloom_dark");
if (saved === "true") document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
