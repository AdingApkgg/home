<template>
  <div class="set" @mouseenter="closeShow = true" @mouseleave="closeShow = false" @click.stop>
    <CircleX
      v-show="closeShow || isMobile"
      class="close"
      :size="28"
      color="#ffffff60"
      @click="store.setOpenState = false"
    />
    <el-row :gutter="40">
      <el-col :span="12" class="left">
        <div class="logo text-hidden">
          <span class="bg">{{ siteUrl[0] }}</span>
          <span class="sm">.{{ siteUrl[1] }}</span>
        </div>
        <div class="version">
          <div class="num">v&nbsp;{{ appConfig.version }}</div>
          <el-tooltip content="Github 源代码仓库" placement="right" :show-arrow="false">
            <Github class="github" :size="24" @click="jumpTo(appConfig.github)" />
          </el-tooltip>
        </div>
        <el-card class="update">
          <template #header>
            <div class="card-header">
              <span>更新日志</span>
            </div>
          </template>
          <div class="upnote">
            <div v-for="item in upData.new" :key="item" class="uptext">
              <PlusCircle :size="22" />
              {{ item }}
            </div>
            <div v-for="item in upData.fix" :key="item" class="uptext">
              <Bug :size="22" />
              {{ item }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="right">
        <div class="title">
          <Settings :size="28" color="#ffffff60" />
          <span class="name">全局设置</span>
        </div>
        <SettingsPanel />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { CircleX, Settings, Github, PlusCircle, Bug } from "lucide-vue-next";

const store = mainStore();
const config = useRuntimeConfig();
const appConfig = useAppConfig();
const closeShow = ref(false);

const isMobile = computed(() => store.innerWidth !== null && store.innerWidth < 721);

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

// 更新日志
const upData = reactive({
  new: [
    "采用 Vue 进行重构",
    "音乐歌单支持快速自定义",
    "壁纸支持个性化设置",
    "音乐播放器支持音量控制",
  ],
  fix: ["修复天气 API", "时光胶囊显示错误", "移动端动画及细节", "图标更换为 IconPark"],
});

// 跳转源代码仓库
const jumpTo = (url: string) => {
  window.open(url);
};
</script>

<style lang="scss" scoped>
.set {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: rgb(255 255 255 / 40%);
  border-radius: 6px;
  padding: 40px;

  .close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 28px;
    height: 28px;

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      transform: scale(1);
    }
  }

  .el-row {
    height: 100%;
    flex-wrap: nowrap;

    .left {
      height: 100%;
      padding-left: 40px !important;
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .logo {
        transform: translateY(-8%);
        font-family: "Pacifico-Regular";
        padding-left: 22px;
        width: 100%;
        height: 260px;
        min-height: 140px;
        .bg {
          font-size: 5rem;
        }

        .sm {
          margin-left: 6px;
          font-size: 2rem;
        }

        @media (max-width: 990px) {
          .bg {
            font-size: 4.5rem;
          }
          .sm {
            font-size: 1.7rem;
          }
        }
        @media (max-width: 825px) {
          .bg {
            font-size: 3.8rem;
          }
          .sm {
            font-size: 1.3rem;
          }
        }
      }

      .version {
        display: flex;
        flex-direction: row;
        align-items: center;

        .num {
          font-size: 2rem;
          font-family: "Pacifico-Regular";
        }

        .github {
          width: 24px;
          height: 24px;
          margin-left: 12px;
          margin-top: 6px;

          &:hover {
            transform: scale(1.2);
          }
        }
      }

      .update {
        margin-top: 30px;
        height: 100%;

        :deep(.el-card__body) {
          height: 100%;

          .upnote {
            padding: 20px;
            height: calc(100% - 56px);
            overflow-y: auto;

            .uptext {
              display: flex;
              flex-direction: row;
              align-items: center;
              padding-bottom: 16px;

              &:nth-last-of-type(1) {
                padding: 0;
              }

              .i-icon {
                width: 22px;
                height: 22px;
                margin-right: 8px;
              }
            }
          }
        }
      }
    }

    .right {
      height: 100%;
      padding-right: 40px !important;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title {
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: 18px;
        margin-bottom: 16px;

        .i-icon {
          width: 28px;
          height: 28px;
          margin-right: 6px;
        }
      }
    }

    @media (max-width: 720px) {
      flex-wrap: wrap;
      overflow-y: auto;

      .left {
        max-width: 100%;
        flex: 0 0 100%;
        padding-left: 0 !important;
        padding-bottom: 16px;
        height: auto;

        .logo {
          height: auto;
          min-height: auto;
          padding-left: 0;
          margin-bottom: 4px;
          transform: none;

          .bg {
            font-size: 3rem;
          }
          .sm {
            font-size: 1.2rem;
          }
        }

        .version {
          .num {
            font-size: 1.4rem;
          }
        }

        .update {
          margin-top: 12px;
          max-height: 200px;

          :deep(.el-card__body) {
            height: auto;

            .upnote {
              padding: 12px;
              height: auto;

              .uptext {
                padding-bottom: 10px;
                font-size: 0.85rem;
              }
            }
          }
        }
      }

      .right {
        max-width: 100%;
        flex: 0 0 100%;
        padding-right: 0 !important;
        padding-left: 0 !important;
        height: auto;

        .title {
          font-size: 16px;
          margin-bottom: 10px;
        }
      }
    }
  }

  @media (max-width: 720px) {
    width: 94%;
    height: 85%;
    padding: 20px;
    padding-top: 48px;
    overflow-y: auto;
  }
}
</style>
