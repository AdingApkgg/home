import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";
import { isPrerendered } from "@/lib/prerender";
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

  // 预渲染时把当时的壁纸地址写进 #root，首帧沿用同一张，避免换图错位。
  const [bgUrl, setBgUrl] = useState<string>(() => document.getElementById("root")?.dataset.bg ?? "");
  const imgRef = useRef<HTMLImageElement | null>(null);
  // 预渲染那一张已经在 DOM 里（浏览器多半已缓存），首次挂载沿用它，别换第二张。
  const adoptRef = useRef(isPrerendered() && bgUrl !== "");
  const fallbackRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localIdx = useRef<number | null>(null);
  const getLocal = () => {
    localIdx.current ??= Math.floor(Math.random() * siteConfig.bgLocalCount) + 1;
    return `/images/background${localIdx.current}.jpg`;
  };

  // getLocal 每次渲染都是新函数，放进依赖会让 effect 每帧重跑。
  // biome-ignore lint/correctness/useExhaustiveDependencies: 只跟随 coverType 与预渲染壁纸
  useEffect(() => {
    fallbackRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStore("imgLoaded", false);
    setStore("wallpaperUrl", null);

    const adopted = adoptRef.current;
    adoptRef.current = false;

    if (adopted) {
      setStore("wallpaperUrl", bgUrl);
      const img = imgRef.current;
      // 壁纸已缓存时 onLoad 不会再触发，得自己收尾（含欢迎语提示）。
      if (img?.complete && img.naturalWidth > 0) {
        setStore("imgLoaded", true);
        onLoadComplete?.();
      }
    } else {
      const get = BG_SOURCES[coverType];
      setBgUrl(get ? get() : getLocal());
    }

    if (coverType !== "0" && !adopted) {
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
  }, [coverType, setStore, bgUrl]);

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
        <img
          ref={imgRef}
          src={bgUrl}
          alt=""
          onLoad={onImgLoad}
          onError={onImgError}
          fetchPriority="high"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            imgLoaded || isPrerendered() ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {/* Radial vignette: brighter at center for the hero, darker at edges
          to keep the top bar and footer legible against bright wallpapers. */}
      <div
        aria-hidden
        suppressHydrationWarning
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </div>
  );
}
