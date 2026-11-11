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
    rollupOptions: {
      output: {
        // 拆包：框架与 UI 各自成块，首屏并行下载、后续版本可复用缓存。
        manualChunks: (id: string) => {
          if (!id.includes("node_modules")) return;
          // 懒加载依赖留给各自的动态 chunk，不并进首屏 vendors。
          if (/node_modules\/artalk\//.test(id)) return;
          // three 只被星尘层的动态 chunk 用到，同理留在自己的块里。
          if (/node_modules\/three\//.test(id)) return;
          if (/node_modules\/(react|react-dom)\//.test(id)) return "react";
          if (id.includes("@radix-ui")) return "ui";
          return "vendors";
        },
      },
    },
  },
});
