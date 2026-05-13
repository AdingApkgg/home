/**
 * Static client config.
 *
 * IMPORTANT: every field MUST reference `import.meta.env.VITE_X` as a literal
 * member expression. Vite replaces these at build time only when the key is
 * statically analyzable — dynamic indexing (`import.meta.env[name]`) is left
 * as a runtime read against an empty object in production bundles.
 */
const pick = (value: string | undefined, fallback: string) =>
  value && value.length > 0 ? value : fallback;

export const siteConfig = {
  version: "5.0.0",
  author: "Asuna",
  github: "https://github.com/AdingApkgg/home",
  home: "https://saop.cc",

  siteName: pick(import.meta.env.VITE_SITE_NAME, "定の栈"),
  siteAuthor: pick(import.meta.env.VITE_SITE_AUTHOR, "Asuna"),
  siteKeywords: pick(import.meta.env.VITE_SITE_KEYWORDS, "Asuna,个人主页"),
  siteDes: pick(import.meta.env.VITE_SITE_DES, "LINK START!"),
  siteUrl: pick(import.meta.env.VITE_SITE_URL, "saop.cc"),
  siteLogo: pick(import.meta.env.VITE_SITE_LOGO, "/images/icon/favicon.ico"),
  siteMainLogo: pick(import.meta.env.VITE_SITE_MAIN_LOGO, "/images/icon/logo.png"),
  siteAppleLogo: pick(import.meta.env.VITE_SITE_APPLE_LOGO, "/images/icon/apple-touch-icon.png"),
  siteOgImage: pick(import.meta.env.VITE_SITE_OG_IMAGE, "/images/icon/512.png"),
  siteThemeColor: pick(import.meta.env.VITE_SITE_THEME_COLOR, "#424242"),

  descHello: pick(import.meta.env.VITE_DESC_HELLO, "Hello World !"),
  descText: pick(import.meta.env.VITE_DESC_TEXT, "一个建立于 21 世纪的小站，存活于互联网的边缘"),
  descHelloOther: pick(import.meta.env.VITE_DESC_HELLO_OTHER, "Oops !"),
  descTextOther: pick(import.meta.env.VITE_DESC_TEXT_OTHER, "哎呀，这都被你发现了（ 再点击一次可关闭 ）"),

  siteStart: pick(import.meta.env.VITE_SITE_START, "2023-01-06"),
  siteIcp: import.meta.env.VITE_SITE_ICP ?? "",
  siteIcpUrl: pick(import.meta.env.VITE_SITE_ICP_URL, "https://beian.miit.gov.cn"),

  songApi: pick(import.meta.env.VITE_SONG_API, "https://meting-api.saop.cc/api"),
  songServer: pick(import.meta.env.VITE_SONG_SERVER, "netease"),
  songType: pick(import.meta.env.VITE_SONG_TYPE, "playlist"),
  songId: pick(import.meta.env.VITE_SONG_ID, "8464409595"),

  bgLocalCount: Number(import.meta.env.VITE_BG_LOCAL_COUNT) || 10,
  bgBingUrl: import.meta.env.VITE_BG_BING_URL ?? "",
  bgSceneryUrl: import.meta.env.VITE_BG_SCENERY_URL ?? "",
  bgAnimeUrl: import.meta.env.VITE_BG_ANIME_URL ?? "",

  artalkServer: import.meta.env.VITE_ARTALK_SERVER ?? "",
  artalkSite: import.meta.env.VITE_ARTALK_SITE ?? "",

  bszApi: pick(import.meta.env.VITE_BSZ_API, "https://bsz.saop.cc/api"),
};

export type SiteConfig = typeof siteConfig;
