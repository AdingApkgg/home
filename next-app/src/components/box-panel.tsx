"use client";

import { useState } from "react";
import { Settings, X } from "lucide-react";
import { useMain } from "@/store/main";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { TimeCapsule } from "./time-capsule";
import { MoreContent } from "./more-content";

export function BoxPanel({ className = "" }: { className?: string }) {
  const setStore = useMain((s) => s.set);
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();
  const show = hover || isMobile;

  return (
    <Card
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative flex-1 h-[80%] max-w-[50%] ml-3 animate-fade-in ${className}`}
    >
      {show && (
        <>
          <button
            onClick={() => setStore("boxOpenState", false)}
            className="focus-ring absolute top-3.5 right-3.5 text-white/60 hover:text-white hover:scale-110 active:scale-100 transition-all p-1"
            aria-label="关闭"
          >
            <X size={28} />
          </button>
          <button
            onClick={() => {
              setStore("boxOpenState", false);
              setStore("setOpenState", true);
            }}
            className="focus-ring absolute top-3.5 right-14 text-white/60 hover:text-white hover:scale-110 active:scale-100 transition-all p-1"
            aria-label="设置"
          >
            <Settings size={28} />
          </button>
        </>
      )}
      <div className="flex flex-col p-8 sm:p-4 sm:pt-12 w-full h-full overflow-y-auto">
        <TimeCapsule />
        <MoreContent />
      </div>
    </Card>
  );
}
