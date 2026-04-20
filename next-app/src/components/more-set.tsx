"use client";

import { useMemo, useState } from "react";
import { Bug, Code2, PlusCircle, Settings, X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SettingsPanel } from "./settings-panel";

function parseUrl(raw: string): [string, string] {
  const url = raw || "saop.cc";
  const clean = url.replace(/^(https?:\/\/)/, "");
  const parts = clean.split(".");
  return [parts[0] ?? "saop", parts.slice(1).join(".") || "cc"];
}

const UP = {
  new: ["迁移至 Next.js + Turbopack + Radix UI", "音乐播放器自实现（替换 APlayer）", "主题色可切换、跟随系统明暗", "壁纸支持个性化设置"],
  fix: ["移动端适配优化", "音量持久化", "歌词解析重写", "SPA export 静态部署"],
};

export function MoreSet() {
  const setStore = useMain((s) => s.set);
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();
  const [name, tld] = useMemo(() => parseUrl(siteConfig.siteUrl), []);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] sm:w-full sm:h-full sm:rounded-none sm:p-5 sm:pt-14 bg-white/20 rounded-2xl p-10 overflow-y-auto backdrop-blur-md safe-top"
    >
      {(hover || isMobile) && (
        <button
          type="button"
          onClick={() => setStore("setOpenState", false)}
          aria-label="关闭"
          className="focus-ring absolute top-3.5 right-3.5 p-1 text-white/60 hover:text-white hover:scale-110 active:scale-100 transition-all"
        >
          <X size={28} aria-hidden />
        </button>
      )}
      <div className="grid md:grid-cols-2 gap-10 h-full">
        <div className="flex flex-col justify-between text-white">
          <div className="font-pacifico truncate -translate-y-2">
            <span className="text-[5rem] sm:text-5xl">{name}</span>
            <span className="ml-1.5 text-3xl sm:text-xl">.{tld}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="font-pacifico text-3xl sm:text-xl">v {siteConfig.version}</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Github 源代码仓库"
                    className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all"
                  >
                    <Code2 size={22} aria-hidden />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">Github 源代码仓库</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Card className="mt-6 flex-1 min-h-0">
            <CardHeader>
              <CardTitle>更新日志</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto h-full">
              {UP.new.map((i) => (
                <div key={i} className="flex items-center gap-2 pb-3 text-sm">
                  <PlusCircle size={20} />{i}
                </div>
              ))}
              {UP.fix.map((i) => (
                <div key={i} className="flex items-center gap-2 pb-3 text-sm last:pb-0">
                  <Bug size={20} />{i}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col text-white">
          <div className="flex items-center mb-4 text-lg">
            <Settings size={28} className="mr-1.5 text-white/60" />
            <span>全局设置</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <SettingsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
