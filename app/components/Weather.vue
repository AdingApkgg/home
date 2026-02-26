<template>
  <div class="weather">
    <template v-if="weatherData.city">
      <span>{{ weatherData.emoji }} {{ weatherData.city }} · {{ weatherData.weather }} {{ weatherData.temperature }}℃</span>
    </template>
    <span v-else-if="loading">天气获取中...</span>
    <span v-else>天气数据获取失败</span>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert } from "lucide-vue-next";

const { getIpGeo, getOpenMeteoWeather } = useApi();

const loading = ref(true);

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

const weatherData = reactive({
  city: null as string | null,
  emoji: "🌡️",
  weather: null as string | null,
  temperature: null as string | null,
  feelsLike: null as string | null,
  humidity: null as number | null,
});

const getWeatherData = async () => {
  try {
    const geo = await getIpGeo();
    const { current } = await getOpenMeteoWeather(geo.latitude, geo.longitude);

    weatherData.city = geo.city;
    weatherData.emoji = WMO_EMOJI[current.weather_code] || "🌡️";
    weatherData.weather = WMO_WEATHER[current.weather_code] || "未知";
    weatherData.temperature = String(Math.round(current.temperature_2m));
    weatherData.feelsLike = String(Math.round(current.apparent_temperature));
    weatherData.humidity = Math.round(current.relative_humidity_2m);
  } catch (error) {
    console.error("天气信息获取失败:", error);
    ElMessage({
      message: "天气信息获取失败",
      icon: h(CircleAlert, { size: 20, color: "#efefef" }),
    });
  } finally {
    loading.value = false;
  }
};

onMounted(getWeatherData);
</script>
