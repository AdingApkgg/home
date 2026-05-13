import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { serwist } from "@serwist/vite";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      globPatterns: [
        "**/*.html",
        "assets/**/*.{js,css}",
        "favicon.ico",
        "manifest.webmanifest",
      ],
      globIgnores: ["**/sw.js", "**/sw.js.map"],
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
