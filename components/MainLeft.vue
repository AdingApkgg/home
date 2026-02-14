<template>
  <div :class="store.mobileOpenState ? 'left hidden' : 'left'">
    <Message />
    <SocialLinks />
  </div>
</template>

<script setup lang="ts">
const store = mainStore();
</script>

<style lang="scss" scoped>
.left {
  width: 50%;
  margin-right: 10px;
  transform: translateY(20px);
  &.hidden {
    display: none;
  }
  @media (max-width: 720px) {
    margin-right: 0;
    width: 100%;
  }
}
</style>
