"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ListMusic, Mic2, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX, X,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { MusicEngine, PlaylistView, type PlayerHandle } from "./music-player";
import { NowPlayingFullscreen } from "./music-now-playing";

export function MusicPanel() {
  const open = useMain((s) => s.musicOpen);
  const playerState = useMain((s) => s.playerState);
  const title = useMain((s) => s.playerTitle);
  const artist = useMain((s) => s.playerArtist);
  const musicIsOk = useMain((s) => s.musicIsOk);
  const volume = useMain((s) => s.musicVolume);
  const nowPlayingOpen = useMain((s) => s.nowPlayingOpen);
  const setStore = useMain((s) => s.set);

  const playerRef = useRef<PlayerHandle | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const volumeWrapRef = useRef<HTMLDivElement | null>(null);
  const lastVolumeRef = useRef(volume > 0 ? volume : 0.7);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!useMain.getState().musicIsOk || e.code !== "Space") return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      e.preventDefault();
      playerRef.current?.toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close the volume popover when clicking elsewhere or hitting Escape.
  useEffect(() => {
    if (!volumeOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!volumeWrapRef.current?.contains(e.target as Node)) setVolumeOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVolumeOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onEsc);
    };
  }, [volumeOpen]);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const setVol = (v: number) => {
    if (v > 0) lastVolumeRef.current = v;
    playerRef.current?.setVolume(v);
  };

  const toggleMute = () => {
    if (volume > 0) setVol(0);
    else setVol(lastVolumeRef.current || 0.7);
  };

  const openNowPlaying = () => setStore("nowPlayingOpen", true);

  if (!siteConfig.songId) return null;

  return (
    <>
      <MusicEngine
        ref={playerRef}
        server={siteConfig.songServer}
        type={siteConfig.songType}
        id={siteConfig.songId}
      />

      {musicIsOk && !open && !nowPlayingOpen && (
        <button
          type="button"
          aria-label="打开音乐播放器"
          onClick={() => setStore("musicOpen", true)}
          className="focus-ring fixed left-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/85 shadow-lg backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white safe-inset-bottom"
        >
          <ListMusic size={16} aria-hidden />
        </button>
      )}

      <AnimatePresence>
        {open && !nowPlayingOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 z-30 -translate-x-1/2 flex min-w-[320px] max-w-[92vw] items-center gap-0.5 rounded-full border border-white/15 bg-black/55 px-2 py-1.5 text-white shadow-xl backdrop-blur-md safe-inset-bottom"
          >
            <IconBtn label="上一首" onClick={() => playerRef.current?.prev()}>
              <SkipBack size={15} />
            </IconBtn>
            <IconBtn
              label={playerState ? "暂停" : "播放"}
              onClick={() => playerRef.current?.toggle()}
              size="lg"
            >
              {playerState ? <Pause size={18} /> : <Play size={18} />}
            </IconBtn>
            <IconBtn label="下一首" onClick={() => playerRef.current?.next()}>
              <SkipForward size={15} />
            </IconBtn>
            <button
              type="button"
              aria-label="打开全屏播放器"
              onClick={openNowPlaying}
              className="focus-ring min-w-0 flex-1 rounded-full px-2 py-1 text-left text-xs transition-colors hover:bg-white/10"
            >
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
            </button>
            <div ref={volumeWrapRef} className="relative">
              <IconBtn
                label={volumeOpen ? "关闭音量" : "音量"}
                onClick={() => setVolumeOpen((v) => !v)}
              >
                <VolumeIcon size={15} />
              </IconBtn>
              <AnimatePresence>
                {volumeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3 py-2 shadow-xl backdrop-blur-md"
                  >
                    <button
                      type="button"
                      aria-label={volume === 0 ? "取消静音" : "静音"}
                      onClick={toggleMute}
                      className="focus-ring inline-flex h-6 w-6 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                    >
                      <VolumeIcon size={13} />
                    </button>
                    <Slider
                      value={[Math.round(volume * 100)]}
                      max={100}
                      step={1}
                      aria-label="音量"
                      onValueChange={([v]) => setVol((v ?? 0) / 100)}
                      className="w-28"
                    />
                    <span className="w-7 shrink-0 text-right text-[11px] tabular-nums text-white/70">
                      {Math.round(volume * 100)}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <IconBtn label="歌词与全屏播放器" onClick={openNowPlaying}>
              <Mic2 size={15} />
            </IconBtn>
            <IconBtn label="播放列表" onClick={() => setListOpen(true)}>
              <ListMusic size={15} />
            </IconBtn>
            <IconBtn label="收起播放器" onClick={() => setStore("musicOpen", false)}>
              <X size={15} />
            </IconBtn>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogContent className="flex h-[70vh] max-w-xl flex-col p-4">
          <DialogTitle className="sr-only">播放列表</DialogTitle>
          <div className="min-h-0 flex-1">
            <PlaylistView
              onSelect={(i) => {
                playerRef.current?.playAt(i);
                setListOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <NowPlayingFullscreen
        playerRef={playerRef}
        onOpenPlaylist={() => setListOpen(true)}
      />
    </>
  );
}

function IconBtn({
  label,
  onClick,
  children,
  size = "md",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? "h-9 w-9" : "h-7 w-7";
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`focus-ring inline-flex ${dims} items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white`}
    >
      {children}
    </button>
  );
}
