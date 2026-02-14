<template>
  <!-- 音乐控制面板 -->
  <div
    v-show="store.musicOpenState"
    class="music"
    @mouseenter="volumeShow = true"
    @mouseleave="volumeShow = false"
  >
    <div class="btns">
      <span @click="openMusicList()">音乐列表</span>
      <span @click="store.musicOpenState = false">回到一言</span>
    </div>
    <div class="control">
      <SkipBack :size="30" color="#efefef" fill="#efefef" @click="changeMusicIndex(0)" />
      <Transition name="fade" mode="out-in">
        <div :key="store.playerState" class="state" @click="changePlayState">
          <Play v-show="!store.playerState" :size="50" color="#efefef" fill="#efefef" />
          <Pause v-show="store.playerState" :size="50" color="#efefef" fill="#efefef" />
        </div>
      </Transition>
      <SkipForward :size="30" color="#efefef" fill="#efefef" @click="changeMusicIndex(1)" />
    </div>
    <div class="menu">
      <div v-show="!volumeShow" class="name">
        <span>{{
          store.getPlayerData.name
            ? store.getPlayerData.name + " - " + store.getPlayerData.artist
            : "未播放音乐"
        }}</span>
      </div>
      <div v-show="volumeShow" class="volume">
        <div class="icon">
          <VolumeX v-if="volumeNum === 0" :size="24" color="#efefef" />
          <Volume1 v-else-if="volumeNum > 0 && volumeNum < 0.7" :size="24" color="#efefef" />
          <Volume2 v-else :size="24" color="#efefef" />
        </div>
        <el-slider v-model="volumeNum" :show-tooltip="false" :min="0" :max="1" :step="0.01" />
      </div>
    </div>
  </div>
  <!-- 音乐列表弹窗 -->
  <Transition name="fade" mode="out-in">
    <div v-show="musicListShow" class="music-list" @click="closeMusicList()">
      <Transition name="zoom">
        <div v-show="musicListShow" class="list" @click.stop>
          <CircleX
            class="close"
            :size="28"
            color="#ffffff60"
            @click="closeMusicList()"
          />
          <MusicPlayer
            ref="playerRef"
            :song-server="playerData.server"
            :song-type="playerData.type"
            :song-id="playerData.id"
            :volume="volumeNum"
          />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { SkipBack, Play, Pause, SkipForward, CircleX, VolumeX, Volume1, Volume2 } from "lucide-vue-next";

const store = mainStore();
const config = useRuntimeConfig();

// 音量条数据
const volumeShow = ref(false);
const volumeNum = ref(store.musicVolume ? store.musicVolume : 0.7);

// 播放列表数据
const musicListShow = ref(false);
const playerRef = ref(null);
const playerData = reactive({
  server: config.public.songServer,
  type: config.public.songType,
  id: String(config.public.songId),
});

// 开启播放列表
const openMusicList = () => {
  musicListShow.value = true;
  playerRef.value.toggleList();
};

// 关闭播放列表
const closeMusicList = () => {
  musicListShow.value = false;
  playerRef.value.toggleList();
};

// 音乐播放暂停
const changePlayState = () => {
  playerRef.value.playToggle();
};

// 音乐上下曲
const changeMusicIndex = (type) => {
  playerRef.value.changeSong(type);
};

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (!store.musicIsOk) {
      return;
    }
    if (e.code === "Space") {
      changePlayState();
    }
  });
  window.$openList = openMusicList;
});

// 监听音量变化
watch(
  () => volumeNum.value,
  (value) => {
    store.musicVolume = value;
    playerRef.value.changeVolume(store.musicVolume);
  },
);
</script>

<style lang="scss" scoped>
.music {
  width: 100%;
  height: 100%;
  background: #00000040;
  backdrop-filter: blur(10px);
  border-radius: 6px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  animation: fade 0.5s;
  .btns {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    span {
      background: #ffffff26;
      padding: 2px 8px;
      border-radius: 6px;
      margin: 0px 6px;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      &:hover {
        background: #ffffff4d;
      }
    }
  }
  .control {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    .state {
      transition: opacity 0.1s;
      .i-icon {
        width: 50px;
        height: 50px;
        display: block;
      }
    }
    .i-icon {
      width: 36px;
      height: 36px;
      display: flex;
      border-radius: 6px;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transform: scale(1);
      &:hover {
        background: #ffffff33;
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
  .menu {
    height: 26px;
    width: 100%;
    line-height: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .name {
      width: 100%;
      text-align: center;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      animation: fade 0.3s;
    }
    .volume {
      width: 100%;
      padding: 0 12px;
      display: flex;
      align-items: center;
      flex-direction: row;
      animation: fade 0.3s;
      .icon {
        margin-right: 12px;
        span {
          width: 24px;
          height: 24px;
          display: block;
        }
      }
      :deep(*) {
        transition: none;
      }
      :deep(.el-slider__button) {
        transition: 0.3s;
      }
      .el-slider {
        margin-right: 12px;
        --el-slider-main-bg-color: #efefef;
        --el-slider-runway-bg-color: #ffffff40;
        --el-slider-button-size: 16px;
      }
    }
  }
}
.music-list {
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  backdrop-filter: blur(20px);
  z-index: 1;
  .list {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: calc(50% - 300px);
    left: calc(50% - 320px);
    width: 640px;
    height: 600px;
    background-color: #ffffff66;
    border-radius: 6px;
    z-index: 999;
    @media (max-width: 720px) {
      left: calc(50% - 45%);
      width: 90%;
    }
    .close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      display: block;
      &:hover {
        transform: scale(1.2);
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
}

.zoom-enter-active {
  animation: zoom 0.4s ease-in-out;
}
.zoom-leave-active {
  animation: zoom 0.3s ease-in-out reverse;
}
@keyframes zoom {
  0% {
    opacity: 0;
    transform: scale(0) translateY(-600px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
