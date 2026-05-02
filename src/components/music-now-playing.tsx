"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown, ListMusic, Pause, Play, SkipBack, SkipForward,
  Volume1, Volume2, VolumeX,
} from "lucide-react";
import { useMain } from "@/store/main";
import { getLyrics, type LyricLine, type Song } from "@/lib/api";
import { Slider } from "@/components/ui/slider";
import type { PlayerHandle } from "./music-player";

const fmt = (t: number) => {
  const safe = Number.isFinite(t) && t > 0 ? t : 0;
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

interface Props {
  playerRef: RefObject<PlayerHandle | null>;
  onOpenPlaylist: () => void;
}

export function NowPlayingFullscreen({ playerRef, onOpenPlaylist }: Props) {
  const open = useMain((s) => s.nowPlayingOpen);
  const setStore = useMain((s) => s.set);
  const playList = useMain((s) => s.playList);
  const playIndex = useMain((s) => s.playIndex);
  const playerState = useMain((s) => s.playerState);
  const title = useMain((s) => s.playerTitle);
  const artist = useMain((s) => s.playerArtist);
  const volume = useMain((s) => s.musicVolume);
  const currentTime = useMain((s) => s.playerCurrentTime);
  const duration = useMain((s) => s.playerDuration);
  const song = playList[playIndex];

  const [scrubbing, setScrubbing] = useState<number | null>(null);

  // ESC closes the overlay; mirrors the existing dialog UX.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStore("nowPlayingOpen", false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setStore]);

  // Lock background scroll while the fullscreen player is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const safeDuration = duration > 0 ? duration : 1;
  const displayTime = scrubbing ?? currentTime;
  const sliderValue = Math.min(1000, Math.max(0, (displayTime / safeDuration) * 1000));

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const controls = (
    <>
      <Slider
        value={[sliderValue]}
        max={1000}
        step={1}
        aria-label="播放进度"
        onValueChange={([v]) => setScrubbing(((v ?? 0) / 1000) * safeDuration)}
        onValueCommit={([v]) => {
          playerRef.current?.seek(((v ?? 0) / 1000) * safeDuration);
          setScrubbing(null);
        }}
        className="w-full"
      />
      <div className="mt-1.5 flex items-center justify-between text-[11px] tabular-nums text-white/55">
        <span>{fmt(displayTime)}</span>
        <span>{fmt(duration)}</span>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 sm:gap-10">
        <button
          type="button"
          aria-label="上一首"
          onClick={() => playerRef.current?.prev()}
          className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white"
        >
          <SkipBack size={22} />
        </button>
        <button
          type="button"
          aria-label={playerState ? "暂停" : "播放"}
          onClick={() => playerRef.current?.toggle()}
          className="focus-ring inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          {playerState ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" className="translate-x-0.5" />
          )}
        </button>
        <button
          type="button"
          aria-label="下一首"
          onClick={() => playerRef.current?.next()}
          className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white"
        >
          <SkipForward size={22} />
        </button>
      </div>
      <div className="mx-auto mt-5 flex max-w-md items-center gap-3">
        <VolumeIcon size={16} className="shrink-0 text-white/65" />
        <Slider
          value={[Math.round(volume * 100)]}
          max={100}
          step={1}
          aria-label="音量"
          onValueChange={([v]) => playerRef.current?.setVolume((v ?? 0) / 100)}
          className="flex-1"
        />
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="now-playing"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 overflow-hidden text-white"
        >
          {/* Blurred album-art backdrop, with a dark wash so the lyrics stay legible. */}
          <div className="absolute inset-0">
            {song?.cover ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={song.cover}
                  alt=""
                  className="h-full w-full scale-125 object-cover blur-3xl saturate-150"
                />
                <div className="absolute inset-0 bg-black/55" />
              </>
            ) : (
              <div className="absolute inset-0 bg-zinc-900" />
            )}
          </div>

          <div className="relative flex h-full w-full flex-col safe-top safe-bottom">
            <div className="flex items-center justify-between px-5 py-3">
              <button
                type="button"
                aria-label="收起播放器"
                onClick={() => setStore("nowPlayingOpen", false)}
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
              >
                <ChevronDown size={20} />
              </button>
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                正在播放
              </div>
              <button
                type="button"
                aria-label="播放列表"
                onClick={onOpenPlaylist}
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
              >
                <ListMusic size={18} />
              </button>
            </div>

            {/* Main: mobile = stacked (cover row, lyrics, controls).
                Desktop = side-by-side (cover column on left, lyrics on right);
                controls live at the bottom across full width on both. */}
            <div className="flex min-h-0 flex-1 flex-col md:flex-row md:items-stretch md:gap-10 lg:gap-16 px-5 sm:px-10 md:px-12 lg:px-20">
              <aside className="flex items-center gap-4 pb-3 sm:pb-5 md:w-72 md:shrink-0 md:flex-col md:items-center md:justify-center md:gap-6 md:py-4 md:pb-4 lg:w-80 xl:w-96">
                <div
                  className={`relative aspect-square overflow-hidden rounded-2xl bg-white/5 shadow-2xl transition-transform duration-500 ease-out w-20 sm:w-24 md:w-full ${
                    playerState ? "scale-100" : "scale-90 md:scale-[0.97]"
                  }`}
                >
                  {song?.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={song.cover} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1 md:flex-none md:w-full md:text-center">
                  <div className="truncate text-lg font-semibold sm:text-xl md:mt-2 md:text-2xl">
                    {title ?? "未播放"}
                  </div>
                  <div className="truncate text-sm text-white/65 md:mt-1 md:text-base">
                    {artist ?? ""}
                  </div>
                </div>
              </aside>

              <div className="flex min-h-0 flex-1 flex-col md:py-4">
                <FullscreenLyrics song={song} />
              </div>
            </div>

            <div className="px-5 pb-3 pt-2 sm:px-10 sm:pb-5 md:px-12 md:pb-6 lg:px-20">
              <div className="mx-auto md:max-w-2xl">{controls}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type LyricsState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; lines: LyricLine[] }
  | { kind: "empty" }
  | { kind: "error" };

