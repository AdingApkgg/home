<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img
      v-show="store.imgLoadStatus" :src="bgUrl" class="bg" alt="cover"
      fetchpriority="high" decoding="async"
      @load="imgLoadComplete" @error="imgLoadError" @animationend="imgAnimationEnd"
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
const bgUrl = ref("");
const isUsingFallback = ref(false);
let loadTimer: ReturnType<typeof setTimeout> | null = null;

const bgLocalCount = Number(config.public.bgLocalCount) || 10;
const bgRandom = Math.floor(Math.random() * bgLocalCount + 1);

const BG_SOURCES: Record<string, () => string> = {
  "0": () => `/images/background${bgRandom}.jpg`,
  "1": () => config.public.bgBingUrl as string || "https://api.paugram.com/bing/",
  "2": () => config.public.bgSceneryUrl as string || "https://api.dujin.org/bing/1920.php",
  "3": () => config.public.bgAnimeUrl as string || "https://t.mwm.moe/fj/",
};

function getLocalBgUrl() {
  return `/images/background${bgRandom}.jpg`;
}

function isExternalSource(type: string) {
  return type !== "0";
}

function clearLoadTimer() {
  if (loadTimer) {
    clearTimeout(loadTimer);
    loadTimer = null;
  }
}

function fallbackToLocal() {
  if (isUsingFallback.value) return;
  isUsingFallback.value = true;
  clearLoadTimer();
  bgUrl.value = getLocalBgUrl();
}

function changeBg(type: string) {
  isUsingFallback.value = false;
  clearLoadTimer();

  const getUrl = BG_SOURCES[type];
  if (getUrl) {
    bgUrl.value = getUrl();

    if (isExternalSource(type)) {
      loadTimer = setTimeout(() => {
        if (!store.imgLoadStatus) {
          console.warn("壁纸加载超时，切换至本地壁纸");
          fallbackToLocal();
        }
      }, 8000);
    }
  } else {
    bgUrl.value = getLocalBgUrl();
  }
}

const imgLoadComplete = () => {
  clearLoadTimer();
  store.setImgLoadStatus(true);
};

const imgAnimationEnd = () => {
  emit("loadComplete");
};

const imgLoadError = () => {
  clearLoadTimer();

  if (isUsingFallback.value) {
    console.error("本地壁纸也加载失败：", bgUrl.value);
    store.setImgLoadStatus(true);
    emit("loadComplete");
    return;
  }

  console.warn("壁纸加载失败，切换至本地壁纸：", bgUrl.value);
  ElMessage({
    message: "壁纸加载失败，已切换回默认",
    icon: h(CircleAlert, { size: 20, color: "#efefef" }),
  });
  fallbackToLocal();
};

watch(
  () => store.coverType,
  (value) => {
    store.setImgLoadStatus(false);
    changeBg(value);
  },
);

onMounted(() => {
  changeBg(store.coverType);
});

onBeforeUnmount(() => {
  clearLoadTimer();
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
