import pkg from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // SPA 模式
  ssr: false,

  // 兼容性日期
  compatibilityDate: "2026-01-01",

  // 开发工具
  devtools: { enabled: false },

  // 模块
  modules: [
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vite-pwa/nuxt",
    "@nuxt/eslint",
  ],

  // ESLint 配置
  eslint: {
    config: {
      stylistic: false,
    },
  },

  // 应用配置 (通过 useAppConfig() 访问)
  appConfig: {
    version: pkg.version,
    author: pkg.author,
    github: (pkg as Record<string, string>).github,
    home: (pkg as Record<string, string>).home,
  },

  // 运行时配置 (通过 useRuntimeConfig() 访问)
  // 环境变量 NUXT_PUBLIC_* 自动映射 (SNAKE_CASE → camelCase)
  runtimeConfig: {
    public: {
      siteName: "定の栈",
      siteAuthor: "Asuna",
      siteKeywords: "Asuna,个人主页",
      siteDes: "LINK START!",
      siteUrl: "saop.cc",
      siteLogo: "/images/icon/favicon.ico",
      siteMainLogo: "/images/icon/logo.png",
      siteAppleLogo: "/images/icon/apple-touch-icon.png",
      siteOgImage: "/images/icon/512.png",
      siteThemeColor: "#424242",
      descHello: "Hello World !",
      descText: "一个建立于 21 世纪的小站，存活于互联网的边缘",
      descHelloOther: "Oops !",
      descTextOther: "哎呀，这都被你发现了（ 再点击一次可关闭 ）",
      siteStart: "2023-01-06",
      siteIcp: "",
      siteIcpUrl: "https://beian.miit.gov.cn",
      songApi: "https://meting-api.saop.cc/api",
      songServer: "netease",
      songType: "playlist",
      songId: "8464409595",
      bgLocalCount: "10",
      bgBingUrl: "",
      bgSceneryUrl: "",
      bgAnimeUrl: "",
      // 全局设置默认值 (用户修改后以 localStorage 为准)
      defaultCoverType: "0",
      defaultSiteStartShow: "false",
      defaultMusicClick: "false",
      defaultPlayerLrcShow: "true",
      defaultFooterBlur: "true",
      defaultPlayerAutoplay: "false",
      defaultPlayerLoop: "all",
      defaultPlayerOrder: "list",
      artalkServer: "",
      artalkSite: "",
    },
  },

  // Pinia 持久化
  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  // PWA 配置
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "定の栈",
      short_name: "定の栈",
      description: "LINK START!",
      display: "standalone",
      start_url: "/",
      theme_color: "#424242",
      background_color: "#424242",
      icons: [
        { src: "/images/icon/48.png", sizes: "48x48", type: "image/png" },
        { src: "/images/icon/72.png", sizes: "72x72", type: "image/png" },
        { src: "/images/icon/96.png", sizes: "96x96", type: "image/png" },
        { src: "/images/icon/128.png", sizes: "128x128", type: "image/png" },
        { src: "/images/icon/144.png", sizes: "144x144", type: "image/png" },
        { src: "/images/icon/192.png", sizes: "192x192", type: "image/png" },
        { src: "/images/icon/512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        // 静态资源 - 缓存优先
        {
          urlPattern: /\.(js|css)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "static-assets",
            expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
          },
        },
        // 图片 - 缓存优先
        {
          urlPattern: /\.(png|jpe?g|svg|gif|bmp|webp|avif|ico)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "image-cache",
            expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
          },
        },
        // 字体文件 - 超长缓存
        {
          urlPattern: /\.(woff2?|ttf)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "font-cache",
            expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
          },
        },
        // 音乐 API - StaleWhileRevalidate，快速响应同时后台更新
        {
          urlPattern: /^https:\/\/meting-api\.saop\.cc\/.*/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "music-api-cache",
            expiration: { maxEntries: 5, maxAgeSeconds: 24 * 60 * 60 },
          },
        },
        // 第三方数据 API - 网络优先，离线回退缓存
        {
          urlPattern: /^https:\/\/(v1\.hitokoto\.cn|ipapi\.co|api\.open-meteo\.com)\/.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 },
          },
        },
        // bsz 计数器 - 仅走网络，不缓存
        {
          urlPattern: /^https:\/\/bsz\.saop\.cc\/.*/,
          handler: "NetworkOnly",
        },
      ],
    },
  },

  // 资源提示 - DNS 预解析 & 预连接
  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://bsz.saop.cc", crossorigin: "" },
        { rel: "preconnect", href: "https://v1.hitokoto.cn", crossorigin: "" },
        { rel: "preconnect", href: "https://ipapi.co", crossorigin: "" },
        { rel: "preconnect", href: "https://api.open-meteo.com", crossorigin: "" },
        { rel: "preconnect", href: "https://meting-api.saop.cc", crossorigin: "" },
        { rel: "preconnect", href: "https://artalk.saop.cc", crossorigin: "" },
      ],
    },
  },

  // CSS (字体异步加载，不放在关键路径)
  css: [
    "swiper/css",
    "~/assets/style/main.scss",
  ],

  // Vite 配置
  vite: {
    optimizeDeps: {
      include: [
        "dayjs",
        "dayjs/plugin/*.js",
        "lodash-unified",
        "lucide-vue-next",
        "swiper/vue",
        "swiper/modules",
        "fetch-jsonp",
        "@worstone/vue-aplayer",
      ],
    },
    esbuild: {
      pure: ["console.log"],
      drop: ["debugger"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/style/global.scss";`,
        },
      },
    },
    build: {
      // 代码分割 - 拆分大型依赖为独立 chunk，支持并行加载和独立缓存
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("element-plus")) return "element-plus";
            if (id.includes("swiper")) return "swiper";
            if (id.includes("aplayer") || id.includes("vue-aplayer")) return "aplayer";
            if (id.includes("lucide-vue-next")) return "lucide";
            if (id.includes("fontsource")) return "fonts";
            if (id.includes("artalk")) return "artalk";
          },
        },
      },
    },
  },

  // 实验性功能
  experimental: {
    // SPA 无需 payload
    payloadExtraction: false,
  },

  // 开发服务器
  devServer: {
    port: 3000,
  },

  // 自动导入
  imports: {
    dirs: ["stores"],
  },

  // 生成配置
  nitro: {
    // 预压缩静态资源 (gzip + brotli)
    compressPublicAssets: true,
    output: {
      dir: "dist",
      publicDir: "dist",
    },
  },
});
