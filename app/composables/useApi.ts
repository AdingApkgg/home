import fetchJsonp from "fetch-jsonp";

interface Song {
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

/**
 * API 组合式函数
 * 通过 useRuntimeConfig() 获取 API 地址
 */
export function useApi() {
  const config = useRuntimeConfig();

  /**
   * 通用请求封装
   */
  const fetchJSON = async <T = unknown>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`请求失败: ${res.status} ${res.statusText}`);
    return res.json();
  };

  /**
   * 格式化歌曲数据
   */
  const formatSong = (v: RawSong, url?: string): Song => ({
    name: v.name || v.title || "",
    artist: v.artist || v.author || "",
    url: url || v.url,
    cover: v.cover || v.pic || "",
    lrc: v.lrc,
  });

  /**
   * 获取音乐播放列表
   */
  const getPlayerList = async (
    server: string,
    type: string,
    id: string,
  ): Promise<Song[]> => {
    const data = await fetchJSON<RawSong[]>(
      `${config.public.songApi}?server=${server}&type=${type}&id=${id}`,
    );

    if (data[0].url.startsWith("@")) {
      const [, , , url] = data[0].url.split("@").slice(1);
      const jsonpData = await fetchJsonp(url).then((res) =>
        res.json<JsonpResponse>(),
      );
      const domain = (
        jsonpData.req_0.data.sip.find(
          (i: string) => !i.startsWith("http://ws"),
        ) || jsonpData.req_0.data.sip[0]
      ).replace("http://", "https://");

      return data.map((v: RawSong, i: number) =>
        formatSong(v, domain + jsonpData.req_0.data.midurlinfo[i].purl),
      );
    }

    return data.map((v: RawSong) => formatSong(v));
  };

  /**
   * 获取一言数据
   */
  const getHitokoto = () => fetchJSON("https://v1.hitokoto.cn");

  /**
   * 天气 (wttr.in)
   * 自动根据 IP 定位，支持 IPv6 和海外
   */
  const getWttrWeather = () =>
    fetchJSON("https://wttr.in/?format=j1&lang=zh");

  return { getPlayerList, getHitokoto, getWttrWeather };
}
