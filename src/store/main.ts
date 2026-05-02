import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song } from "@/lib/api";

export type LoopMode = "all" | "one" | "none";
export type OrderMode = "list" | "random";
export type CoverType = "0" | "1" | "2" | "3";

interface MainState {
  // runtime
  imgLoaded: boolean;
  wallpaperUrl: string | null;
  settingsOpen: boolean;
  commentsOpen: boolean;
  musicOpen: boolean;
  musicIsOk: boolean;
  playerState: boolean;
  playerTitle: string | null;
  playerArtist: string | null;
  playList: Song[];
  playIndex: number;
  playerCurrentTime: number;
  playerDuration: number;
  nowPlayingOpen: boolean;

  // persistent
  coverType: CoverType;
  musicVolume: number;
  playerAutoplay: boolean;
  playerLoop: LoopMode;
  playerOrder: OrderMode;

  // actions
  set: <K extends keyof MainState>(key: K, value: MainState[K]) => void;
  setPlayerData: (title: string | null, artist: string | null) => void;
}

export const useMain = create<MainState>()(
  persist(
    (set) => ({
      imgLoaded: false,
      wallpaperUrl: null,
      settingsOpen: false,
      commentsOpen: false,
      musicOpen: false,
      musicIsOk: false,
      playerState: false,
      playerTitle: null,
      playerArtist: null,
      playList: [],
      playIndex: 0,
      playerCurrentTime: 0,
      playerDuration: 0,
      nowPlayingOpen: false,

      coverType: "0",
      musicVolume: 0.7,
      playerAutoplay: false,
      playerLoop: "all",
      playerOrder: "list",

      set: (key, value) => set({ [key]: value } as Partial<MainState>),
      setPlayerData: (playerTitle, playerArtist) => set({ playerTitle, playerArtist }),
    }),
    {
      name: "data",
      partialize: (s) => ({
        coverType: s.coverType,
        musicVolume: s.musicVolume,
        playerAutoplay: s.playerAutoplay,
        playerLoop: s.playerLoop,
        playerOrder: s.playerOrder,
      }),
    },
  ),
);
