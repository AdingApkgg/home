English | [Chinese](./README.md)

<p>
<strong><h2>Homepage</h2></strong>
Simple little homepage, had enough of the original one and made a new one
</p>

![Homepage](/screenshots/main.jpg)

> **Fork Notice**: This project is forked from [imsyy/home](https://github.com/imsyy/home). Since the original author has stopped maintaining it, this repository is independently maintained and actively updated. Key changes include:
>
> - Framework migrated from Vue + Vite to **Nuxt 4** (SPA mode)
> - Fully migrated to **TypeScript**
> - Icons migrated from xicons / IconPark to **Lucide**
> - Fonts changed from external CDN to **@fontsource/noto-sans-sc** (locally loaded)
> - Weather API changed from Amap to **wttr.in** (supports IPv6 and overseas)
> - Added **OG / Twitter Card** social sharing meta tags
> - Environment variables unified to `NUXT_PUBLIC_*` prefix
> - SPA loading template inlined into HTML to eliminate white screen

> The homepage logo font has been compressed. Letters other than the site logo will fall back to the default font. You can replace it with `Pacifico-Regular-all.ttf` in the font directory.

### Demo

- [定の栈](https://saop.cc)

### Features

### Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Nuxt 4](https://nuxt.com/) (SPA mode) |
| Language | TypeScript |
| UI Components | [Element Plus](https://element-plus.org/) |
| State Management | [Pinia](https://pinia.vuejs.org/) + persistedstate |
| Icons | [Lucide](https://lucide.dev/icons) |
| Music | [APlayer](https://aplayer.js.org/) |
| Fonts | [Noto Sans SC](https://fontsource.org/fonts/noto-sans-sc) (via @fontsource) |
| PWA | [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt) |
| Linting | [ESLint](https://eslint.org/) + [@nuxt/eslint](https://eslint.nuxt.com/) |

### Features

- [x] Loading animation
- [x] Site description
- [x] Hitokoto (random quotes)
- [x] Date and time
- [x] Live weather (wttr.in, supports IPv6 and overseas)
- [x] Time progress bar
- [x] Music player
- [x] Mobile adaptation
- [x] PWA support
- [x] OG / Twitter Card social sharing
- [x] Strict ESLint code checking
- [x] SPA loading template (no white screen)
- [x] Code splitting & lazy loading

### Deployment

#### Manual Deployment

- Install [Node.js](https://nodejs.org/) (>= 22) and [pnpm](https://pnpm.io/)

```bash
# Install dependencies
pnpm install

# Development preview
pnpm dev

# Build static files
pnpm build
```

> After building, static files are generated in the `dist` directory and can be uploaded to any static hosting platform (Vercel, Cloudflare Pages, Netlify, etc.)

#### Podman / Docker Deployment

```bash
# Using Podman Compose
podman compose up -d

# Or build manually with Podman
podman build -t home .
podman run -p 12445:12445 -d home

# Docker users can use the same commands
docker compose up -d
```

#### Vercel Deployment

1. Fork this repository to your GitHub account
2. Import the project in Vercel
3. Add environment variables in Settings → Environment Variables (see `.env.example`)
4. Click Deploy

#### Netlify Deployment

1. Fork this repository to your GitHub account
2. In [Netlify](https://app.netlify.com/), click **Add new site → Import an existing project**
3. Select your GitHub repository
4. Build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
5. Add environment variables in **Site configuration → Environment variables** (see `.env.example`)
6. Click Deploy

> The project includes a `public/_redirects` file for SPA routing support

#### Cloudflare Pages Deployment

1. Fork this repository to your GitHub account
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages → Create → Pages → Connect to Git**
3. Select your GitHub repository
4. Build settings:
   - **Framework preset**: `Nuxt.js`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Node.js version**: `22` (add `NODE_VERSION = 22` in Environment variables)
5. Add other environment variables from `.env.example`
6. Click Save and Deploy

### Configuration

All configuration is managed through the `.env` file using the `NUXT_PUBLIC_*` prefix. See [.env.example](./.env.example) for all available options.

#### Weather

Uses [wttr.in](https://wttr.in/) API with automatic IP-based location detection. Supports IPv6 and overseas access. No API key required.

#### Music

APlayer music player based on MetingJS. Configure song parameters in `.env` to customize the playlist.

#### Website Links

Edit `app/assets/siteLinks.json` to customize. Icons are from [Lucide Icons](https://lucide.dev/icons). Map icon names in `app/components/Links.vue`.

#### Social Links

Edit `app/assets/socialLinks.json` to customize.

### API

- [wttr.in](https://wttr.in/) - Weather
- [Hitokoto](https://hitokoto.cn/) - Random quotes
- [MetingJS API](https://github.com/xizeyoupan/Meting-API) - Music playlist
