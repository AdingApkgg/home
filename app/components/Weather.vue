<template>
  <div v-if="weatherData.city && weatherData.weather" class="weather">
    <span>{{ weatherData.city }}&nbsp;</span>
    <span>{{ weatherData.weather }}&nbsp;</span>
    <span>{{ weatherData.temperature }}℃</span>
    <span class="sm-hidden">
      &nbsp;{{ weatherData.winddirection }}风&nbsp;
    </span>
    <span class="sm-hidden">{{ weatherData.windpower }}&nbsp;级</span>
  </div>
  <div v-else class="weather">
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert } from "lucide-vue-next";

const { getIpGeo, getOpenMeteoWeather } = useApi();

// WMO 天气代码 → 中文描述
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

// 角度 → 16 方位中文
const WIND_DIRS = [
  "北", "北东北", "东北", "东东北", "东", "东东南", "东南", "南东南",
  "南", "南西南", "西南", "西西南", "西", "西西北", "西北", "北西北",
];
const degreeToWindDir = (deg: number) => WIND_DIRS[Math.round(deg / 22.5) % 16];

// 风速 (km/h) → 蒲福风力等级
const toBeaufort = (kmph: number) => {
  const thresholds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117];
  const level = thresholds.findIndex((t) => kmph <= t);
  return level === -1 ? 12 : level;
};

// 天气数据
const weatherData = reactive({
  city: null as string | null,
  weather: null as string | null,
  temperature: null as string | null,
  winddirection: null as string | null,
  windpower: null as number | null,
});

// 获取天气数据
const getWeatherData = async () => {
  try {
    // 1. IP 定位获取城市和坐标
    const geo = await getIpGeo();
    // 2. 根据坐标查询天气
    const { current } = await getOpenMeteoWeather(geo.latitude, geo.longitude);

    weatherData.city = geo.city;
    weatherData.weather = WMO_WEATHER[current.weather_code] || "未知";
    weatherData.temperature = String(Math.round(current.temperature_2m));
    weatherData.winddirection = degreeToWindDir(current.wind_direction_10m);
    weatherData.windpower = toBeaufort(current.wind_speed_10m);
  } catch (error) {
    console.error("天气信息获取失败:", error);
    ElMessage({
      message: "天气信息获取失败",
      icon: h(CircleAlert, { size: 20, color: "#efefef" }),
    });
  }
};

onMounted(() => {
  getWeatherData();
});
</script>
