<template>
  <footer id="footer" :class="store.footerBlur ? 'blur' : null">
    <Transition name="fade" mode="out-in">
      <div v-if="!store.playerState || !store.playerLrcShow" class="power">
        <span>
          <span :class="startYear < fullYear ? 'c-hidden' : 'hidden'">Copyright&nbsp;</span>
          &copy;
          <span v-if="startYear < fullYear" class="site-start">
            {{ startYear }}
            -
          </span>
          {{ fullYear }}
          <a :href="siteUrl">{{ config.public.siteAuthor }}</a>
        </span>
        <!-- 以下信息请不要修改哦 -->
        <span class="hidden">
          &amp;&nbsp;Made&nbsp;by
          <a :href="appConfig.github" target="_blank">
            {{ appConfig.author }}
          </a>
        </span>
        <!-- 站点备案 -->
        <span>
          &amp;
          <a v-if="config.public.siteIcp" :href="config.public.siteIcpUrl || 'https://beian.miit.gov.cn'" target="_blank">
            {{ config.public.siteIcp }}
          </a>
        </span>
      </div>
      <div v-else class="lrc">
        <Transition name="fade" mode="out-in">
          <div :key="store.playerLrc" class="lrc-all">
            <Music :size="18" color="#efefef" />
            <span class="lrc-text text-hidden" v-html="store.playerLrc"></span>
            <Music :size="18" color="#efefef" />
          </div>
        </Transition>
      </div>
    </Transition>
  </footer>
</template>

<script setup lang="ts">
import { Music } from "lucide-vue-next";

const store = mainStore();
const config = useRuntimeConfig();
const appConfig = useAppConfig();
const fullYear = new Date().getFullYear();

// 加载配置数据
const startYear = ref(
  config.public.siteStart?.length >= 4 ?
  config.public.siteStart.substring(0, 4) : null
);

const siteUrl = computed(() => {
  const url = config.public.siteUrl;
  if (!url) return "https://saop.cc";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `//${  url}`;
  }
  return url;
});
</script>

<style lang="scss" scoped>
#footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 46px;
  line-height: 46px;
  text-align: center;
  z-index: 0;
  font-size: 14px;
  word-break: keep-all;
  white-space: nowrap;
  .power {
    animation: fade 0.3s;
  }
  .lrc {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .lrc-all {
      width: 98%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .lrc-text {
        margin: 0 8px;
      }
      .i-icon {
        width: 18px;
        height: 18px;
        display: inherit;
      }
    }
  }
  &.blur {
    backdrop-filter: blur(10px);
    background: rgb(0 0 0 / 25%);
    font-size: 16px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease-in-out;
  }
  @media (max-width: 720px) {
    font-size: 0.9rem;
    &.blur {
      font-size: 0.9rem;
    }
  }
  @media (max-width: 560px) {
    .c-hidden {
      display: none;
    }
  }
  @media (max-width: 480px) {
    .hidden {
      display: none;
    }
  }
}
</style>
