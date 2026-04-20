"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, Quote, Users } from "lucide-react";
import { useMemo } from "react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";
import { useBusuanzi } from "@/hooks/use-busuanzi";
import { Card } from "@/components/ui/card";

function parseUrl(raw: string): [string, string] {
  const url = raw || "saop.cc";
  const clean = url.replace(/^(https?:\/\/)/, "");
  const parts = clean.split(".");
  return [parts[0] ?? "saop", parts.slice(1).join(".") || "cc"];
}

export function Message() {
  const [namePart, tldPart] = useMemo(() => parseUrl(siteConfig.siteUrl), []);
  const boxOpen = useMain((s) => s.boxOpenState);
  const setStore = useMain((s) => s.set);
  const stats = useBusuanzi();

  const hello = boxOpen ? siteConfig.descHelloOther : siteConfig.descHello;
  const text = boxOpen ? siteConfig.descTextOther : siteConfig.descText;
  const isLong = namePart.length >= 6;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center max-w-[460px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteConfig.siteMainLogo} alt="logo" className="h-[120px] w-[120px] rounded-full md:h-[120px] sm:h-[100px] sm:w-[100px]" />
        <div className="pl-6 -translate-y-2 font-pacifico truncate">
          <span className={isLong ? "text-5xl sm:text-4xl" : "text-[5rem] sm:text-[4.5rem]"}>{namePart}</span>
          <span className="ml-1.5 text-3xl sm:text-2xl">.{tldPart}</span>
        </div>
      </div>

      <Card
        onClick={() => setStore("boxOpenState", !boxOpen)}
        className="relative mt-14 max-w-[460px] p-4 cursor-pointer animate-fade-in glass-hover"
      >
        <div className="flex justify-between">
          <Quote size={16} className="shrink-0" />
          <AnimatePresence mode="wait">
            <motion.div
              key={hello + text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-4 my-2 leading-8 mr-auto"
            >
              <p className="font-pacifico">{hello}</p>
              <p>{text}</p>
            </motion.div>
          </AnimatePresence>
          <Quote size={16} className="shrink-0 -scale-x-100 self-end" />
        </div>
        {stats && (
          <div className="absolute right-3 bottom-1.5 flex items-center gap-1 text-[0.7rem] opacity-60 pointer-events-none">
            <Eye size={12} />
            <span>{stats.pv}</span>
            <Users size={12} />
            <span>{stats.uv}</span>
          </div>
        )}
      </Card>
    </div>
  );
}
