import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song } from "@/lib/api";

export type LoopMode = "all" | "one" | "none";
export type OrderMode = "list" | "random";
export type CoverType = "0" | "1" | "2" | "3";

export const THEME_STYLES = [
  "zinc", "slate", "stone", "gray", "neutral",
  "red", "rose", "orange", "green", "blue", "yellow", "violet",
] as const;
export type ThemeStyle = (typeof THEME_STYLES)[number];

interface MainState {
  // runtime
  imgLoaded: boolean;
  wallpaperPeek: boolean;
  settingsOpen: boolean;
  commentsOpen: boolean;
  musicOpen: boolean;
  musicIsOk: boolean;
  playerState: boolean;
  playerTitle: string | null;
  playerArtist: string | null;
  playList: Song[];
  playIndex: number;

  // persistent
  coverType: CoverType;
  musicVolume: number;
  playerAutoplay: boolean;
  playerLoop: LoopMode;
  playerOrder: OrderMode;
  themeStyle: ThemeStyle | null;

  // actions
  set: <K extends keyof MainState>(key: K, value: MainState[K]) => void;
  setPlayerData: (title: string | null, artist: string | null) => void;
}

export const useMain = create<MainState>()(
  persist(
    (set) => ({
      imgLoaded: false,
      wallpaperPeek: false,
      settingsOpen: false,
      commentsOpen: false,
      musicOpen: false,
      musicIsOk: false,
      playerState: false,
      playerTitle: null,
      playerArtist: null,
      playList: [],
      playIndex: 0,

      coverType: "0",
      musicVolume: 0.7,
      playerAutoplay: false,
      playerLoop: "all",
      playerOrder: "list",
      themeStyle: null,

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
        themeStyle: s.themeStyle,
      }),
    },
  ),
);
