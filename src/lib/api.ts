import fetchJsonp from "fetch-jsonp";
import { siteConfig } from "./config";

export interface Song {
  name: string;
  artist: string;
  url: string;
  cover: string;
  lrc?: string;
}

export interface LyricLine {
  time: number; // seconds
  text: string;
}

interface RawSong {
  name?: string;
  title?: string;
  artist?: string;
  author?: string;
  url: string;
  cover?: string;
  pic?: string;
  lrc?: string;
}

interface JsonpResponse {
  req_0: {
    data: {
      sip: string[];
      midurlinfo: { purl: string }[];
    };
  };
}

const fetchJSON = async <T = unknown>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
};

const formatSong = (v: RawSong, url?: string): Song => {
  const song: Song = {
    name: v.name || v.title || "",
    artist: v.artist || v.author || "",
    url: url || v.url,
    cover: v.cover || v.pic || "",
  };
  if (v.lrc !== undefined) song.lrc = v.lrc;
  return song;
};

export async function getPlayerList(server: string, type: string, id: string): Promise<Song[]> {
  const data = await fetchJSON<RawSong[]>(`${siteConfig.songApi}?server=${server}&type=${type}&id=${id}`);

  if (data[0]?.url.startsWith("@")) {
    const parts = data[0].url.split("@").slice(1);
    const url = parts[3];
    if (!url) throw new Error("Missing JSONP URL in song response");
    const jsonpData = await fetchJsonp(url).then((r) => r.json<JsonpResponse>());
    const sip = jsonpData.req_0.data.sip;
    const rawDomain = sip.find((i) => !i.startsWith("http://ws")) ?? sip[0];
    if (!rawDomain) throw new Error("Missing CDN domain in song response");
    const domain = rawDomain.replace("http://", "https://");
    return data.map((v, i) => {
      const info = jsonpData.req_0.data.midurlinfo[i];
      if (!info) throw new Error(`Missing midurlinfo at index ${String(i)}`);
      return formatSong(v, domain + info.purl);
    });
  }

  return data.map((v) => formatSong(v));
}

export const getHitokoto = () =>
  fetchJSON<{ hitokoto: string; from: string }>("https://v1.hitokoto.cn");

/**
 * Parse LRC text into time-sorted lines.
 * Skips metadata tags ([ar:...], [ti:...]) and ignores word-level (<00:01>) timing.
 * Supports multi-timestamp lines: "[00:12.34][00:56.78]text".
 */
export const parseLRC = (text: string): LyricLine[] => {
  const lines: LyricLine[] = [];
  const tagRe = /\[(\d+):(\d+(?:\.\d+)?)\]/g;
  for (const raw of text.split(/\r?\n/)) {
    const stamps: number[] = [];
    let m: RegExpExecArray | null;
    tagRe.lastIndex = 0;
    while ((m = tagRe.exec(raw))) {
      stamps.push(Number(m[1]) * 60 + Number(m[2]));
    }
    if (!stamps.length) continue;
    const body = raw.replace(/\[[^\]]*\]/g, "").trim();
    if (!body) continue;
    for (const t of stamps) lines.push({ time: t, text: body });
  }
  return lines.sort((a, b) => a.time - b.time);
};

export const getLyrics = async (url: string): Promise<LyricLine[]> => {
  const res = await fetch(url);
  if (!res.ok) return [];
  return parseLRC(await res.text());
};

/**
 * Fetch site-wide visitor counts from the bsz.saop.cc service.
 * The API expects a POST with `x-bsz-referer` and credentials so it can
 * read/set the visitor cookie.
 */
export interface BszStats {
  site_pv: number;
  site_uv: number;
  page_pv: number;
}
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/bmp": "bmp",
};

const deriveWallpaperFilename = (url: string, blob: Blob): string => {
  let stem = "wallpaper";
  let ext = "";
  try {
    const u = new URL(url, typeof location !== "undefined" ? location.href : "https://x/");
    const last = u.pathname.split("/").filter(Boolean).pop();
    if (last) {
      const dot = last.lastIndexOf(".");
      if (dot > 0) {
        stem = last.slice(0, dot);
        ext = last.slice(dot + 1).toLowerCase();
      } else {
        stem = last;
      }
    }
  } catch {
    /* ignore — fall through to defaults */
  }
  // The blob's MIME type is more authoritative than a URL extension that
  // might be missing or wrong (e.g. /random returning image/jpeg).
  const mimeExt = MIME_TO_EXT[blob.type];
  if (mimeExt) ext = mimeExt;
  if (!ext) ext = "jpg";
  if (stem.length > 50) stem = stem.slice(0, 50);
  return `${stem}.${ext}`;
};

/**
 * Save the wallpaper at `url` to the user's disk.
 *
 * Implementation note: we just fetch the URL and stream the response body
 * into a blob, then trigger an anchor download. The browser HTTP cache
 * usually serves the same response that the <img> tag already loaded, so
 * random-image APIs that return a different photo per request will tend to
 * give us the same one the user is looking at — provided the response was
 * cacheable and the API URL is identical.
 *
 * The fetch is subject to CORS: the source must send
 * `Access-Control-Allow-Origin` for us to read the bytes. Same-origin
 * (e.g. `/images/backgroundN.jpg`) is always fine. If the source doesn't
 * send CORS we throw and the caller toasts an error.
 */
export const downloadWallpaper = async (url: string): Promise<void> => {
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const blob = await res.blob();
  const filename = deriveWallpaperFilename(url, blob);

  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

// Memoized at module scope so the POST fires once per page load. Without this,
// React StrictMode's dev-mode mount-unmount-mount, plus any incidental remount
// of AppFooter, would each register an extra PV against bsz.saop.cc.
let _bszStatsPromise: Promise<BszStats | null> | null = null;

export const getBszStats = (): Promise<BszStats | null> => {
  if (_bszStatsPromise) return _bszStatsPromise;
  _bszStatsPromise = (async () => {
    try {
      const res = await fetch(siteConfig.bszApi, {
        method: "POST",
        credentials: "include",
        headers: { "x-bsz-referer": typeof window === "undefined" ? "" : location.href },
      });
      if (!res.ok) return null;
      const json = (await res.json()) as { data?: BszStats };
      return json.data ?? null;
    } catch {
      return null;
    }
  })();
  return _bszStatsPromise;
};
