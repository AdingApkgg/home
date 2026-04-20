"use client";

import { useEffect, useRef } from "react";
import { useMain } from "@/store/main";
import { siteConfig } from "@/lib/config";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type ArtalkInstance = { destroy?: () => void };

export function CommentsPanel() {
  const open = useMain((s) => s.commentOpenState);
  const setStore = useMain((s) => s.set);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const artalkRef = useRef<ArtalkInstance | null>(null);

  useEffect(() => {
    if (!open || !mountRef.current || artalkRef.current) return;
    let cancelled = false;
    (async () => {
      const [{ default: Artalk }] = await Promise.all([
        import("artalk"),
        // @ts-expect-error no types for css side-effect import
        import("artalk/dist/Artalk.css"),
      ]);
      if (cancelled || !mountRef.current) return;
      artalkRef.current = Artalk.init({
        el: mountRef.current,
        server: siteConfig.artalkServer,
        site: siteConfig.artalkSite,
        pageKey: "/",
        pageTitle: siteConfig.siteName,
        darkMode: true,
        locale: "zh-CN",
      });
    })();
    return () => {
      cancelled = true;
      artalkRef.current?.destroy?.();
      artalkRef.current = null;
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => setStore("commentOpenState", v)}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
          <DialogTitle>留言板</DialogTitle>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div ref={mountRef} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
