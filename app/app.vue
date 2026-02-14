<template>
  <!-- 加载 -->
  <AppLoading />
  <!-- 壁纸 -->
  <AppBackground @load-complete="loadComplete" />
  <!-- 主界面 -->
  <Transition name="fade" mode="out-in">
    <main v-if="store.imgLoadStatus" id="main">
      <div v-show="!store.backgroundShow" class="container">
        <section v-show="!store.setOpenState" class="all">
          <MainLeft />
          <MainRight v-show="!store.boxOpenState" />
          <BoxPanel v-show="store.boxOpenState" />
        </section>
        <section v-show="store.setOpenState" class="more" @click="store.setOpenState = false">
          <MoreSet />
        </section>
      </div>
      <!-- 移动端菜单按钮 -->
      <div
        v-show="!store.backgroundShow"
        class="menu"
        @click="store.mobileOpenState = !store.mobileOpenState"
      >
        <component :is="store.mobileOpenState ? X : Menu" :size="24" color="#fff" />
      </div>
      <!-- 页脚 -->
      <Transition name="fade" mode="out-in">
        <AppFooter v-show="!store.backgroundShow && !store.setOpenState" class="f-ter" />
      </Transition>
    </main>
  </Transition>
</template>

<script setup lang="ts">
import { Menu, X } from "lucide-vue-next";
import { helloInit, checkDays } from "~/utils/getTime";
import cursorInit from "~/utils/cursor";

const store = mainStore();
const config = useRuntimeConfig();
const appConfig = useAppConfig();

// Head / SEO / OG
useHead({
  title: config.public.siteName,
  htmlAttrs: { lang: "zh-CN" },
  link: [
    { rel: "icon", href: config.public.siteLogo },
    { rel: "apple-touch-icon", href: config.public.siteAppleLogo },
  ],
  meta: [
    { name: "theme-color", content: config.public.siteThemeColor },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "apple-mobile-web-app-title", content: config.public.siteName },
    { name: "application-name", content: config.public.siteName },
    { name: "msapplication-TileColor", content: config.public.siteThemeColor },
    { name: "msapplication-TileImage", content: config.public.siteAppleLogo },
  ],
});

useSeoMeta({
  description: config.public.siteDes,
  keywords: config.public.siteKeywords,
  author: config.public.siteAuthor,
  ogType: "website",
  ogTitle: config.public.siteName,
  ogDescription: config.public.siteDes,
  ogSiteName: config.public.siteName,
  ogUrl: `https://${config.public.siteUrl}`,
  ogImage: `https://${config.public.siteUrl}${config.public.siteOgImage}`,
  ogLocale: "zh_CN",
  twitterCard: "summary_large_image",
  twitterTitle: config.public.siteName,
  twitterDescription: config.public.siteDes,
  twitterImage: `https://${config.public.siteUrl}${config.public.siteOgImage}`,
});

// 页面宽度
const getWidth = () => {
  store.setInnerWidth(window.innerWidth);
};

// 加载完成事件
const loadComplete = () => {
  nextTick(() => {
    helloInit();
    checkDays();
  });
};

// 监听宽度变化
watch(
  () => store.innerWidth,
  (value) => {
    if (value < 721) {
      store.boxOpenState = false;
      store.setOpenState = false;
    }
  },
);

// 鼠标中键事件
const handleMouseDown = (event) => {
  if (event.button === 1) {
    store.backgroundShow = !store.backgroundShow;
    ElMessage({
      message: `已${store.backgroundShow ? "开启" : "退出"}壁纸展示状态`,
      grouping: true,
    });
  }
};

onMounted(() => {
  // 自定义鼠标
  cursorInit();

  // 屏蔽右键
  document.oncontextmenu = () => {
    ElMessage({
      message: "为了浏览体验，本站禁用右键",
      grouping: true,
      duration: 2000,
    });
    return false;
  };

  // 鼠标中键事件
  window.addEventListener("mousedown", handleMouseDown);

  // 监听当前页面宽度
  getWidth();
  window.addEventListener("resize", getWidth);

  // 控制台输出
  const styleTitle1 = "font-size: 20px;font-weight: 600;color: rgb(244,167,89);";
  const styleTitle2 = "font-size:12px;color: rgb(244,167,89);";
  const styleContent = "color: rgb(30,152,255);";
  const title1 = "定の栈";
  const title2 = `
    _
   / \\   ___ _   _ _ __   __ _
  / _ \\ / __| | | | '_ \\ / _\` |
 / ___ \\\\__ \\ |_| | | | | (_| |
/_/   \\_\\___/\\__,_|_| |_|\\__,_|`;
  const content = `\n\n版本: ${appConfig.version}\n主页: ${appConfig.home}\nGithub: ${appConfig.github}`;
  console.info(`%c${title1} %c${title2} %c${content}`, styleTitle1, styleTitle2, styleContent);

  // PWA 更新提示
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.info("站点已更新，刷新后生效");
      ElMessage("站点已更新，刷新后生效");
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getWidth);
  window.removeEventListener("mousedown", handleMouseDown);
  document.oncontextmenu = null;
});
</script>

<style lang="scss" scoped>
#main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
  transition: transform 0.3s;
  animation: fade-blur-main-in 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.5s;
  .container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    padding: 0 0.5vw;
    .all {
      width: 100%;
      height: 100%;
      padding: 0 0.75rem;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .more {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000080;
      backdrop-filter: blur(20px);
      z-index: 2;
      animation: fade 0.5s;
    }
    @media (max-width: 1200px) {
      padding: 0 2vw;
    }
  }
  .menu {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 84%;
    left: calc(50% - 28px);
    width: 56px;
    height: 34px;
    background: rgb(0 0 0 / 20%);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    transition: transform 0.3s;
    animation: fade 0.5s;
    &:active {
      transform: scale(0.95);
    }
    .i-icon {
      transform: translateY(2px);
    }
    @media (min-width: 721px) {
      display: none;
    }
  }
  @media (max-height: 720px) {
    overflow-y: auto;
    overflow-x: hidden;
    .container {
      height: 721px;
      .more {
        height: 721px;
        width: calc(100% + 6px);
      }
      @media (min-width: 391px) {
        padding-left: 0.7vw;
        padding-right: 0.25vw;
        @media (max-width: 1200px) {
          padding-left: 2.3vw;
          padding-right: 1.75vw;
        }
        @media (max-width: 1100px) {
          padding-left: 2vw;
          padding-right: calc(2vw - 6px);
        }
        @media (max-width: 992px) {
          padding-left: 2.3vw;
          padding-right: 1.7vw;
        }
        @media (max-width: 900px) {
          padding-left: 2vw;
          padding-right: calc(2vw - 6px);
        }
      }
    }
    .menu {
      top: 605.64px;
      left: 170.5px;
      @media (min-width: 391px) {
        left: calc(50% - 25px);
      }
    }
    .f-ter {
      top: 675px;
      @media (min-width: 391px) {
        padding-left: 6px;
      }
    }
  }
  @media (max-width: 390px) {
    overflow-x: auto;
    .container {
      width: 391px;
    }
    .menu {
      left: 167.5px;
    }
    .f-ter {
      width: 391px;
    }
    @media (min-height: 721px) {
      overflow-y: hidden;
    }
  }
}
</style>
