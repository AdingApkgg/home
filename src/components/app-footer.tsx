"use client";

import { siteConfig } from "@/lib/config";

export function AppFooter() {
  const thisYear = new Date().getFullYear();
  const startYear = siteConfig.siteStart?.length >= 4 ? Number(siteConfig.siteStart.substring(0, 4)) : null;
  const siteUrl = siteConfig.siteUrl?.startsWith("http") ? siteConfig.siteUrl : `//${siteConfig.siteUrl}`;
  const range = startYear !== null && startYear < thisYear ? `${startYear} – ${thisYear}` : `${thisYear}`;

  return (
    <footer className="mt-4 text-center text-[11px] tracking-wide text-white/40">
      <span suppressHydrationWarning>© {range} </span>
      <a
        href={siteUrl}
        className="focus-ring underline-offset-4 transition-colors hover:text-white/70 hover:underline"
      >
        {siteConfig.siteAuthor}
      </a>
      {siteConfig.siteIcp && (
        <>
          <span aria-hidden className="mx-1.5">·</span>
          <a
            href={siteConfig.siteIcpUrl || "https://beian.miit.gov.cn"}
            target="_blank"
            rel="noreferrer"
            className="focus-ring underline-offset-4 transition-colors hover:text-white/70 hover:underline"
          >
            {siteConfig.siteIcp}
          </a>
        </>
      )}
    </footer>
  );
}
