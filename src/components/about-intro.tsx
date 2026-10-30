export function AboutIntro() {
  return (
    <section aria-labelledby="about" className="w-full">
      <h2
        id="about"
        className="text-xs font-medium uppercase tracking-[0.18em] text-white/55 text-shadow-soft"
      >
        这个页面
      </h2>
      <div className="mt-2 flex max-w-prose flex-col gap-2.5 text-sm leading-relaxed text-white/70 text-shadow-soft">
        <p>我是 Asuna，白天写代码，晚上收拾这台站和它下面的一堆子域。</p>
        <p>
          下面是所有入口的索引：写东西的地方、自己写的小工具、看番的地方，还有几个朋友的站。
          大部分子域跑在我自己的机器上，掉线会先在监控里红起来。
        </p>
        <p>最近在写视觉小说站和东方 TH14 的浏览器移植，两边的源码都在 GitHub 上。</p>
        <p>要说话的话，Telegram 和邮箱都比留言快。</p>
      </div>
    </section>
  );
}
