"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListMusic, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MusicEngine, PlaylistView, type PlayerHandle } from "./music-player";

export function MusicPanel() {
  const open = useMain((s) => s.musicOpen);
  const playerState = useMain((s) => s.playerState);
  const title = useMain((s) => s.playerTitle);
  const artist = useMain((s) => s.playerArtist);
  const musicIsOk = useMain((s) => s.musicIsOk);
  const setStore = useMain((s) => s.set);

  const playerRef = useRef<PlayerHandle | null>(null);
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!useMain.getState().musicIsOk) return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (e.code === "Space" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        playerRef.current?.toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!siteConfig.songId) return null;

  return (
    <>
      <MusicEngine
        ref={playerRef}
        server={siteConfig.songServer}
        type={siteConfig.songType}
        id={siteConfig.songId}
      />

      {musicIsOk && !open && (
        <button
          type="button"
          aria-label="打开音乐播放器"
          onClick={() => setStore("musicOpen", true)}
          className="focus-ring fixed bottom-4 left-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur transition-colors hover:bg-black/60 hover:text-white safe-bottom"
        >
          <ListMusic size={16} aria-hidden />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 flex min-w-[280px] max-w-[92vw] items-center gap-2 rounded-full border border-white/15 bg-black/50 px-2 py-1.5 text-white backdrop-blur-md safe-bottom"
          >
            <IconBtn label="上一首" onClick={() => playerRef.current?.prev()}>
              <SkipBack size={14} />
            </IconBtn>
            <IconBtn
              label={playerState ? "暂停" : "播放"}
              onClick={() => playerRef.current?.toggle()}
            >
              {playerState ? <Pause size={16} /> : <Play size={16} />}
            </IconBtn>
            <IconBtn label="下一首" onClick={() => playerRef.current?.next()}>
              <SkipForward size={14} />
            </IconBtn>
            <div className="min-w-0 flex-1 px-1 text-xs">
              <div className="truncate">
                {title ? (
                  <>
                    <span>{title}</span>
                    <span className="mx-1 text-white/40">·</span>
                    <span className="text-white/60">{artist}</span>
                  </>
                ) : (
                  <span className="text-white/60">未播放</span>
                )}
              </div>
            </div>
            <IconBtn label="播放列表" onClick={() => setListOpen(true)}>
              <ListMusic size={14} />
            </IconBtn>
            <IconBtn label="收起播放器" onClick={() => setStore("musicOpen", false)}>
              <X size={14} />
            </IconBtn>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogContent className="flex h-[70vh] max-w-xl flex-col p-4">
          <DialogTitle className="sr-only">播放列表</DialogTitle>
          <div className="min-h-0 flex-1">
            <PlaylistView onSelect={(i) => playerRef.current?.playAt(i)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
