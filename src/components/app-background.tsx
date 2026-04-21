"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";

const BG_SOURCES: Record<string, () => string> = {
  "0": () => "", // default; replaced below
  "1": () => siteConfig.bgBingUrl || "https://api.paugram.com/bing/",
  "2": () => siteConfig.bgSceneryUrl || "https://api.dujin.org/bing/1920.php",
  "3": () => siteConfig.bgAnimeUrl || "https://t.mwm.moe/fj/",
};

export function AppBackground({ onLoadComplete }: { onLoadComplete?: () => void }) {
  const coverType = useMain((s) => s.coverType);
  const backgroundShow = useMain((s) => s.backgroundShow);
  const imgLoaded = useMain((s) => s.imgLoadStatus);
  const setStore = useMain((s) => s.set);

  const [bgUrl, setBgUrl] = useState<string>("");
  const fallbackRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localIdx = useRef(Math.floor(Math.random() * siteConfig.bgLocalCount) + 1);
  const getLocal = () => `/images/background${localIdx.current}.jpg`;

  useEffect(() => {
    fallbackRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStore("imgLoadStatus", false);

    const get = BG_SOURCES[coverType];
    const url = coverType === "0" ? getLocal() : get ? get() : getLocal();
    setBgUrl(url);

    if (coverType !== "0") {
      timerRef.current = setTimeout(() => {
        if (!useMain.getState().imgLoadStatus) {
          console.warn("壁纸加载超时，切换至本地");
          fallbackRef.current = true;
          setBgUrl(getLocal());
        }
      }, 8000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverType]);

  const onImgLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStore("imgLoadStatus", true);
  };

  const onImgError = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fallbackRef.current) {
      setStore("imgLoadStatus", true);
      onLoadComplete?.();
      return;
    }
    toast("壁纸加载失败，已切换回默认", { icon: <CircleAlert size={18} /> });
    fallbackRef.current = true;
    setBgUrl(getLocal());
  };

  return (
    <div className={`absolute inset-0 transition-all duration-300 ${backgroundShow ? "z-[1]" : "z-[-1]"}`}>
      {bgUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={bgUrl}
          alt="cover"
          onLoad={onImgLoad}
          onError={onImgError}
          onAnimationEnd={() => onLoadComplete?.()}
          fetchPriority="high"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover backface-hidden ${imgLoaded ? "animate-fade-blur-in" : "opacity-0"}`}
          style={{ filter: "blur(0) brightness(1)" }}
        />
      )}
      <div
        className="absolute inset-0 transition-opacity duration-[1500ms]"
        style={{
          opacity: backgroundShow ? 0 : 1,
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0) 0, rgba(0,0,0,0.5) 100%), radial-gradient(rgba(0,0,0,0) 33%, rgba(0,0,0,0.3) 166%)",
        }}
      />
      <AnimatePresence>
        {backgroundShow && coverType !== "3" && (
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            href={bgUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white px-6 py-4 rounded-lg bg-black/30 hover:bg-black/60 hover:scale-105 transition-transform"
          >
            下载壁纸
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
