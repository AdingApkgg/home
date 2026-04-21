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
    if (!siteConfig.artalkServer || !siteConfig.artalkSite) return;
    let cancelled = false;
    (async () => {
      try {
        const [{ default: Artalk }] = await Promise.all([
          import("artalk"),
          import("artalk/Artalk.css"),
        ]);
        if (cancelled || !mountRef.current) return;
        artalkRef.current = Artalk.init({
          el: mountRef.current,
          server: siteConfig.artalkServer,
          site: siteConfig.artalkSite,
          pageKey: typeof window === "undefined" ? "/" : window.location.pathname,
          pageTitle: siteConfig.siteName,
          darkMode: true,
          locale: "zh-CN",
        });
      } catch (err) {
        console.error("[Artalk] init failed:", err);
      }
    })();
    return () => {
      cancelled = true;
      artalkRef.current?.destroy?.();
      artalkRef.current = null;
    };
  }, [open]);

  const configured = Boolean(siteConfig.artalkServer && siteConfig.artalkSite);

  return (
    <Dialog open={open} onOpenChange={(v) => setStore("commentsOpen", v)}>
      <DialogContent className="flex h-[80vh] max-w-3xl flex-col overflow-hidden p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <DialogTitle className="text-sm font-medium tracking-wide text-white/90">留言板</DialogTitle>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {configured ? (
            <div ref={mountRef} />
          ) : (
            <p className="text-sm text-white/60">
              未配置评论服务，请设置环境变量 <code className="text-white/80">NEXT_PUBLIC_ARTALK_SERVER</code> 与 <code className="text-white/80">NEXT_PUBLIC_ARTALK_SITE</code>。
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
