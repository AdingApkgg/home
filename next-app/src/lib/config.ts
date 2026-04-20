const env = (key: string, fallback = "") =>
  (process.env[`NEXT_PUBLIC_${key}`] as string | undefined) ?? fallback;

export const siteConfig = {
  version: "5.0.0",
  author: "Asuna",
  github: "https://github.com/AdingApkgg/home",
  home: "https://saop.cc",

  siteName: env("SITE_NAME", "定の栈"),
  siteAuthor: env("SITE_AUTHOR", "Asuna"),
  siteKeywords: env("SITE_KEYWORDS", "Asuna,个人主页"),
  siteDes: env("SITE_DES", "LINK START!"),
  siteUrl: env("SITE_URL", "saop.cc"),
  siteLogo: env("SITE_LOGO", "/images/icon/favicon.ico"),
  siteMainLogo: env("SITE_MAIN_LOGO", "/images/icon/logo.png"),
  siteAppleLogo: env("SITE_APPLE_LOGO", "/images/icon/apple-touch-icon.png"),
  siteOgImage: env("SITE_OG_IMAGE", "/images/icon/512.png"),
  siteThemeColor: env("SITE_THEME_COLOR", "#424242"),

  descHello: env("DESC_HELLO", "Hello World !"),
  descText: env("DESC_TEXT", "一个建立于 21 世纪的小站，存活于互联网的边缘"),
  descHelloOther: env("DESC_HELLO_OTHER", "Oops !"),
  descTextOther: env("DESC_TEXT_OTHER", "哎呀，这都被你发现了（ 再点击一次可关闭 ）"),

  siteStart: env("SITE_START", "2023-01-06"),
  siteIcp: env("SITE_ICP", ""),
  siteIcpUrl: env("SITE_ICP_URL", "https://beian.miit.gov.cn"),

  songApi: env("SONG_API", "https://meting-api.saop.cc/api"),
  songServer: env("SONG_SERVER", "netease"),
  songType: env("SONG_TYPE", "playlist"),
  songId: env("SONG_ID", "8464409595"),

  bgLocalCount: Number(env("BG_LOCAL_COUNT", "10")) || 10,
  bgBingUrl: env("BG_BING_URL", ""),
  bgSceneryUrl: env("BG_SCENERY_URL", ""),
  bgAnimeUrl: env("BG_ANIME_URL", ""),

  artalkServer: env("ARTALK_SERVER", ""),
  artalkSite: env("ARTALK_SITE", ""),
};

export type SiteConfig = typeof siteConfig;
