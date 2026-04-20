"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";
import { useIsMobile } from "@/hooks/use-mobile";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MusicEngine, PlaylistView, type PlayerHandle } from "./music-player";

declare global {
  interface Window { $openList?: () => void }
}

export function MusicPanel() {
  const musicOpenState = useMain((s) => s.musicOpenState);
  const playerState = useMain((s) => s.playerState);
  const playerTitle = useMain((s) => s.playerTitle);
  const playerArtist = useMain((s) => s.playerArtist);
  const musicVolume = useMain((s) => s.musicVolume);
  const setStore = useMain((s) => s.set);
  const isMobile = useIsMobile();

  const playerRef = useRef<PlayerHandle | null>(null);
  const [desktopVol, setDesktopVol] = useState(false);
  const [mobileVol, setMobileVol] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!useMain.getState().musicIsOk) return;
      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        playerRef.current?.toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    window.$openList = () => setListOpen(true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.$openList = undefined;
    };
  }, []);

  const volShowing = isMobile ? mobileVol : desktopVol;

  return (
    <>
      {/* headless engine: single mount, never unmounts */}
      <MusicEngine
        ref={playerRef}
        server={siteConfig.songServer}
        type={siteConfig.songType}
        id={siteConfig.songId}
      />

      <AnimatePresence>
        {musicOpenState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseEnter={() => setDesktopVol(true)}
            onMouseLeave={() => setDesktopVol(false)}
            className="h-full w-full rounded-2xl bg-black/40 backdrop-blur-md p-5 flex flex-col justify-between items-center text-white"
          >
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap justify-center">
              <Chip onClick={() => setListOpen(true)}>音乐列表</Chip>
              {isMobile && (
                <Chip onClick={() => setMobileVol((v) => !v)}>{mobileVol ? "隐藏音量" : "调节音量"}</Chip>
              )}
              <Chip onClick={() => setStore("musicOpenState", false)}>回到一言</Chip>
            </div>
            <div className="flex flex-row items-center justify-evenly w-full">
              <button onClick={() => playerRef.current?.prev()} className="p-2 rounded-md hover:bg-white/20 active:scale-95 transition-transform">
                <SkipBack size={28} className="fill-white text-white" />
              </button>
              <AnimatePresence mode="wait">
                <motion.button
                  key={String(playerState)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => playerRef.current?.toggle()}
                  className="p-2 rounded-md hover:bg-white/20 active:scale-95 transition-transform"
                >
                  {playerState ? <Pause size={48} className="fill-white text-white" /> : <Play size={48} className="fill-white text-white" />}
                </motion.button>
              </AnimatePresence>
              <button onClick={() => playerRef.current?.next()} className="p-2 rounded-md hover:bg-white/20 active:scale-95 transition-transform">
                <SkipForward size={28} className="fill-white text-white" />
              </button>
            </div>
            <div className="h-6 w-full flex items-center justify-center">
              {!volShowing ? (
                <div className="w-full text-center truncate animate-fade-in">
                  {playerTitle ? `${playerTitle} - ${playerArtist}` : "未播放音乐"}
                </div>
              ) : (
                <div className="w-full px-3 flex items-center gap-3 animate-fade-in">
                  <div className="shrink-0">
                    {musicVolume === 0 ? <VolumeX size={20} /> : musicVolume < 0.7 ? <Volume1 size={20} /> : <Volume2 size={20} />}
                  </div>
                  <Slider
                    value={[musicVolume]}
                    min={0} max={1} step={0.01}
                    onValueChange={(v) => playerRef.current?.setVolume(v[0] ?? 0)}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogContent className="max-w-xl h-[70vh] p-4 flex flex-col">
          <div className="flex-1 min-h-0">
            <PlaylistView onSelect={(i) => playerRef.current?.playAt(i)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/20 hover:bg-white/30 active:bg-white/40 px-2.5 py-1 rounded-md text-sm whitespace-nowrap"
    >
      {children}
    </button>
  );
}
