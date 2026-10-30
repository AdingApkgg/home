import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "@/App";
import { Toaster } from "@/components/toaster";
import { useMain } from "@/store/main";
import "./globals.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

const tree = (
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
);

// 构建时预渲染过首屏（root 里已有静态内容）→ 复用这份 DOM 做 hydration，避免闪白。
if (root.childElementCount > 0) {
  // 预渲染的首屏是"壁纸已就绪"状态，hydration 前把同一个标记打上，免得整棵子树重渲染。
  useMain.setState({ imgLoaded: true });
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
