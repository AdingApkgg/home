<template>
  <div class="more-content">
    <div class="action-btn cards" @click="store.commentOpenState = true">
      <MessageSquare :size="20" />
      <span>留言板</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageSquare } from "lucide-vue-next";

const store = mainStore();
</script>

<style lang="scss" scoped>
.more-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  height: 100%;
  .action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    font-size: 0.95rem;
    cursor: pointer;
    transition:
      transform 0.3s,
      background-color 0.3s;
    &:hover {
      background-color: #ffffff20;
      transform: scale(1.05);
    }
    &:active {
      transform: scale(0.97);
    }
  }
}
</style>
