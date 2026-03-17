<template>
  <div class="mobile-action-bar">
    <button
      :class="{ active: !store.mobileOpenState }"
      @click="switchPanel(false)"
    >
      <House :size="20" />
      <span>主页</span>
    </button>
    <button
      :class="{ active: store.mobileOpenState && !store.musicOpenState }"
      @click="switchPanel(true)"
    >
      <LayoutGrid :size="20" />
      <span>功能</span>
    </button>
    <button
      v-if="hasPlayer"
      :class="{ active: store.mobileOpenState && store.musicOpenState }"
      @click="openMusic"
    >
      <Music :size="20" />
      <span>音乐</span>
    </button>
    <button @click="store.boxOpenState = true">
      <CalendarClock :size="20" />
      <span>更多</span>
    </button>
    <button @click="store.commentOpenState = true">
      <MessageSquare :size="20" />
      <span>留言</span>
    </button>
    <button @click="store.setOpenState = true">
      <Settings :size="20" />
      <span>设置</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { House, LayoutGrid, Music, CalendarClock, MessageSquare, Settings } from "lucide-vue-next";

const store = mainStore();
const config = useRuntimeConfig();

const hasPlayer = !!config.public.songId;

function switchPanel(state: boolean) {
  store.mobileOpenState = state;
}

function openMusic() {
  store.mobileOpenState = true;
  store.mobileFuncState = true;
  store.musicOpenState = true;
}
</script>

<style lang="scss" scoped>
.mobile-action-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  background: rgb(0 0 0 / 30%);
  backdrop-filter: blur(12px);
  z-index: 10;
  animation: fade 0.5s;

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    flex: 1;
    height: 100%;
    background: none;
    border: none;
    color: #ffffff90;
    font-size: 0.65rem;
    font-family: inherit;
    transition: color 0.2s, transform 0.2s;
    -webkit-tap-highlight-color: transparent;

    &.active {
      color: #fff;
    }

    &:active {
      transform: scale(0.9);
    }
  }

  @media (min-width: 721px) {
    display: none;
  }

  @media (max-height: 720px) {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  @media (max-width: 390px) {
    width: 391px;
  }
}
</style>
