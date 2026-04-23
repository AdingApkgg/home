"use client";

import { useEffect, useImperativeHandle, useRef, useState, forwardRef, useCallback } from "react";
import { toast } from "sonner";
import { CircleX, Music as MusicIcon } from "lucide-react";
import { getPlayerList } from "@/lib/api";
import { useMain } from "@/store/main";

export interface PlayerHandle {
  toggle: () => void;
  prev: () => void;
  next: () => void;
  setVolume: (v: number) => void;
  playAt: (i: number) => void;
}

interface Props {
  server: string;
  type: string;
  id: string;
}

/** Headless audio engine. Mount once, expose imperative API, sync state via store. */
export const MusicEngine = forwardRef<PlayerHandle, Props>(function MusicEngine(
  { server, type, id },
  ref,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true);

  const list = useMain((s) => s.playList);
  const current = useMain((s) => s.playIndex);
  const loopMode = useMain((s) => s.playerLoop);
  const orderMode = useMain((s) => s.playerOrder);
  const autoplay = useMain((s) => s.playerAutoplay);
  const volume = useMain((s) => s.musicVolume);
  const setPlayerData = useMain((s) => s.setPlayerData);
  const setStore = useMain((s) => s.set);

  useEffect(() => {
    let cancelled = false;
    getPlayerList(server, type, id)
      .then((res) => {
        if (cancelled) return;
        setStore("playList", res);
        setStore("musicIsOk", res.length > 0);
      })
      .catch((err) => {
        console.error(err);
        setStore("musicIsOk", false);
        toast.error("播放器加载失败", { icon: <CircleX size={18} /> });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [server, type, id, setStore]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = Math.min(1, Math.max(0, volume));
  }, [volume]);

  const playAt = useCallback(
    (i: number) => {
      const l = useMain.getState().playList;
      if (i < 0 || i >= l.length) return;
      setStore("playIndex", i);
      const song = l[i];
      if (song) {
        setPlayerData(song.name, song.artist);
        toast(`${song.name} - ${song.artist}`, { icon: <MusicIcon size={18} /> });
      }
      requestAnimationFrame(() => {
        audioRef.current?.play().catch(() => {});
      });
    },
    [setStore, setPlayerData],
  );

  const next = useCallback(() => {
    const l = useMain.getState().playList;
    const c = useMain.getState().playIndex;
    if (!l.length) return;
    let i = c;
    if (orderMode === "random") i = Math.floor(Math.random() * l.length);
    else i = (c + 1) % l.length;
    playAt(i);
  }, [orderMode, playAt]);

  const prev = useCallback(() => {
    const l = useMain.getState().playList;
    const c = useMain.getState().playIndex;
    if (!l.length) return;
    playAt((c - 1 + l.length) % l.length);
  }, [playAt]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  }, []);

  const setVolume = useCallback(
    (v: number) => {
      if (audioRef.current) audioRef.current.volume = Math.min(1, Math.max(0, v));
      setStore("musicVolume", v);
    },
    [setStore],
  );

  useImperativeHandle(ref, () => ({ toggle, prev, next, setVolume, playAt }), [toggle, prev, next, setVolume, playAt]);

  useEffect(() => {
    if (!loading && autoplay && list.length && audioRef.current) {
      playAt(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (list[current]) setPlayerData(list[current].name, list[current].artist);
  }, [list, current, setPlayerData]);

  const onEnded = useCallback(() => {
    if (loopMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }
    const l = useMain.getState().playList;
    const c = useMain.getState().playIndex;
    if (loopMode === "none" && c === l.length - 1) {
      setStore("playerState", false);
      return;
    }
    next();
  }, [loopMode, next, setStore]);

  const onError = useCallback(() => {
    const l = useMain.getState().playList;
    toast.error(l.length > 1 ? "播放歌曲出错，2s 后切换" : "播放歌曲出错");
    if (l.length > 1) setTimeout(next, 2000);
  }, [next]);

  const song = list[current];

  return (
    <audio
      ref={audioRef}
      src={song?.url}
      onPlay={() => setStore("playerState", true)}
      onPause={() => setStore("playerState", false)}
      onEnded={onEnded}
      onError={onError}
      preload="metadata"
    />
  );
});

/** List view — reads from store, calls playAt via provided ref. */
export function PlaylistView({ onSelect }: { onSelect: (i: number) => void }) {
  const list = useMain((s) => s.playList);
  const current = useMain((s) => s.playIndex);

  if (!list.length) return <div className="p-6 text-center text-white/60">加载中…</div>;

  const song = list[current];
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
        <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-white/10">
          {song?.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={song.cover} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{song?.name}</div>
          <div className="truncate text-xs text-white/70">{song?.artist}</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar rounded-xl bg-white/5 p-2">
        {list.map((s, i) => (
          <button
            key={`${s.name}-${i}`}
            onClick={() => onSelect(i)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
              i === current ? "bg-white/25" : "hover:bg-white/10"
            }`}
          >
            <span className="w-6 text-xs text-white/50 tabular-nums">{i + 1}</span>
            <span className="truncate flex-1">{s.name}</span>
            <span className="truncate text-xs text-white/60 w-28 text-right">{s.artist}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
