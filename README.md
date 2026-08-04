# home

个人主页，Next.js 15 (SPA static export) + Turbopack + Radix UI + shadcn/ui + Tailwind + Framer Motion + Zustand。

## 技术栈

- **Next.js 15**（`output: "export"` 纯 SPA 静态产物）+ **Turbopack**（`next dev --turbo`）
- **Radix UI** primitives + **shadcn/ui** 风格组件（`src/components/ui/`）
- **Tailwind CSS 3**（主题 CSS 变量；浅色 / 深色跟随系统）
- **Framer Motion**（过渡 / 动画）
- **Lucide React**（图标）
- **Zustand** + `persist`（状态 + 本地持久化）
- **自实现音乐播放器**（`MusicEngine` + `PlaylistView`）
- **Artalk** 动态 import（留言板）
- **Serwist**（`serwist` + `@serwist/cli`，PWA / Service Worker，运行时缓存）

## 主题

- **主题色**：设置面板可切，共 12 种（zinc/slate/stone/gray/neutral/red/rose/orange/green/blue/yellow/violet），默认随机（每次打开刷新）；可切换「跟随随机 / 指定」，持久化到 localStorage。
- **浅色 / 深色**：跟随系统 `prefers-color-scheme`，无需用户选择。

## 环境变量

复制 `.env.example` 为 `.env.local` 后按需修改。所有变量都用 `NEXT_PUBLIC_` 前缀。

## 启动

```bash
bun install
bun run dev              # vite
bun run build            # tsc -b && vite build -> dist/
```

## 部署

`bun run build` 生成 `dist/` 目录，可直接托管到任何静态服务器（Vercel / Netlify / Cloudflare Pages / Nginx）。

Docker:

```bash
docker compose up -d
```