function FullscreenLyrics({ song }: { song: Song | undefined }) {
  const [state, setState] = useState<LyricsState>({ kind: "idle" });
  const currentTime = useMain((s) => s.playerCurrentTime);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!song?.lrc) {
      setState({ kind: "empty" });
      return;
    }
    let cancelled = false;
    setState({ kind: "loading" });
    getLyrics(song.lrc)
      .then((lines) => {
        if (cancelled) return;
        setState(lines.length ? { kind: "ready", lines } : { kind: "empty" });
      })
      .catch(() => !cancelled && setState({ kind: "error" }));
    return () => {
      cancelled = true;
    };
  }, [song?.lrc]);

  const lines = state.kind === "ready" ? state.lines : null;

  const activeIdx = useMemo(() => {
    if (!lines) return -1;
    let lo = 0;
    let hi = lines.length - 1;
    let ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const line = lines[mid];
      if (line && line.time <= currentTime) {
        ans = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  }, [lines, currentTime]);

  // Keep the active line near vertical center. Avoid scrollIntoView so we
  // don't accidentally scroll any ancestor when the panel briefly mounts.
  useEffect(() => {
    if (activeIdx < 0) return;
    const root = containerRef.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>(`[data-i="${activeIdx}"]`);
    if (!el) return;
    const target = el.offsetTop - root.clientHeight / 2 + el.clientHeight / 2;
    root.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [activeIdx]);

  if (state.kind !== "ready") {
    const msg =
      state.kind === "loading"
        ? "加载中…"
        : state.kind === "empty"
          ? "暂无歌词"
          : state.kind === "error"
            ? "歌词加载失败"
            : "";
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-white/55">
        {msg}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-2 text-center md:text-left"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0, #000 12%, #000 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0, #000 12%, #000 88%, transparent 100%)",
      }}
    >
      {/* Spacer instead of paddingTop: a percentage padding feeds flex's
          min-content size and prevents shrinking, so the column can't fit. */}
      <div aria-hidden style={{ height: "40%" }} />
      {state.lines.map((line, i) => (
        <div
          key={`${line.time}-${i}`}
          data-i={i}
          className={`mx-auto max-w-2xl px-3 py-2.5 text-xl font-semibold leading-relaxed transition-all duration-500 sm:text-2xl md:mx-0 md:max-w-none md:py-3 md:text-3xl lg:text-4xl ${
            i === activeIdx
              ? "scale-[1.02] text-white"
              : i < activeIdx
                ? "text-white/30"
                : "text-white/45"
          }`}
        >
          {line.text}
        </div>
      ))}
      <div aria-hidden style={{ height: "40%" }} />
    </div>
  );
}
