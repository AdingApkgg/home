"use client";

import { useState } from "react";
import data from "@/data/social-links.json";

export function SocialLinks() {
  const [tip, setTip] = useState("通过这里联系我吧");
  return (
    <div className="group mt-4 flex h-[42px] max-w-full items-center justify-center rounded-md transition-all hover:bg-black/40 hover:backdrop-blur md:max-w-[460px] md:justify-between animate-fade-in">
      <div className="flex flex-1 items-center justify-center md:flex-none">
        {data.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={item.name}
            className="focus-ring mx-3 inline-flex h-9 w-9 items-center justify-center rounded-md transition-transform hover:scale-110 active:scale-95"
            onMouseEnter={() => setTip(item.tip)}
            onMouseLeave={() => setTip("通过这里联系我吧")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.icon} alt="" height={24} width={24} className="h-6 w-6" />
          </a>
        ))}
      </div>
      <span className="hidden mr-3 animate-fade-in group-hover:block">{tip}</span>
    </div>
  );
}
