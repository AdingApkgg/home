import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getHitokoto } from "@/lib/api";
import { siteConfig } from "@/lib/config";
import { SocialRow } from "@/components/social-row";

// Cache the hitokoto for the lifetime of the tab so the quote is stable
// across wallpaper changes (which remount Hero) and we don't spam the API.
let cachedQuote: { text: string; from: string } | null = null;

export function Hero() {
  const [quote, setQuote] = useState<{ text: string; from: string }>(
    () => cachedQuote ?? { text: siteConfig.siteDes, from: siteConfig.siteAuthor },
  );
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const r = await getHitokoto();
      const next = { text: r.hitokoto, from: r.from };
      cachedQuote = next;
      setQuote(next);
    } catch {
      toast.error("一言获取失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cachedQuote) return;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-col items-center text-center gap-5 sm:gap-7 animate-in">
      <div className="flex items-center gap-4 sm:gap-5">
        <img
          src={siteConfig.siteMainLogo}
          alt=""
          width={88}
          height={88}
          className="h-14 w-14 rounded-full ring-1 ring-ring/40 shadow-2xl sm:h-[72px] sm:w-[72px]"
        />
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-shadow-soft">
          {siteConfig.siteName}
        </h1>
      </div>
      <SocialRow />
      <button
        type="button"
        onClick={refresh}
        aria-label="刷新一言"
        aria-busy={loading}
        className={`focus-ring group max-w-md px-2 text-sm leading-relaxed text-white/80 text-shadow-soft transition-opacity hover:text-white ${
          loading ? "opacity-60" : ""
        }`}
      >
        <span className="block">{quote.text}</span>
        <span className="mt-1.5 block text-xs text-white/60 transition-colors group-hover:text-white/80">
          — {quote.from}
        </span>
      </button>
    </section>
  );
}
