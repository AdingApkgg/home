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
