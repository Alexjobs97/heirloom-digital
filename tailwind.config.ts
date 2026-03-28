import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // ── Palette principale: toni terra e caldi ───────────────────────────
        cream:     {
          50:  "#fefcf8",
          100: "#faf7f2",
          200: "#f4ede0",
          300: "#e8d9c4",
          400: "#d9c0a0",
        },
        terra:     {
          50:  "#fdf1ea",
          100: "#f9d9c5",
          200: "#f0b08a",
          300: "#e07d4a",
          400: "#c95e28",
          500: "#b5541e",   // ← colore principale brand
          600: "#943f14",
          700: "#702e0d",
          800: "#4e1f09",
          900: "#2e1106",
        },
        bark:      {
          50:  "#f7f3ee",
          100: "#e8ddd0",
          200: "#cdb89e",
          300: "#b09070",
          400: "#8c6d4f",
          500: "#6e5238",
          600: "#543f2a",
          700: "#3d2d1d",
          800: "#271c11",
          900: "#150e07",
        },
        sage:      {
          50:  "#f3f6f0",
          100: "#dde8d6",
          200: "#b8ceab",
          300: "#8daf7b",
          400: "#668f52",
          500: "#4a7039",
          600: "#38562b",
          700: "#283d1e",
          800: "#1a2713",
          900: "#0d140a",
        },
        // ── Tonalità neutre ──────────────────────────────────────────────────
        stone:     {
          50:  "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },

      fontFamily: {
        sans:  ["'Lato'", "system-ui", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
        mono:  ["'JetBrains Mono'", "monospace"],
      },

      fontSize: {
        // Scala tipografica per la modalità Cucina (leggibile a distanza)
        "cooking-sm": ["1.125rem", { lineHeight: "1.6" }],
        "cooking-md": ["1.5rem",   { lineHeight: "1.5" }],
        "cooking-lg": ["2rem",     { lineHeight: "1.4" }],
        "cooking-xl": ["2.5rem",   { lineHeight: "1.3" }],
      },

      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top":    "env(safe-area-inset-top)",
      },

      borderRadius: {
        "xl":  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        card:    "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.10), 0 2px 4px -1px rgb(0 0 0 / 0.06)",
        warm:    "0 2px 8px 0 rgb(181 84 30 / 0.15)",
      },

      animation: {
        "fade-in":    "fadeIn 0.2s ease-out",
        "slide-up":   "slideUp 0.25s ease-out",
        "slide-down": "slideDown 0.25s ease-out",
        "spin-slow":  "spin 2s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },

  plugins: [],
} satisfies Config;
