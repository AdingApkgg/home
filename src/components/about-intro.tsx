export function AboutIntro() {
  return (
    <section aria-labelledby="about" data-stage className="w-full">
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-14">
        <div className="flex items-baseline gap-3 lg:sticky lg:top-24 lg:col-span-3 lg:flex-col lg:items-start lg:gap-2 lg:self-start">
          <span
            data-ordinal
            data-to="1"
            className="font-mono text-[11px] tabular-nums tracking-[0.2em] text-ring text-shadow-soft"
          >
            01
          </span>
          <h2
            id="about"
            data-stage-title
            className="font-display text-xl leading-tight tracking-tight text-shadow-soft sm:text-2xl"
          >
            这个页面
          </h2>
          <span
            aria-hidden
            data-stage-rule
            className="hidden h-px w-10 origin-left bg-white/30 lg:block"
            style={{ transform: "scaleX(1)" }}
          />
        </div>
        {/* 正文当一份 README：左侧细线，行距放宽，读起来像在翻文档而不是看简介。 */}
        <div className="relative space-y-3 pl-4 text-[13.5px] leading-[1.95] text-white/75 text-shadow-soft sm:pl-5 lg:col-span-9">
          <span aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-white/15" />
          <span
            aria-hidden
            data-stage-progress
            className="absolute top-0 left-0 h-full w-px origin-top bg-ring/70"
            style={{ transform: "scaleY(0)" }}
          />
          <p data-stage-line>我是 Asuna，白天写代码，晚上收拾这台站和它下面的一堆子域。</p>
          <p data-stage-line>
            下面是所有入口的索引：写东西的地方、自己写的小工具、看番的地方，还有几个朋友的站。
            大部分子域跑在我自己的机器上，掉线会先在监控里红起来。
          </p>
          <p data-stage-line>最近在写视觉小说站和东方 TH14 的浏览器移植，两边的源码都在 GitHub 上。</p>
          <p data-stage-line>要说话的话，Telegram 和邮箱都比留言快。</p>
        </div>
      </div>
    </section>
  );
}
