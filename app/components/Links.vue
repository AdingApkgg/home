<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line">
      <Link :size="20" />
      <span class="title">网站列表</span>
    </div>
    <!-- 网站列表 -->
    <Swiper
      v-if="siteLinks[0]"
      :modules="[Pagination, Mousewheel]"
      :slides-per-view="1"
      :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      mousewheel
    >
      <SwiperSlide v-for="site in siteLinksList" :key="site">
        <el-row class="link-all" :gutter="20">
          <el-col v-for="(item, index) in site" :key="item" :span="8">
            <div
              class="item cards"
              :style="index < 3 ? 'margin-bottom: 20px' : null"
              @click="jumpLink(item)"
            >
              <component :is="siteIcon[item.icon]" :size="26" color="#fff" />
              <span class="name text-hidden">{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination"/>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
// 可前往 https://lucide.dev/icons 自行挑选并在此处引入
import {
  Link,
  BookOpen,
  Disc3,
  Laptop,
  Search,
  Umbrella,
  Images,
  Hash,
  User,
  PackageOpen,
  Fish,
  Server,
  Tags,
  Code,
  Shapes,
  BarChart3,
  Tv,
  Clapperboard,
  Radar,
  MessageCircle,
  Play,
  Gamepad2,
} from "lucide-vue-next";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper/modules";
import siteLinks from "~/assets/siteLinks.json";

const store = mainStore();

// 计算网站链接
const siteLinksList = computed(() => {
  const result = [];
  for (let i = 0; i < siteLinks.length; i += 6) {
    const subArr = siteLinks.slice(i, i + 6);
    result.push(subArr);
  }
  return result;
});

// 网站链接图标 (siteLinks.json 中的 icon 名 → lucide 组件)
const siteIcon = {
  Blog: BookOpen,
  Fish,
  LaptopCode: Laptop,
  UmbrellaBeach: Umbrella,
  Images,
  CompactDisc: Disc3,
  User,
  BoxOpen: PackageOpen,
  Server,
  Search,
  SlackHash: Hash,
  Tags,
  Code,
  Icons: Shapes,
  BarChart: BarChart3,
  Tv,
  Clapperboard,
  Radar,
  MessageCircle,
  Play,
  Gamepad2,
};

// 链接跳转
const jumpLink = (data) => {
  if (data.name === "音乐" && store.musicClick) {
    if (typeof $openList === "function") $openList();
  } else {
    window.open(data.link, "_blank");
  }
};
</script>

<style lang="scss" scoped>
.links {
  .line {
    margin: 2rem 0.25rem 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    animation: fade 0.5s;
    .title {
      margin-left: 8px;
      font-size: 1.15rem;
      text-shadow: 0 0 5px #00000050;
    }
  }
  .swiper {
    left: -10px;
    width: calc(100% + 20px);
    padding: 5px 10px 0;
    z-index: 0;
    .swiper-slide {
      height: 100%;
    }
    .swiper-pagination {
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      :deep(.swiper-pagination-bullet) {
        background-color: #fff;
        width: 20px;
        height: 4px;
        margin: 0 4px;
        border-radius: 4px;
        opacity: 0.2;
        transition: opacity 0.3s;
        &.swiper-pagination-bullet-active {
          opacity: 1;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .link-all {
    height: 220px;
    .item {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s;

      &:hover {
        transform: scale(1.02);
        background: rgb(0 0 0 / 40%);
        transition: 0.3s;
      }

      &:active {
        transform: scale(1);
      }

      .name {
        font-size: 1.1rem;
        margin-left: 8px;
      }
      @media (min-width: 720px) and (max-width: 820px) {
        .name {
          display: none;
        }
      }
      @media (max-width: 720px) {
        height: 80px;
      }
      @media (max-width: 460px) {
        flex-direction: column;
        .name {
          font-size: 1rem;
          margin-left: 0;
          margin-top: 8px;
        }
      }
    }
    @media (max-width: 720px) {
      height: 180px;
    }
  }
}
</style>
