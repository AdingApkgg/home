"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";
import { getIpGeo, getOpenMeteoWeather } from "@/lib/api";

const WMO_WEATHER: Record<number, string> = {
  0: "晴", 1: "晴间多云", 2: "多云", 3: "阴",
  45: "雾", 48: "雾凇",
  51: "小毛毛雨", 53: "毛毛雨", 55: "大毛毛雨",
  56: "冻毛毛雨", 57: "强冻毛毛雨",
  61: "小雨", 63: "中雨", 65: "大雨",
  66: "冻雨", 67: "强冻雨",
  71: "小雪", 73: "中雪", 75: "大雪", 77: "雪粒",
  80: "小阵雨", 81: "阵雨", 82: "大阵雨",
  85: "小阵雪", 86: "大阵雪",
  95: "雷暴", 96: "雷暴冰雹", 99: "强雷暴冰雹",
};

const WMO_EMOJI: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌦️",
  56: "🌧️", 57: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  66: "🧊", 67: "🧊",
  71: "❄️", 73: "❄️", 75: "❄️", 77: "❄️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  85: "🌨️", 86: "🌨️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

export function Weather() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    city: string | null; emoji: string; weather: string | null; temp: string | null;
  }>({ city: null, emoji: "🌡️", weather: null, temp: null });

  useEffect(() => {
    (async () => {
      try {
        const geo = await getIpGeo();
        const { current } = await getOpenMeteoWeather(geo.latitude, geo.longitude);
        setData({
          city: geo.city,
          emoji: WMO_EMOJI[current.weather_code] || "🌡️",
          weather: WMO_WEATHER[current.weather_code] || "未知",
          temp: String(Math.round(current.temperature_2m)),
        });
      } catch {
        toast("天气信息获取失败", { icon: <CircleAlert size={18} /> });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="text-center w-full text-ellipsis-one">
      {data.city ? (
        <span>{data.emoji} {data.city} · {data.weather} {data.temp}℃</span>
      ) : loading ? (
        <span>天气获取中...</span>
      ) : (
        <span>天气数据获取失败</span>
      )}
    </div>
  );
}
