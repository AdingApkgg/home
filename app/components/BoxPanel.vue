<template>
  <div class="box cards" @mouseenter="closeShow = true" @mouseleave="closeShow = false">
    <CircleX
      v-show="closeShow || isMobile"
      class="close"
      :size="28"
      color="#ffffff60"
      @click="store.boxOpenState = false"
    />
    <Settings
      v-show="closeShow || isMobile"
      class="setting"
      :size="28"
      color="#ffffff60"
      @click="openSettings"
    />
    <div class="content">
      <!-- 可在此处自定义任意内容 -->
      <TimeCapsule />
      <MoreContent />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleX, Settings } from "lucide-vue-next";

const store = mainStore();
const closeShow = ref(false);

const isMobile = computed(() => store.innerWidth !== null && store.innerWidth < 721);

function openSettings() {
  store.boxOpenState = false;
  store.setOpenState = true;
}
</script>

<style lang="scss" scoped>
.box {
  flex: 1 0 0%;
  margin-left: 0.75rem;
  height: 80%;
  max-width: 50%;
  position: relative;
  animation: fade 0.5s;

  &:hover {
    transform: scale(1);
  }

  .close,
  .setting {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 28px;
    height: 28px;
    transition:
      transform 0.3s,
      opacity 0.3s;

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      transform: scale(1);
    }
  }

  .setting {
    right: 56px;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 30px;
    width: 100%;
    height: 100%;
    overflow-y: auto;

    @media (max-width: 720px) {
      padding: 16px;
      padding-top: 48px;
    }
  }
}
</style>
