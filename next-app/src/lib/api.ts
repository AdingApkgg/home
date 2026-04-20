import fetchJsonp from "fetch-jsonp";
import { siteConfig } from "./config";

export interface Song {
  name: string;
  artist: string;
  url: string;
  cover: string;
  lrc: string;
}

interface RawSong {
  name?: string;
  title?: string;
  artist?: string;
  author?: string;
  url: string;
  cover?: string;
  pic?: string;
  lrc: string;
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
  return res.json();
};

const formatSong = (v: RawSong, url?: string): Song => ({
  name: v.name || v.title || "",
  artist: v.artist || v.author || "",
  url: url || v.url,
  cover: v.cover || v.pic || "",
  lrc: v.lrc,
});

export async function getPlayerList(server: string, type: string, id: string): Promise<Song[]> {
  const data = await fetchJSON<RawSong[]>(`${siteConfig.songApi}?server=${server}&type=${type}&id=${id}`);

  if (data[0]?.url.startsWith("@")) {
    const [, , , url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url!).then((r) => r.json<JsonpResponse>());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ?? jsonpData.req_0.data.sip[0]
    )!.replace("http://", "https://");
    return data.map((v, i) => formatSong(v, domain + jsonpData.req_0.data.midurlinfo[i]!.purl));
  }

  return data.map((v) => formatSong(v));
}

export const getHitokoto = () =>
  fetchJSON<{ hitokoto: string; from: string }>("https://v1.hitokoto.cn");

export const getIpGeo = () =>
  fetchJSON<{ city: string; latitude: number; longitude: number }>("https://ipapi.co/json/");

export const getOpenMeteoWeather = (lat: number, lon: number) =>
  fetchJSON<{
    current: {
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      weather_code: number;
      wind_speed_10m: number;
      wind_direction_10m: number;
    };
  }>(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh`,
  );

export async function fetchBusuanzi(): Promise<{ pv: number; uv: number } | null> {
  try {
    const res = await fetch("https://bsz.saop.cc/api", {
      method: "POST",
      credentials: "include",
      headers: { "x-bsz-referer": location.href },
    });
    const { success, data } = await res.json();
    if (success) return { pv: data.site_pv, uv: data.site_uv };
  } catch {
    // ignore
  }
  return null;
}

export interface Lyric {
  time: number;
  text: string;
}

export function parseLrc(raw: string): Lyric[] {
  if (!raw) return [];
  const lines = raw.split(/\r?\n/);
  const out: Lyric[] = [];
  const re = /\[(\d+):(\d+)(?:[.:](\d+))?\]/g;
  for (const line of lines) {
    const text = line.replace(re, "").trim();
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(line))) {
      const min = Number(m[1]);
      const sec = Number(m[2]);
      const ms = m[3] ? Number(m[3].padEnd(3, "0").slice(0, 3)) : 0;
      out.push({ time: min * 60 + sec + ms / 1000, text });
    }
  }
  return out.sort((a, b) => a.time - b.time);
}
