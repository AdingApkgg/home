"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMain } from "@/store/main";
import { getAnniversary, getHello } from "@/lib/get-time";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLoading } from "@/components/app-loading";
import { AppBackground } from "@/components/app-background";
import { AppFooter } from "@/components/app-footer";
import { Hero } from "@/components/hero";
import { LinkGrid } from "@/components/link-grid";
import { SocialRow } from "@/components/social-row";
import { TopBar } from "@/components/top-bar";
import { MusicPanel } from "@/components/music-panel";
import { SettingsDialog } from "@/components/settings-panel";
import { CommentsPanel } from "@/components/comments-panel";

export default function Page() {
  const imgLoaded = useMain((s) => s.imgLoaded);
  const wallpaperPeek = useMain((s) => s.wallpaperPeek);

  const greetedRef = useRef(false);
  const handleLoadComplete = () => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    toast(`${getHello()}，欢迎回来`);
    const anniv = getAnniversary();
    if (anniv) toast(`今天是${anniv}`, { duration: 10000 });
  };

  useEffect(() => {
    if (!imgLoaded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useMain.getState().set("wallpaperPeek", false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgLoaded]);

  return (
    <>
      <ThemeProvider />
      <AppLoading />
      <AppBackground onLoadComplete={handleLoadComplete} />
      <AnimatePresence>
        {imgLoaded && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: wallpaperPeek ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={wallpaperPeek ? "pointer-events-none" : ""}
          >
            <TopBar />
            <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-12 px-6 py-24 safe-top safe-bottom">
              <Hero />
              <LinkGrid />
              <SocialRow />
              <AppFooter />
            </main>
            <MusicPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {imgLoaded && (
        <>
          <SettingsDialog />
          <CommentsPanel />
        </>
      )}
    </>
  );
}
