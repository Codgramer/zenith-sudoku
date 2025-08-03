import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      manifest: {
        name: "Zenith Sudoku",
        short_name: "Zenith",
        description: "A modern, open-source Sudoku game with multiple difficulty levels, smart hints, and progress tracking.",
        theme_color: "#4C51BF",
        background_color: "#F0F4F8",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
}));