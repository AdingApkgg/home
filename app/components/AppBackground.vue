<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img
      v-show="store.imgLoadStatus" :src="bgUrl" class="bg" alt="cover"
      fetchpriority="high" decoding="async"
      @load="imgLoadComplete" @error.once="imgLoadError" @animationend="imgAnimationEnd"
    >
    <div :class="store.backgroundShow ? 'gray hidden' : 'gray'"/>
    <Transition name="fade" mode="out-in">
      <a v-if="store.backgroundShow && store.coverType !== '3'" class="down" :href="bgUrl" target="_blank">
        下载壁纸
      </a>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert } from "lucide-vue-next";

const emit = defineEmits(["loadComplete"]);
const store = mainStore();
const config = useRuntimeConfig();
const bgUrl = ref(null);
// 壁纸随机数
const bgLocalCount = Number(config.public.bgLocalCount) || 10;
const bgRandom = Math.floor(Math.random() * bgLocalCount + 1);

// 壁纸源配置 (可通过 .env 自定义 URL)
const BG_SOURCES = {
  0: () => `/images/background${bgRandom}.jpg`,
  1: () => config.public.bgBingUrl || "https://api.paugram.com/bing/",
  2: () => config.public.bgSceneryUrl || "https://api.fw1028.top/scenery.php?return=img",
  3: () => config.public.bgAnimeUrl || "https://www.loliapi.com/acg/",
};

// 更换壁纸链接
const changeBg = (type) => {
  const getUrl = BG_SOURCES[type];
  if (getUrl) bgUrl.value = getUrl();
};

// 图片加载完成 - 立即显示，无人为延迟
const imgLoadComplete = () => {
  store.setImgLoadStatus(true);
};

// 图片动画完成
const imgAnimationEnd = () => {
  console.info("壁纸加载且动画完成");
  emit("loadComplete");
};

// 图片显示失败
const imgLoadError = () => {
  console.error("壁纸加载失败：", bgUrl.value);
  ElMessage({
    message: "壁纸加载失败，已临时切换回默认",
    icon: h(CircleAlert, { size: 20, color: "#efefef" }),
  });
  bgUrl.value = `/images/background${bgRandom}.jpg`;
};

// 监听壁纸切换
watch(
  () => store.coverType,
  (value) => {
    changeBg(value);
  },
);

onMounted(() => {
  changeBg(store.coverType);
});

</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
  z-index: -1;

  &.show {
    z-index: 1;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    filter: blur(20px) brightness(0.3);
    transition:
      filter 0.3s,
      transform 0.3s;
    animation: fade-blur-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.45s;
  }

  .gray {
    opacity: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);

    transition: 1.5s;

    &.hidden {
      opacity: 0;
      transition: 1.5s;
    }
  }

  .down {
    font-size: 16px;
    color: white;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    padding: 20px 26px;
    border-radius: 8px;
    background-color: #00000030;
    width: 120px;
    height: 30px;
    justify-content: center;
    align-items: center;

    &:hover {
      transform: scale(1.05);
      background-color: #00000060;
    }

    &:active {
      transform: scale(1);
    }
  }
}
</style>
