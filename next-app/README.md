# home-next

Next.js 15 (SPA static export) + Turbopack + Radix UI + shadcn/ui + Tailwind + Framer Motion + Zustand 重写版本。

## 技术栈

- **Next.js 15**（`output: "export"` 纯 SPA 静态产物）+ **Turbopack**（`next dev --turbo`）
- **Radix UI** primitives + **shadcn/ui** 风格组件（`src/components/ui/`）
- **Tailwind CSS 3**（主题 CSS 变量；浅色/深色跟随系统）
- **Framer Motion**（过渡/动画）
- **Lucide React**（图标）
- **Zustand** + `persist`（状态 + 本地持久化，对齐原 Pinia store）
- **自实现音乐播放器**（`MusicEngine` + `PlaylistView`，替代 APlayer）
- **Artalk** 动态 import（留言板）
- **Serwist**（`serwist` + `@serwist/cli`，PWA / Service Worker，运行时缓存）

## 功能一一对应

| 原组件                | 新实现                                      |
| -------------------- | ------------------------------------------- |
| `AppLoading`         | `components/app-loading.tsx`                |
| `AppBackground`      | `components/app-background.tsx`（带超时回退本地壁纸）|
| `AppFooter`          | `components/app-footer.tsx`                 |
| `MainLeft/Right`     | 同名组件                                    |
| `Message`            | `components/message.tsx`（不蒜子 pv/uv）    |
| `SocialLinks`        | `components/social-links.tsx`               |
| `FuncArea`           | `components/func-area.tsx`                  |
| `Hitokoto`           | `components/hitokoto.tsx`                   |
| `Weather`            | `components/weather.tsx`                    |
| `MusicPlayer/Panel`  | `components/music-player.tsx` + `music-panel.tsx` |
| `Links`              | `components/links.tsx`（Embla 替代 Swiper） |
| `BoxPanel`           | `components/box-panel.tsx`                  |
| `TimeCapsule`        | `components/time-capsule.tsx`               |
| `MoreContent/Set`    | `components/more-content.tsx` + `more-set.tsx` |
| `SettingsPanel`      | `components/settings-panel.tsx`（**新增主题切换**）|
| `MobileActionBar`    | `components/mobile-action-bar.tsx`          |
| `CommentsPanel`      | `components/comments-panel.tsx`             |

## 新增

- **主题色**：设置面板可切，共 12 种（zinc/slate/stone/gray/neutral/red/rose/orange/green/blue/yellow/violet），默认随机（每次打开刷新）；开关可切换「跟随随机 / 指定」；持久化到 localStorage。
- **浅色/深色**：跟随系统 `prefers-color-scheme`，无需用户选择。

## 环境变量

复制 `.env.example` 为 `.env.local` 后按需修改。所有变量都用 `NEXT_PUBLIC_` 前缀。

## 启动

```bash
cd next-app
pnpm install            # or npm / yarn / bun
pnpm dev                # next dev --turbo
pnpm build              # next build -> out/ (静态产物)
```

## 部署

`pnpm build` 生成 `out/` 目录，可直接托管到任何静态服务器（Vercel / Netlify / Cloudflare Pages / Nginx）。

## 与 `app/`（旧 Nuxt 版本）共存

- `public/` 通过符号链接复用（`next-app/public -> ../public`），图标/壁纸/字体一份数据两端共用。
- 旧 Nuxt 工程保留，方便对比验收；验收后可安全删除 `app/` 与根目录 Nuxt 配置。
