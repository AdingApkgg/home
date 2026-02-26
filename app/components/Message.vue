<template>
  <!-- 基本信息 -->
  <div class="message">
    <!-- Logo -->
    <div class="logo">
      <img class="logo-img" :src="config.public.siteMainLogo" alt="logo" />
      <div class="name text-hidden" :class="{ long: siteUrl[0].length >= 6 }">
        <span class="bg">{{ siteUrl[0] }}</span>
        <span class="sm">.{{ siteUrl[1] }}</span>
      </div>
    </div>
    <!-- 简介 -->
    <div class="description cards" @click="changeBox">
      <div class="content">
        <Quote :size="16" color="#fff" />
        <Transition name="fade" mode="out-in">
          <div :key="descriptionText.hello + descriptionText.text" class="text">
            <p>{{ descriptionText.hello }}</p>
            <p>{{ descriptionText.text }}</p>
          </div>
        </Transition>
        <Quote :size="16" color="#fff" class="quote-flip" />
      </div>
      <Transition name="fade">
        <div v-if="sitePv !== null" class="site-count">
          <Eye :size="12" />
          <span>{{ sitePv }}</span>
          <Users :size="12" />
          <span>{{ siteUv }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Quote, CircleAlert, Eye, Users } from "lucide-vue-next";
import { useBusuanzi } from "~/composables/useBusuanzi";

const store = mainStore();
const config = useRuntimeConfig();
const { sitePv, siteUv } = useBusuanzi();

// 站点链接
const siteUrl = computed(() => {
  const url = config.public.siteUrl;
  if (!url) return "saop.cc".split(".");
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const urlFormat = url.replace(/^(https?:\/\/)/, "");
    return urlFormat.split(".");
  }
  return url.split(".");
});

// 简介区域文字
const descriptionText = reactive({
  hello: config.public.descHello,
  text: config.public.descText,
});

// 切换右侧功能区
const changeBox = () => {
  if (store.innerWidth >= 721) {
    store.boxOpenState = !store.boxOpenState;
  } else {
    ElMessage({
      message: "当前页面宽度不足以开启盒子",
      grouping: true,
      icon: h(CircleAlert, { size: 20, color: "#efefef" }),
    });
  }
};

// 监听状态变化
watch(
  () => store.boxOpenState,
  (value) => {
    if (value) {
      descriptionText.hello = config.public.descHelloOther;
      descriptionText.text = config.public.descTextOther;
    } else {
      descriptionText.hello = config.public.descHello;
      descriptionText.text = config.public.descText;
    }
  },
);
</script>

<style lang="scss" scoped>
.message {
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    animation: fade 0.5s;
    max-width: 460px;
    .logo-img {
      border-radius: 50%;
      width: 120px;
    }
    .name {
      width: 100%;
      padding-left: 22px;
      transform: translateY(-8px);
      font-family: "Pacifico-Regular";

      .bg {
        font-size: 5rem;
      }

      .sm {
        margin-left: 6px;
        font-size: 2rem;
        @media (min-width: 721px) and (max-width: 789px) {
          display: none;
        }
      }
    }
    @media (max-width: 768px) {
      .logo-img {
        width: 100px;
      }
      .name {
        height: 128px;
        .bg {
          font-size: 4.5rem;
        }
      }
    }

    @media (max-width: 720px) {
      max-width: 100%;
    }
  }

  .description {
    position: relative;
    padding: 1rem;
    margin-top: 3.5rem;
    max-width: 460px;
    animation: fade 0.5s;

    .content {
      display: flex;
      justify-content: space-between;

      .text {
        margin: 0.75rem 1rem;
        line-height: 2rem;
        margin-right: auto;
        transition: opacity 0.2s;

        p {
          &:nth-of-type(1) {
            font-family: "Pacifico-Regular";
          }
        }
      }

      .quote-flip {
        transform: scaleX(-1);
      }

      .xicon:nth-of-type(2) {
        align-self: flex-end;
      }
    }

    .site-count {
      position: absolute;
      right: 12px;
      bottom: 6px;
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 0.7rem;
      opacity: 0.5;
      pointer-events: none;
    }

    @media (max-width: 720px) {
      max-width: 100%;
      pointer-events: none;
    }
  }
}
</style>
