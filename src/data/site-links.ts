export type SiteLink = {
  name: string;
  link: string;
  desc: string;
  icon: string;
};

export type LinkGroup = {
  id: string;
  title: string;
  intro: string;
  links: SiteLink[];
};

/**
 * 页面主体就是这份清单：分组 + 每条一句说明。
 * 说明是给人和爬虫看的——只有名字的话，索引里就只剩一堆光秃秃的词。
 */
export const linkGroups: LinkGroup[] = [
  {
    id: "writing",
    title: "写下来的",
    intro: "长文字放在这里：日常、折腾记录，以及需要一个安静页面的时候。",
    links: [
      {
        icon: "Blog",
        name: "博客",
        link: "https://blog.saop.cc/",
        desc: "主要写东西的地方，建站、运维、代码和杂记都在这里。",
      },
      {
        icon: "User",
        name: "关于",
        link: "https://blog.saop.cc/about/",
        desc: "我是谁、这台站在做什么，以及怎么找到我。",
      },
      {
        icon: "CompactDisc",
        name: "音乐",
        link: "https://blog.saop.cc/music/",
        desc: "最近在听的歌单，跟着一起放也行。",
      },
    ],
  },
  {
    id: "source",
    title: "开源的",
    intro:
      "自己写的东西，源码都在 GitHub 上：能跑的、装不起来的、半途的都留着，功能与限制写在各自的 README 里。",
    links: [
      {
        icon: "Server",
        name: "个人空间",
        link: "https://github.com/AdingApkgg/i",
        desc: "这台站点的全栈源码：文章、相册、音乐、Live2D 看板娘，Hono + React Router 8。",
      },
      {
        icon: "Play",
        name: "WVN",
        link: "https://github.com/AdingApkgg/wvn",
        desc: "线上视觉小说的应用源码：多引擎统一播放器、Passkey 账号、云存档与分享。",
      },
      {
        icon: "Code",
        name: "adx-dl",
        link: "https://github.com/AdingApkgg/adx-dl",
        desc: "AstroDX 谱面存档站与远程目录构建器，抓取、校验、出站串成一条链。",
      },
      {
        icon: "Gamepad2",
        name: "thp",
        link: "https://github.com/AdingApkgg/thp",
        desc: "东方 TH14 的 Web 移植工作区，逐帧对照原版录像基线，进度和证据都写在 docs 里。",
      },
      {
        icon: "Clapperboard",
        name: "ACGN Flow",
        link: "https://github.com/AdingApkgg/acgn-flow",
        desc: "流媒体投稿与播放平台的源码：视频直链、弹幕字幕、合集与后台。",
      },
      {
        icon: "Laptop",
        name: "Wine Workspace",
        link: "https://github.com/AdingApkgg/ww",
        desc: "在网页里管 Wine：Bottle、程序、依赖和日志，Linux 端还带 noVNC 桌面。",
      },
      {
        icon: "Shapes",
        name: "live2d-loader",
        link: "https://github.com/AdingApkgg/live2d-loader",
        desc: "发到 npm 的 Live2D 加载器，Cubism 2 与 4/5 同一套 API，可直接当 Web Component 用。",
      },
      {
        icon: "BarChart",
        name: "bsz 源码",
        link: "https://github.com/AdingApkgg/bsz",
        desc: "不蒜子计数器的自托管重写，Rust 单二进制、零外部依赖。",
      },
      {
        icon: "BookOpen",
        name: "vns",
        link: "https://github.com/AdingApkgg/vns",
        desc: "早期视觉小说站的 Hugo 源码，索引和分类都还留着。",
      },
      {
        icon: "Code",
        name: "GitHub 全部仓库",
        link: "https://github.com/AdingApkgg",
        desc: "公开的仓库都在这里，边角料和实验也在。",
      },
    ],
  },
  {
    id: "tools",
    title: "自己搭的小工具",
    intro: "都是先用得上、顺手写出来再放出来的小东西，坏了我会修。",
    links: [
      {
        icon: "BarChart",
        name: "不蒜子",
        link: "https://bsz.saop.cc/",
        desc: "自建的访问计数接口，这个页面底下那两个数字就是它记的。",
      },
      {
        icon: "Images",
        name: "随图",
        link: "https://img-api.saop.cc/",
        desc: "随机图片接口，按分类返回一张图，用来给页面配背景。",
      },
      {
        icon: "Search",
        name: "旮旯聚搜",
        link: "https://www.searchgal.top/",
        desc: "跨站聚合搜索，一次查完多个视觉小说资源站。",
      },
      { icon: "Radar", name: "动漫聚搜", link: "https://as.saop.cc/", desc: "番剧与资源的聚合检索入口。" },
      {
        icon: "Tv",
        name: "ACGN Flow",
        link: "https://af.saop.cc/",
        desc: "按季度整理的番剧放送表，追番时看进度用。",
      },
      {
        icon: "Play",
        name: "B站解析",
        link: "https://parse.saop.cc/",
        desc: "丢一个视频链接进去，取出直链，方便离线看。",
      },
      {
        icon: "ListMusic",
        name: "ADX 谱面",
        link: "https://adxdls.saop.cc/",
        desc: "音游 ADX 的谱面收集与下载，按曲目整理。",
      },
      {
        icon: "BoxOpen",
        name: "图吧工具",
        link: "https://tb.saop.cc/",
        desc: "装机时会用到的一堆在线小工具，打包在一个页面里。",
      },
      {
        icon: "Gamepad2",
        name: "原神启动",
        link: "https://genshin-start.saop.cc/",
        desc: "点一下就跳转到原神启动页，省得自己找。",
      },
    ],
  },
  {
    id: "browse",
    title: "闲逛与消遣",
    intro: "不写代码的时候待的地方，多数跟番剧和游戏有关。",
    links: [
      {
        icon: "Server",
        name: "视觉小说",
        link: "https://wg.saop.cc/",
        desc: "视觉小说相关的索引与资料，慢慢补。",
      },
      {
        icon: "SlackHash",
        name: "原神社群",
        link: "https://ysbbs.saop.cc/",
        desc: "自己开的原神讨论版，组队和晒进度都在这儿。",
      },
      {
        icon: "Fish",
        name: "木鱼",
        link: "https://muyv.saop.cc/",
        desc: "电子木鱼，点一下敲一声，功德加一。",
      },
      {
        icon: "Tags",
        name: "初音神籤",
        link: "https://aidn.jp/omikuji/",
        desc: "初音未来主题的抽签，每天摇一次看看运气。",
      },
    ],
  },
  {
    id: "sites",
    title: "站务与友邻",
    intro: "自己的站怎么活着，以及几个常去的朋友家。",
    links: [
      {
        icon: "LaptopCode",
        name: "监控",
        link: "https://s.saop.cc/",
        desc: "各台机器和子域的在线状态，掉线会在这里先红起来。",
      },
      {
        icon: "UmbrellaBeach",
        name: "海岛私服",
        link: "https://30hb.cn/",
        desc: "朋友维护的私服站，玩的时候去这里。",
      },
      {
        icon: "MessageCircle",
        name: "Huanvae",
        link: "https://huanvae.cn/",
        desc: "友站，一位长期写博客的朋友。",
      },
      {
        icon: "Code",
        name: "UinCode",
        link: "https://symbl.cc/cn/",
        desc: "特殊字符与符号查询，写文案时抄一个。",
      },
      {
        icon: "Icons",
        name: "xicons",
        link: "https://www.xicons.org/#/zh-CN",
        desc: "图标库检索，做界面时挑图标用。",
      },
    ],
  },
];
