"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getHitokoto } from "@/lib/api";
import { siteConfig } from "@/lib/config";

export function Hero() {
  const [quote, setQuote] = useState<{ text: string; from: string }>({
    text: siteConfig.siteDes,
    from: siteConfig.siteAuthor,
  });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const r = await getHitokoto();
      setQuote({ text: r.hitokoto, from: r.from });
    } catch {
      toast.error("一言获取失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-col items-center text-center gap-8 animate-in">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={siteConfig.siteMainLogo}
        alt=""
        width={88}
        height={88}
        className="rounded-full"
      />
      <h1 className="text-4xl sm:text-5xl font-medium tracking-tight">
        {siteConfig.siteName}
      </h1>
      <button
        type="button"
        onClick={refresh}
        aria-label="刷新一言"
        className="focus-ring max-w-md px-2 text-sm leading-relaxed text-white/70 transition-colors hover:text-white/95"
      >
        <span className="block">{quote.text}</span>
        <span className="mt-1.5 block text-xs text-white/50">— {quote.from}</span>
      </button>
    </section>
  );
}
