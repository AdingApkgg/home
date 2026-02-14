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
      runtimeCaching: [
        {
          urlPattern: /\.(js|css|woff2|woff|ttf)$/,
          handler: "CacheFirst",
          options: { cacheName: "js-css-cache" },
        },
        {
          urlPattern: /\.(png|jpe?g|svg|gif|bmp|webp)$/,
          handler: "CacheFirst",
          options: { cacheName: "image-cache" },
        },
      ],
    },
  },

  // CSS
  css: [
    "@fontsource/noto-sans-sc/400.css",
    "@fontsource/noto-sans-sc/700.css",
    "swiper/css",
    "~/assets/style/main.scss",
  ],

  // Vite 配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/style/global.scss";`,
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
        },
      },
    },
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
    output: {
      dir: "dist",
      publicDir: "dist",
    },
  },
});
