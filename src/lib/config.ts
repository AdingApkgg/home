/**
 * Static client config.
 *
 * IMPORTANT: every field MUST reference `process.env.NEXT_PUBLIC_X` as a
 * literal expression. Next.js inlines these at build time only when the key
 * is statically analyzable — `process.env[`NEXT_PUBLIC_${key}`]` would be
 * left as a runtime read, which silently returns `undefined` in client
 * bundles and causes every value to fall back to its default.
 */
const pick = (value: string | undefined, fallback: string) =>
  value && value.length > 0 ? value : fallback;

export const siteConfig = {
  version: "5.0.0",
  author: "Asuna",
  github: "https://github.com/AdingApkgg/home",
  home: "https://saop.cc",

  siteName: pick(process.env.NEXT_PUBLIC_SITE_NAME, "定の栈"),
  siteAuthor: pick(process.env.NEXT_PUBLIC_SITE_AUTHOR, "Asuna"),
  siteKeywords: pick(process.env.NEXT_PUBLIC_SITE_KEYWORDS, "Asuna,个人主页"),
  siteDes: pick(process.env.NEXT_PUBLIC_SITE_DES, "LINK START!"),
  siteUrl: pick(process.env.NEXT_PUBLIC_SITE_URL, "saop.cc"),
  siteLogo: pick(process.env.NEXT_PUBLIC_SITE_LOGO, "/images/icon/favicon.ico"),
  siteMainLogo: pick(process.env.NEXT_PUBLIC_SITE_MAIN_LOGO, "/images/icon/logo.png"),
  siteAppleLogo: pick(process.env.NEXT_PUBLIC_SITE_APPLE_LOGO, "/images/icon/apple-touch-icon.png"),
  siteOgImage: pick(process.env.NEXT_PUBLIC_SITE_OG_IMAGE, "/images/icon/512.png"),
  siteThemeColor: pick(process.env.NEXT_PUBLIC_SITE_THEME_COLOR, "#424242"),

  descHello: pick(process.env.NEXT_PUBLIC_DESC_HELLO, "Hello World !"),
  descText: pick(process.env.NEXT_PUBLIC_DESC_TEXT, "一个建立于 21 世纪的小站，存活于互联网的边缘"),
  descHelloOther: pick(process.env.NEXT_PUBLIC_DESC_HELLO_OTHER, "Oops !"),
  descTextOther: pick(process.env.NEXT_PUBLIC_DESC_TEXT_OTHER, "哎呀，这都被你发现了（ 再点击一次可关闭 ）"),

  siteStart: pick(process.env.NEXT_PUBLIC_SITE_START, "2023-01-06"),
  siteIcp: process.env.NEXT_PUBLIC_SITE_ICP ?? "",
  siteIcpUrl: pick(process.env.NEXT_PUBLIC_SITE_ICP_URL, "https://beian.miit.gov.cn"),

  songApi: pick(process.env.NEXT_PUBLIC_SONG_API, "https://meting-api.saop.cc/api"),
  songServer: pick(process.env.NEXT_PUBLIC_SONG_SERVER, "netease"),
  songType: pick(process.env.NEXT_PUBLIC_SONG_TYPE, "playlist"),
  songId: pick(process.env.NEXT_PUBLIC_SONG_ID, "8464409595"),

  bgLocalCount: Number(process.env.NEXT_PUBLIC_BG_LOCAL_COUNT) || 10,
  bgBingUrl: process.env.NEXT_PUBLIC_BG_BING_URL ?? "",
  bgSceneryUrl: process.env.NEXT_PUBLIC_BG_SCENERY_URL ?? "",
  bgAnimeUrl: process.env.NEXT_PUBLIC_BG_ANIME_URL ?? "",

  artalkServer: process.env.NEXT_PUBLIC_ARTALK_SERVER ?? "",
  artalkSite: process.env.NEXT_PUBLIC_ARTALK_SITE ?? "",

  bszApi: pick(process.env.NEXT_PUBLIC_BSZ_API, "https://bsz.saop.cc/api"),
};

export type SiteConfig = typeof siteConfig;
