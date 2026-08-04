import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Vite 8 resolves tsconfig `paths` natively (replaces vite-tsconfig-paths).
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
  },
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
