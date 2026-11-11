import { useEffect, useRef, useState } from "react";
import { SocialRow } from "@/components/social-row";
import { getHitokoto } from "@/lib/api";
import { siteConfig } from "@/lib/config";
import { quoteSwap } from "@/lib/fx/reveal";
import { isPrerendered } from "@/lib/prerender";
import { toast } from "@/lib/toast";

// Cache the hitokoto for the lifetime of the tab so the quote is stable
// across wallpaper changes (which remount Hero) and we don't spam the API.
let cachedQuote: { text: string; from: string } | null = null;

export function Hero() {
  const [quote, setQuote] = useState<{ text: string; from: string }>(() => {
    // 预渲染时把当时那句写进 #root，首帧照抄，免得一句话在 hydration 时被换掉。
    const root = document.getElementById("root");
    if (root?.dataset.quote) {
      return { text: root.dataset.quote, from: root.dataset.quoteFrom ?? "" };
    }
    return cachedQuote ?? { text: siteConfig.siteDes, from: `— ${siteConfig.siteAuthor}` };
  });
  const [loading, setLoading] = useState(false);
  const quoteRef = useRef<HTMLButtonElement | null>(null);
  const swappedRef = useRef(false);

  // 换到新的一句时才做淡入，首句交给页面入场编排。
  // biome-ignore lint/correctness/useExhaustiveDependencies: effect 里只碰 ref，quote 只当触发器
  useEffect(() => {
    if (!swappedRef.current) {
      swappedRef.current = true;
      return;
    }
    if (quoteRef.current) quoteSwap(quoteRef.current);
  }, [quote]);

  const refresh = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const r = await getHitokoto();
      const next = { text: r.hitokoto, from: `— ${r.from}` };
      cachedQuote = next;
      setQuote(next);
    } catch {
      toast.error("一言获取失败");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: refresh 每次渲染都是新函数，只在挂载时跑一次
  useEffect(() => {
    // 预渲染已经有一句写进 HTML，这次就不要再打接口，省一次请求也省一次闪字。
    if (cachedQuote || isPrerendered()) return;
    void refresh();
  }, []);

  return (
    <section className="w-full">
      {/* 开机那一行：站名、版本、日期，像终端吐出来的索引表头。 */}
      <div
        data-reveal="meta"
        className="flex items-center justify-between gap-4 border-b border-white/15 pb-3 font-mono text-[10px] tracking-[0.34em] text-white/50 uppercase text-shadow-soft"
      >
        <span>Link start</span>
        <span className="tabular-nums">index · v{siteConfig.version}</span>
      </div>

      <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:items-end lg:gap-14 lg:pt-14">
        <div className="lg:col-span-7">
          <div className="flex items-end gap-5 sm:gap-7">
            <img
              src={siteConfig.siteMainLogo}
              alt=""
              width={96}
              height={96}
              data-reveal="logo"
              className="mb-1 h-16 w-16 rounded-sm ring-1 ring-white/25 shadow-2xl sm:h-24 sm:w-24"
            />
            <h1
              data-reveal="name"
              className="font-display text-[clamp(2.9rem,10vw,6.5rem)] leading-[0.82] font-medium tracking-[-0.045em] text-shadow-soft"
            >
              {siteConfig.siteName}
            </h1>
          </div>
          <p
            data-reveal="tagline"
            className="mt-7 max-w-sm font-mono text-[11px] leading-loose tracking-[0.16em] text-white/60 text-shadow-soft"
          >
            写代码 / 搭服务 / 偶尔写点东西
          </p>
          <SocialRow />
        </div>

        {/* 一言当引文：茶色竖线 + 衬线字，换一句是点击。 */}
        <figure data-reveal="quote-card" className="border-l-2 border-ring/70 pl-4 sm:pl-5 lg:col-span-5">
          <figcaption className="font-mono text-[9px] tracking-[0.3em] text-white/35 uppercase">
            Quote
          </figcaption>
          <button
            ref={quoteRef}
            data-reveal="quote"
            type="button"
            onClick={refresh}
            aria-busy={loading}
            className={`focus-ring group mt-2 block text-left transition-opacity hover:opacity-100 ${
              loading ? "opacity-60" : ""
            }`}
          >
            <span className="sr-only">刷新一言：</span>
            <span
              data-quote-text
              className="block font-display text-base leading-relaxed text-white/90 text-shadow-soft sm:text-lg"
            >
              {quote.text}
            </span>
            <span
              data-quote-from
              className="mt-2 block font-mono text-[10px] tracking-[0.22em] text-white/45 text-shadow-soft transition-colors group-hover:text-white/70"
            >
              {quote.from}
            </span>
          </button>
          <span aria-hidden className="mt-3 block font-mono text-[9px] tracking-[0.3em] text-white/25 uppercase">
            点击换一句
          </span>
        </figure>
      </div>
    </section>
  );
}
