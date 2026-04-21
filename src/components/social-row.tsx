"use client";

import data from "@/data/social-links.json";

export function SocialRow() {
  return (
    <section className="flex items-center justify-center gap-1 animate-in">
      {data.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-label={item.name}
          title={item.tip}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.icon} alt="" width={18} height={18} className="opacity-90" />
        </a>
      ))}
    </section>
  );
}
