"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";

const BG_SOURCES: Record<string, () => string> = {
  "1": () => siteConfig.bgBingUrl || "https://api.paugram.com/bing/",
  "2": () => siteConfig.bgSceneryUrl || "https://api.dujin.org/bing/1920.php",
  "3": () => siteConfig.bgAnimeUrl || "https://t.mwm.moe/fj/",
};

export function AppBackground({ onLoadComplete }: { onLoadComplete?: () => void }) {
  const coverType = useMain((s) => s.coverType);
  const wallpaperPeek = useMain((s) => s.wallpaperPeek);
  const imgLoaded = useMain((s) => s.imgLoaded);
  const setStore = useMain((s) => s.set);

  const [bgUrl, setBgUrl] = useState<string>("");
  const fallbackRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localIdx = useRef(Math.floor(Math.random() * siteConfig.bgLocalCount) + 1);
  const getLocal = () => `/images/background${localIdx.current}.jpg`;

  useEffect(() => {
    fallbackRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStore("imgLoaded", false);

    const get = BG_SOURCES[coverType];
    setBgUrl(get ? get() : getLocal());

    if (coverType !== "0") {
      timerRef.current = setTimeout(() => {
        if (!useMain.getState().imgLoaded) {
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
    setStore("imgLoaded", true);
    onLoadComplete?.();
  };

  const onImgError = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fallbackRef.current) {
      setStore("imgLoaded", true);
      onLoadComplete?.();
      return;
    }
    fallbackRef.current = true;
    setBgUrl(getLocal());
  };

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      {bgUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={bgUrl}
          alt=""
          onLoad={onImgLoad}
          onError={onImgError}
          fetchPriority="high"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {/* Overlay: deep dim in normal mode, fade to clear when peeking */}
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: wallpaperPeek ? 0 : 1,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
        }}
      />
      <AnimatePresence>
        {wallpaperPeek && coverType !== "3" && bgUrl && (
          <motion.a
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            href={bgUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs text-white/80 backdrop-blur transition-colors hover:bg-black/60"
          >
            查看原图
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
