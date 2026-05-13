import { useEffect, useRef, useState } from "react";
import { useMain } from "@/store/main";
import { siteConfig } from "@/lib/config";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ArtalkInstance { destroy?: () => void }
type LoadState = "idle" | "loading" | "ready" | "error";

export function CommentsPanel() {
  const open = useMain((s) => s.commentsOpen);
  const setStore = useMain((s) => s.set);
  // State (not ref) so the init effect re-runs once Radix Dialog actually
  // commits the inner DOM — useRef changes don't retrigger effects.
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const artalkRef = useRef<ArtalkInstance | null>(null);
  const [state, setState] = useState<LoadState>("idle");

  useEffect(() => {
    if (!open || !container || artalkRef.current) return;
    if (!siteConfig.artalkServer || !siteConfig.artalkSite) return;
    const cancelledRef = { current: false };
    setState("loading");
    void (async () => {
      try {
        const [{ default: Artalk }] = await Promise.all([
          import("artalk"),
          import("artalk/Artalk.css"),
        ]);
        if (cancelledRef.current) return;
        artalkRef.current = Artalk.init({
          el: container,
          server: siteConfig.artalkServer,
          site: siteConfig.artalkSite,
          pageKey: typeof window === "undefined" ? "/" : window.location.pathname,
          pageTitle: siteConfig.siteName,
          darkMode: true,
          locale: "zh-CN",
        });
        setState("ready");
      } catch (err) {
        console.error("[Artalk] init failed:", err);
        if (!cancelledRef.current) setState("error");
      }
    })();
    return () => {
      cancelledRef.current = true;
      artalkRef.current?.destroy?.();
      artalkRef.current = null;
      setState("idle");
    };
  }, [open, container]);

  const configured = Boolean(siteConfig.artalkServer && siteConfig.artalkSite);

  return (
    <Dialog open={open} onOpenChange={(v) => setStore("commentsOpen", v)}>
      <DialogContent className="flex h-[80vh] max-w-3xl flex-col overflow-hidden p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <DialogTitle className="text-sm font-medium tracking-wide text-white/90">留言板</DialogTitle>
        </div>
        <div className="relative flex-1 overflow-y-auto p-5">
          {configured ? (
            <>
              <div ref={setContainer} />
              {state === "loading" && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div
                    aria-hidden
                    className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/80"
                  />
                  <span className="sr-only">评论加载中</span>
                </div>
              )}
              {state === "error" && (
                <p className="text-sm text-white/70">
                  评论加载失败，请检查网络或评论服务是否可用。
                </p>
              )}
            </>
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
