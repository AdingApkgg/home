简体中文 | [English](./README_EN.md)

<p>
<strong><h2>定の栈</h2></strong>
简单的小主页，原来的看够了，重新弄了一个
</p>

![定の栈](/screenshots/main.jpg)

> **Fork 说明**：本项目 Fork 自 [imsyy/home](https://github.com/imsyy/home)，由于原作者已停止维护，本仓库进行独立维护和持续更新。主要改动包括：
>
> - 框架从 Vue + Vite 迁移至 **Nuxt 3**（SPA 模式）
> - 图标库从 xicons / IconPark 迁移至 **Lucide**
> - 字体从外部 CDN 改为 **@fontsource/noto-sans-sc** 本地加载
> - 天气接口从高德 API 改为 **wttr.in**（支持 IPv6 和海外）
> - 新增 **OG / Twitter Card** 社交分享标签
> - 环境变量统一为 `NUXT_PUBLIC_*` 前缀

> 主页的 Logo 字体已经过压缩，若用本站 Logo 以外的字母会变回默认字体，可将字体目录下的 `Pacifico-Regular-all.ttf` 进行替换

### Demo

- [定の栈](https://saop.cc)

### 功能

- [x] 载入动画
- [x] 站点简介
- [x] Hitokoto 一言
- [x] 日期及时间
- [x] 实时天气（wttr.in，支持 IPv6 和海外）
- [x] 时光进度条
- [x] 音乐播放器
- [x] 移动端适配
- [x] PWA 支持
- [x] OG / Twitter Card 社交分享

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | [Nuxt 3](https://nuxt.com/)（SPA 模式） |
| 语言 | JavaScript / TypeScript |
| UI 组件 | [Element Plus](https://element-plus.org/) |
| 状态管理 | [Pinia](https://pinia.vuejs.org/) + persistedstate |
| 图标 | [Lucide](https://lucide.dev/icons) |
| 音乐 | [APlayer](https://aplayer.js.org/) |
| 字体 | [Noto Sans SC](https://fontsource.org/fonts/noto-sans-sc)（通过 @fontsource 本地加载） |
| PWA | [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt) |

### 项目结构

```
home/
├── nuxt.config.ts          # Nuxt 配置
├── app.vue                 # 根组件
├── components/             # 组件（Nuxt 自动导入）
│   ├── AppBackground.vue   # 壁纸
│   ├── AppFooter.vue       # 页脚
│   ├── AppLoading.vue      # 载入动画
│   ├── BoxPanel.vue        # 功能盒子
│   ├── FuncArea.vue        # 功能区（时钟 + 天气 + 一言 + 音乐）
│   ├── Hitokoto.vue        # 一言
│   ├── Links.vue           # 网站链接
│   ├── MainLeft.vue        # 左侧布局
│   ├── MainRight.vue       # 右侧布局
│   ├── Message.vue         # 简介信息
│   ├── MoreSet.vue         # 设置页面
│   ├── MusicPanel.vue      # 音乐控制面板
│   ├── MusicPlayer.vue     # APlayer 播放器
│   ├── SettingsPanel.vue   # 设置面板
│   ├── SocialLinks.vue     # 社交链接
│   ├── TimeCapsule.vue     # 时光胶囊
│   └── Weather.vue         # 天气
├── composables/
│   └── useApi.js           # API 请求（Nuxt composable）
├── stores/
│   └── main.js             # Pinia 状态管理
├── utils/
│   ├── cursor.js           # 自定义光标
│   ├── debounce.js         # 防抖
│   └── getTime.js          # 时间工具
├── assets/
│   ├── style/              # SCSS 样式
│   ├── siteLinks.json      # 网站链接配置
│   └── socialLinks.json    # 社交链接配置
├── public/                 # 静态资源
│   ├── images/             # 壁纸 & 图标
│   └── font/               # 自定义字体
├── .env                    # 环境变量
└── .env.example            # 环境变量示例
```

### 部署

#### 手动部署

- 安装 [Node.js](https://nodejs.org/) (>= 18) 和 [pnpm](https://pnpm.io/)

```bash
# 安装依赖
pnpm install

# 开发预览
pnpm dev

# 构建静态文件
pnpm build
```

> 构建完成后，静态资源会在 `dist` 目录中生成，可上传至任意静态托管平台（Vercel、Cloudflare Pages、Netlify 等）

#### Docker 部署

```bash
# 构建
docker build -t home .
# 运行
docker run -p 12445:12445 -d home
```

#### Vercel 部署

1. Fork 本仓库到你的 GitHub 账号
2. 复制 `.env.example` 为 `.env` 并修改配置
3. 在 Vercel 中导入项目，点击 Deploy

### 配置说明

#### 环境变量

所有配置通过 `.env` 文件管理，使用 `NUXT_PUBLIC_*` 前缀：

```bash
# 站点信息
NUXT_PUBLIC_SITE_NAME = "我的主页"
NUXT_PUBLIC_SITE_AUTHOR = "作者"
NUXT_PUBLIC_SITE_DES = "一个简单的个人主页"
NUXT_PUBLIC_SITE_URL = "example.com"

# 主题色（浏览器地址栏 / PWA）
NUXT_PUBLIC_SITE_THEME_COLOR = "#424242"

# 壁纸源（可自定义 API）
NUXT_PUBLIC_BG_LOCAL_COUNT = 10
NUXT_PUBLIC_BG_BING_URL = ""
NUXT_PUBLIC_BG_SCENERY_URL = ""
NUXT_PUBLIC_BG_ANIME_URL = ""

# 音乐播放器
NUXT_PUBLIC_SONG_API = "https://api-meting.example.com/api"
NUXT_PUBLIC_SONG_SERVER = "netease"
NUXT_PUBLIC_SONG_TYPE = "playlist"
NUXT_PUBLIC_SONG_ID = ""
```

完整配置请参考 [.env.example](./.env.example)

#### 网站链接

编辑 `assets/siteLinks.json` 自定义网站链接：

```json
{
  "icon": "Blog",
  "name": "博客",
  "link": "https://blog.example.com/"
}
```

图标名称来自 [Lucide Icons](https://lucide.dev/icons)，在 `components/Links.vue` 中引入并映射：

```js
import { BookOpen, Fish, Laptop, ... } from "lucide-vue-next";

const siteIcon = {
  Blog: BookOpen,
  Fish,
  LaptopCode: Laptop,
  // ...
};
```

#### 社交链接

编辑 `assets/socialLinks.json` 自定义社交链接。

#### 天气

使用 [wttr.in](https://wttr.in/) 接口，自动根据 IP 定位，支持 IPv6 和海外访问，无需 API Key。

#### 音乐

基于 `MetingJS` 的 `APlayer` 音乐播放器，在 `.env` 中配置歌曲参数即可自定义歌单。

#### 网站背景

本地壁纸放在 `public/images/` 中，命名格式为 `background1.jpg` ~ `backgroundN.jpg`，通过 `NUXT_PUBLIC_BG_LOCAL_COUNT` 设置数量。

也支持自定义外部壁纸 API，在 `.env` 中配置 `NUXT_PUBLIC_BG_*_URL`。

#### 网站图标

在 `public/images/icon/` 中替换对应尺寸的图标文件。

### API

- [wttr.in](https://wttr.in/) - 天气查询
- [Hitokoto 一言](https://hitokoto.cn/) - 随机一言
- [MetingJS API](https://github.com/xizeyoupan/Meting-API) - 音乐播放列表

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=AdingApkgg/home&type=Date)](https://star-history.com/#AdingApkgg/home&Date)
