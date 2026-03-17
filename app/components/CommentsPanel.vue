<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-show="store.commentOpenState" class="comment-overlay" @click.self="close">
        <div class="comment-panel cards" @click.stop>
          <div class="comment-header">
            <span class="title">留言板</span>
            <CircleX
              class="close-btn"
              :size="28"
              color="#ffffff60"
              @click="close"
            />
          </div>
          <div class="comment-body">
            <div ref="artalkEl" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { CircleX } from "lucide-vue-next";
import type ArtalkType from "artalk";

const store = mainStore();
const config = useRuntimeConfig();
const artalkEl = ref<HTMLElement>();
let artalk: ArtalkType | null = null;
let cssLoaded = false;

async function initArtalk() {
  if (artalk || !artalkEl.value) return;
  if (!cssLoaded) {
    await import("artalk/dist/artalk.css");
    cssLoaded = true;
  }
  const Artalk = (await import("artalk")).default;
  artalk = Artalk.init({
    el: artalkEl.value,
    server: config.public.artalkServer as string,
    site: config.public.artalkSite as string,
    pageKey: "/",
    pageTitle: config.public.siteName as string,
    darkMode: true,
    flatMode: "auto",
    locale: "zh-CN",
  });
}

function close() {
  store.commentOpenState = false;
}

watch(
  () => store.commentOpenState,
  async (open) => {
    if (open) {
      await nextTick();
      initArtalk();
    }
  },
);

onBeforeUnmount(() => {
  artalk?.destroy();
  artalk = null;
});
</script>

<style lang="scss" scoped>
.comment-overlay {
  position: fixed;
  inset: 0;
  background-color: #00000080;
  backdrop-filter: blur(20px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade 0.5s;
}

.comment-panel {
  width: 90%;
  max-width: 720px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #ffffff20;

    .title {
      font-size: 1.1rem;
      font-weight: bold;
    }

    .close-btn {
      cursor: pointer;
      transition: transform 0.3s;
      &:hover {
        transform: scale(1.2);
      }
      &:active {
        transform: scale(1);
      }
    }
  }

  .comment-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;

    :deep(.atk-container) {
      --at-color-font: #e0e0e0;
      --at-color-bg: transparent;
      --at-color-main: #399fff;
      --at-color-border: #ffffff20;
      --at-color-bg-grey: #ffffff10;
      --at-color-bg-grey-transl: #ffffff08;
      --at-color-grey: #999;
      --at-color-meta: #bbb;
    }
  }

  @media (max-width: 720px) {
    width: 100%;
    height: 100%;
    max-width: none;
    border-radius: 0;
  }
}
</style>
