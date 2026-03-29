import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  // Cambia questo con il nome del tuo repository GitHub
  // Es: se il repo si chiama "my-recipes" → base: "/my-recipes/"
  base: "/heirloom-digital/",

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "icon-*.png"],

      manifest: {
        name: "The Heirloom Digital",
        short_name: "Heirloom",
        description: "Il tuo libro di ricette di famiglia, digitale.",
        theme_color: "#b5541e",
        background_color: "#faf7f2",
        display: "standalone",
        orientation: "portrait",
        start_url: ".",
        lang: "it",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        // Pre-cacha tutto il bundle
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // Cache-first per asset statici
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: "CacheFirst",
            options: {
              cacheName: "fonts",
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },

      // Genera il service worker durante la build
      devOptions: {
        enabled: false, // disattiva in dev per non interferire con HMR
      },
    }),
  ],

  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Chunk separato per react — migliora il caching
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
