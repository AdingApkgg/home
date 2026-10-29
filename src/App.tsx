
import { useRef } from "react";
import { toast } from "sonner";
import { useMain } from "@/store/main";
import { getAnniversary, getHello } from "@/lib/get-time";
import { isPrerendered } from "@/lib/prerender";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLoading } from "@/components/app-loading";
import { AppBackground } from "@/components/app-background";
import { AppFooter } from "@/components/app-footer";
import { Hero } from "@/components/hero";
import { LinkGrid } from "@/components/link-grid";
import { TopBar } from "@/components/top-bar";
import { MusicPanel } from "@/components/music-panel";
import { SettingsDialog } from "@/components/settings-panel";
import { CommentsPanel } from "@/components/comments-panel";

export function App() {
  const imgLoaded = useMain((s) => s.imgLoaded);
  // 预渲染过的页面首帧已有内容，别因为图片没 load 完就整块撤掉。
  const ready = imgLoaded || isPrerendered();

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
        <main
          className={`mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-start gap-8 px-5 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))] transition-opacity duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:justify-center sm:gap-12 sm:px-6 sm:pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pt-[calc(6rem+env(safe-area-inset-top))] ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Hero />
          <LinkGrid />
          <AppFooter />
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
