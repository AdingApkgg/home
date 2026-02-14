<template>
  <div class="weather" v-if="weatherData.city && weatherData.weather">
    <span>{{ weatherData.city }}&nbsp;</span>
    <span>{{ weatherData.weather }}&nbsp;</span>
    <span>{{ weatherData.temperature }}℃</span>
    <span class="sm-hidden">
      &nbsp;{{ weatherData.winddirection }}风&nbsp;
    </span>
    <span class="sm-hidden">{{ weatherData.windpower }}&nbsp;级</span>
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import { getWttrWeather } from "@/api";
import { CircleAlert } from "lucide-vue-next";

// 16 方位风向中文映射
const WIND_DIR_MAP = {
  N: "北", NNE: "北东北", NE: "东北", ENE: "东东北",
  E: "东", ESE: "东东南", SE: "东南", SSE: "南东南",
  S: "南", SSW: "南西南", SW: "西南", WSW: "西西南",
  W: "西", WNW: "西西北", NW: "西北", NNW: "北西北",
};

// 风速 (km/h) 转蒲福风力等级
const toBeaufort = (kmph) => {
  const speed = Number(kmph);
  const thresholds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117];
  const level = thresholds.findIndex((t) => speed <= t);
  return level === -1 ? 12 : level;
};

// 天气数据
const weatherData = reactive({
  city: null,
  weather: null,
  temperature: null,
  winddirection: null,
  windpower: null,
});

// 获取天气数据
const getWeatherData = async () => {
  try {
    const data = await getWttrWeather();
    const current = data.current_condition?.[0];
    const area = data.nearest_area?.[0];
    if (!current || !area) throw "天气数据为空";

    // 城市名：优先取中文描述
    const city = area.areaName?.[0]?.value || "未知地区";
    // 天气描述：优先中文
    const weather = current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || "未知";

    weatherData.city = city;
    weatherData.weather = weather;
    weatherData.temperature = current.temp_C;
    weatherData.winddirection = WIND_DIR_MAP[current.winddir16Point] || current.winddir16Point;
    weatherData.windpower = toBeaufort(current.windspeedKmph);
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
