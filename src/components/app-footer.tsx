import { useEffect, useState } from "react";
import { Eye, Users } from "lucide-react";
import { getBszStats, type BszStats } from "@/lib/api";
import { siteConfig } from "@/lib/config";

export function AppFooter() {
  const thisYear = new Date().getFullYear();
  const startYear = siteConfig.siteStart.length >= 4 ? Number(siteConfig.siteStart.substring(0, 4)) : null;
  const siteUrl = siteConfig.siteUrl.startsWith("http") ? siteConfig.siteUrl : `//${siteConfig.siteUrl}`;
  const range = startYear !== null && startYear < thisYear ? `${startYear} – ${thisYear}` : `${thisYear}`;

  // 计数每次请求都会 +1，所以构建时不算、只在真实浏览时取一次；挂载后再显示。
  const [stats, setStats] = useState<BszStats | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    void getBszStats().then((s) => {
      if (!cancelled) setStats(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="mt-4 flex flex-col items-center gap-y-1 text-center text-xs tracking-wide text-white/55 text-shadow-soft">
      {mounted && stats && (
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3" aria-label="访问" />
            <span data-site-pv className="tabular-nums">
              {stats.site_pv}
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" aria-label="访客" />
            <span data-site-uv className="tabular-nums">
              {stats.site_uv}
            </span>
          </span>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
        <span suppressHydrationWarning>{`© ${range}`}</span>
        <a
          href={siteUrl}
          className="focus-ring underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          {siteConfig.siteAuthor}
        </a>
        {siteConfig.siteIcp && (
          <>
            <span aria-hidden>·</span>
            <a
              href={siteConfig.siteIcpUrl || "https://beian.miit.gov.cn"}
              target="_blank"
              rel="noreferrer"
              className="focus-ring underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {siteConfig.siteIcp}
            </a>
          </>
        )}
      </div>
    </footer>
  );
}
