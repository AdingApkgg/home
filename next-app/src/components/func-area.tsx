"use client";

import { useEffect, useState } from "react";
import { getCurrentTime, type CurrentTime } from "@/lib/get-time";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";
import { Hitokoto } from "./hitokoto";
import { MusicPanel } from "./music-panel";
import { Weather } from "./weather";
import { Card } from "@/components/ui/card";

export function FuncArea() {
  const mobileFuncState = useMain((s) => s.mobileFuncState);
  const hasSong = !!siteConfig.songId;

  const [now, setNow] = useState<CurrentTime>(() => getCurrentTime());
  useEffect(() => {
    const id = setInterval(() => setNow(getCurrentTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-[165px] flex items-center justify-between gap-5">
      <div className={`flex-1 h-full ${mobileFuncState ? "block" : "hidden md:block"}`}>
        <div className="h-full w-full relative">
          <Hitokoto />
          {hasSong && (
            <div className="absolute inset-0 pointer-events-none [&>*]:pointer-events-auto">
              <MusicPanel />
            </div>
          )}
        </div>
      </div>
      <div className={`flex-1 h-full ${mobileFuncState ? "hidden md:block" : "block"}`}>
        <Card className="h-full w-full flex flex-col items-center justify-between p-5 animate-fade-in">
          <div className="text-center">
            <div className="truncate">
              <span>{now.year}&nbsp;年&nbsp;</span>
              <span>{now.month}&nbsp;月&nbsp;</span>
              <span>{now.day}&nbsp;日&nbsp;</span>
              <span className="hidden sm:inline">{now.weekday}</span>
            </div>
            <div className="mt-2.5 text-5xl tracking-wider font-led">
              {now.hour}:{now.minute}:{now.second}
            </div>
          </div>
          <Weather />
        </Card>
      </div>
    </div>
  );
}
