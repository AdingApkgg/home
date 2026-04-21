"use client";

import { useEffect, useRef } from "react";
import { useMain } from "@/store/main";
import { siteConfig } from "@/lib/config";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type ArtalkInstance = { destroy?: () => void };

export function CommentsPanel() {
  const open = useMain((s) => s.commentsOpen);
  const setStore = useMain((s) => s.set);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const artalkRef = useRef<ArtalkInstance | null>(null);

  useEffect(() => {
    if (!open || !mountRef.current || artalkRef.current) return;
    let cancelled = false;
    (async () => {
      const [{ default: Artalk }] = await Promise.all([
        import("artalk"),
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
    <Dialog open={open} onOpenChange={(v) => setStore("commentsOpen", v)}>
      <DialogContent className="flex h-[80vh] max-w-3xl flex-col overflow-hidden p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <DialogTitle className="text-sm font-medium tracking-wide text-white/90">留言板</DialogTitle>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div ref={mountRef} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
