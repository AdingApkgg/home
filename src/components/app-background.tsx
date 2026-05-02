"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";

const BG_SOURCES: Record<string, () => string> = {
  "1": () => siteConfig.bgBingUrl || "https://api.paugram.com/bing/",
  "2": () => siteConfig.bgSceneryUrl || "https://api.dujin.org/bing/1920.php",
  "3": () => siteConfig.bgAnimeUrl || "https://t.mwm.moe/fj/",
};

export function AppBackground({ onLoadComplete }: { onLoadComplete?: () => void }) {
  const coverType = useMain((s) => s.coverType);
  const imgLoaded = useMain((s) => s.imgLoaded);
  const setStore = useMain((s) => s.set);

  const [bgUrl, setBgUrl] = useState<string>("");
  const fallbackRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localIdx = useRef<number | null>(null);
  const getLocal = () => {
    localIdx.current ??= Math.floor(Math.random() * siteConfig.bgLocalCount) + 1;
    return `/images/background${localIdx.current}.jpg`;
  };

  useEffect(() => {
    fallbackRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStore("imgLoaded", false);
    setStore("wallpaperUrl", null);

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
    setStore("wallpaperUrl", bgUrl);
    onLoadComplete?.();
  };

  const onImgError = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fallbackRef.current) {
      setStore("imgLoaded", true);
      setStore("wallpaperUrl", bgUrl);
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
      {/* Radial vignette: brighter at center for the hero, darker at edges
          to keep the top bar and footer legible against bright wallpapers. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </div>
  );
}
