import fetchJsonp from "fetch-jsonp";
import { siteConfig } from "./config";

export interface Song {
  name: string;
  artist: string;
  url: string;
  cover: string;
}

interface RawSong {
  name?: string;
  title?: string;
  artist?: string;
  author?: string;
  url: string;
  cover?: string;
  pic?: string;
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
