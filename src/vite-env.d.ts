/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME?: string;
  readonly VITE_SITE_AUTHOR?: string;
  readonly VITE_SITE_KEYWORDS?: string;
  readonly VITE_SITE_DES?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_SITE_LOGO?: string;
  readonly VITE_SITE_MAIN_LOGO?: string;
  readonly VITE_SITE_APPLE_LOGO?: string;
  readonly VITE_SITE_OG_IMAGE?: string;
  readonly VITE_SITE_THEME_COLOR?: string;
  readonly VITE_DESC_HELLO?: string;
  readonly VITE_DESC_TEXT?: string;
  readonly VITE_DESC_HELLO_OTHER?: string;
  readonly VITE_DESC_TEXT_OTHER?: string;
  readonly VITE_SITE_START?: string;
  readonly VITE_SITE_ICP?: string;
  readonly VITE_SITE_ICP_URL?: string;
  readonly VITE_SONG_API?: string;
  readonly VITE_SONG_SERVER?: string;
  readonly VITE_SONG_TYPE?: string;
  readonly VITE_SONG_ID?: string;
  readonly VITE_BG_LOCAL_COUNT?: string;
  readonly VITE_BG_BING_URL?: string;
  readonly VITE_BG_SCENERY_URL?: string;
  readonly VITE_BG_ANIME_URL?: string;
  readonly VITE_ARTALK_SERVER?: string;
  readonly VITE_ARTALK_SITE?: string;
  readonly VITE_BSZ_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
