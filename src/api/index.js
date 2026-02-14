import fetchJsonp from "fetch-jsonp";

/**
 * 通用请求封装
 */
const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`请求失败: ${res.status} ${res.statusText}`);
  return res.json();
};

/**
 * 格式化歌曲数据
 */
const formatSong = (v, url) => ({
  name: v.name || v.title,
  artist: v.artist || v.author,
  url: url || v.url,
  cover: v.cover || v.pic,
  lrc: v.lrc,
});

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const data = await fetchJSON(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );

  if (data[0].url.startsWith("@")) {
    const [, , , url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) =>
      formatSong(v, domain + jsonpData.req_0.data.midurlinfo[i].purl),
    );
  }

  return data.map((v) => formatSong(v));
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = () => fetchJSON("https://v1.hitokoto.cn");

/**
 * 天气
 */

// 获取高德地理位置信息
export const getAdcode = (key) => fetchJSON(`https://restapi.amap.com/v3/ip?key=${key}`);

// 获取高德地理天气信息
export const getWeather = (key, city) =>
  fetchJSON(`https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`);

// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
export const getOtherWeather = () => fetchJSON("https://api.oioweb.cn/api/weather/GetWeather");
