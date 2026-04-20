"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMain } from "@/store/main";
import { useIsMobile } from "@/hooks/use-mobile";
import { siteConfig } from "@/lib/config";
import { getAnniversary, getHello } from "@/lib/get-time";
import { initCursor } from "@/lib/cursor";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLoading } from "@/components/app-loading";
import { AppBackground } from "@/components/app-background";
import { AppFooter } from "@/components/app-footer";
import { MainLeft } from "@/components/main-left";
import { MainRight } from "@/components/main-right";
import { BoxPanel } from "@/components/box-panel";
import { MoreSet } from "@/components/more-set";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { CommentsPanel } from "@/components/comments-panel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function Page() {
  const imgLoaded = useMain((s) => s.imgLoadStatus);
  const backgroundShow = useMain((s) => s.backgroundShow);
  const boxOpen = useMain((s) => s.boxOpenState);
  const setOpen = useMain((s) => s.setOpenState);
  const setStore = useMain((s) => s.set);
  const setInnerWidth = useMain((s) => s.setInnerWidth);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onResize = () => setInnerWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);

    const onMouse = (e: MouseEvent) => {
      if (e.button === 1) {
        const next = !useMain.getState().backgroundShow;
        setStore("backgroundShow", next);
        toast(`已${next ? "开启" : "退出"}壁纸展示状态`);
      }
    };
    window.addEventListener("mousedown", onMouse);

    const onCtx = (e: MouseEvent) => {
      e.preventDefault();
      toast("为了浏览体验，本站禁用右键");
    };
    document.addEventListener("contextmenu", onCtx);

    let cursorCleanup: (() => void) | null = null;
    const deferInit = () => {
      if (window.matchMedia("(pointer: fine)").matches) {
        cursorCleanup = initCursor();
      }
    };
    const ric = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const idleId = ric(deferInit);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousedown", onMouse);
      document.removeEventListener("contextmenu", onCtx);
      cursorCleanup?.();
      cic(idleId);
    };
  }, [setInnerWidth, setStore]);

  const handleLoadComplete = () => {
    const hello = getHello();
    toast(`${hello} 欢迎来到 ${siteConfig.siteName}`);
    const anniv = getAnniversary();
    if (anniv) {
      toast(`今天是${anniv}`, { duration: 14000 });
      const s = document.createElement("style");
      s.innerHTML = "html{filter: grayscale(100%)}";
      document.head.appendChild(s);
    }
  };

  return (
    <>
      <ThemeProvider />
      <AppLoading />
      <AppBackground onLoadComplete={handleLoadComplete} />
      <AnimatePresence mode="wait">
        {imgLoaded && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 animate-fade-blur-main-in"
          >
            <div className={`mx-auto h-screen w-full px-2 transition-opacity ${backgroundShow ? "opacity-0 pointer-events-none" : ""}`}>
              {!setOpen && (
                <section className="w-full h-full px-3 flex items-center justify-center">
                  <MainLeft />
                  {(!boxOpen || isMobile) && <MainRight />}
                  {boxOpen && !isMobile && <BoxPanel />}
                </section>
              )}
              {setOpen && (
                <section
                  onClick={() => setStore("setOpenState", false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-xl z-[var(--z-fixed)] animate-fade-in"
                >
                  <MoreSet />
                </section>
              )}
            </div>
            {!backgroundShow && <MobileActionBar />}
            <AnimatePresence mode="wait">
              {!backgroundShow && !setOpen && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AppFooter />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Mobile Box Dialog */}
      <Dialog
        open={isMobile && boxOpen}
        onOpenChange={(v) => setStore("boxOpenState", v)}
      >
        <DialogContent className="max-w-md h-[70vh] p-0 overflow-hidden">
          <DialogTitle className="sr-only">功能</DialogTitle>
          <BoxPanel className="w-full max-w-none ml-0 h-full" />
        </DialogContent>
      </Dialog>

      <CommentsPanel />
    </>
  );
}
