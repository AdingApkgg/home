import { useLayoutEffect, useRef } from "react";
import { AboutIntro } from "@/components/about-intro";
import { AppBackground } from "@/components/app-background";
import { AppFooter } from "@/components/app-footer";
import { AppLoading } from "@/components/app-loading";
import { CommentsPanel } from "@/components/comments-panel";
import { Hero } from "@/components/hero";
import { LinkGrid } from "@/components/link-grid";
import { MusicPanel } from "@/components/music-panel";
import { SettingsDialog } from "@/components/settings-panel";
import { ThemeProvider } from "@/components/theme-provider";
import { TopBar } from "@/components/top-bar";
import { prefersReducedMotion, revealPage } from "@/lib/fx/reveal";
import { getAnniversary, getHello } from "@/lib/get-time";
import { isBuildPrerender, isPrerendered } from "@/lib/prerender";
import { toast } from "@/lib/toast";
import { useMain } from "@/store/main";

export function App() {
  const imgLoaded = useMain((s) => s.imgLoaded);
  const fxOn = useMain((s) => s.fx);
  // 预渲染过的页面首帧已有内容，别因为图片没 load 完就整块撤掉。
  const ready = imgLoaded || isPrerendered();

  // 入场只在真正首屏那一次跑：预渲染页、关掉动效、系统要求减少动效都直接落位。
  const revealedRef = useRef(false);
  useLayoutEffect(() => {
    if (!ready || revealedRef.current) return;
    revealedRef.current = true;
    // 构建期快照直接落位（快照里不留半截动画），真实浏览时照样播。
    if (isBuildPrerender()) {
      revealPage({ instant: true });
      return;
    }
    revealPage({ reduced: !fxOn || prefersReducedMotion() });
  }, [ready, fxOn]);

  const greetedRef = useRef(false);
  const handleLoadComplete = () => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    toast(`${getHello()}，欢迎回来`);
    const anniv = getAnniversary();
    if (anniv) toast(`今天是${anniv}`, { duration: 10000 });
  };

  return (
    <>
      <ThemeProvider />
      <AppLoading />
      <AppBackground onLoadComplete={handleLoadComplete} />

      {ready && <TopBar />}

      {ready && (
        // 宽一点的版心 + 12 栏栅格：主体是索引表，不是居中的一列卡片。
        <main
          className={`mx-auto w-full max-w-[70rem] px-5 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))] transition-opacity duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 sm:pt-[calc(6rem+env(safe-area-inset-top))] lg:px-10 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
            <Hero />
            <AboutIntro />
            <LinkGrid />
            <AppFooter />
          </div>
        </main>
      )}

      {ready && <MusicPanel />}

      {/*
        Dialogs are always rendered. They have their own open-state gates and
        must not unmount when imgLoaded briefly flips to false during a
        wallpaper swap — otherwise the open dialog would disappear.
      */}
      <SettingsDialog />
      <CommentsPanel />
    </>
  );
}
