import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song } from "@/lib/api";

export type LoopMode = "all" | "one" | "none";
export type OrderMode = "list" | "random";
export type CoverType = "0" | "1" | "2" | "3";

export const THEME_STYLES = ["zinc", "slate", "stone", "gray", "neutral", "red", "rose", "orange", "green", "blue", "yellow", "violet"] as const;
export type ThemeStyle = (typeof THEME_STYLES)[number];

interface MainState {
  // runtime
  imgLoadStatus: boolean;
  innerWidth: number | null;
  musicIsOk: boolean;
  musicOpenState: boolean;
  backgroundShow: boolean;
  boxOpenState: boolean;
  mobileOpenState: boolean;
  mobileFuncState: boolean;
  setOpenState: boolean;
  commentOpenState: boolean;
  playerState: boolean;
  playerTitle: string | null;
  playerArtist: string | null;
  playerLrc: string;
  playList: Song[];
  playIndex: number;

  // persistent (user settings)
  coverType: CoverType;
  siteStartShow: boolean;
  musicClick: boolean;
  musicVolume: number;
  playerLrcShow: boolean;
  footerBlur: boolean;
  playerAutoplay: boolean;
  playerLoop: LoopMode;
  playerOrder: OrderMode;
  themeStyle: ThemeStyle | null; // null = random each session

  // actions
  set: <K extends keyof MainState>(key: K, value: MainState[K]) => void;
  setInnerWidth: (v: number) => void;
  setPlayerData: (title: string | null, artist: string | null) => void;
  setPlayerLrc: (v: string) => void;
}

export const useMain = create<MainState>()(
  persist(
    (set) => ({
      imgLoadStatus: false,
      innerWidth: null,
      musicIsOk: false,
      musicOpenState: false,
      backgroundShow: false,
      boxOpenState: false,
      mobileOpenState: false,
      mobileFuncState: false,
      setOpenState: false,
      commentOpenState: false,
      playerState: false,
      playerTitle: null,
      playerArtist: null,
      playerLrc: "歌词加载中",
      playList: [],
      playIndex: 0,

      coverType: "0",
      siteStartShow: false,
      musicClick: false,
      musicVolume: 0.7,
      playerLrcShow: true,
      footerBlur: true,
      playerAutoplay: false,
      playerLoop: "all",
      playerOrder: "list",
      themeStyle: null,

      set: (key, value) => set({ [key]: value } as Partial<MainState>),
      setInnerWidth: (v) =>
        set((s) => ({
          innerWidth: v,
          mobileOpenState: v >= 720 ? false : s.mobileOpenState,
          mobileFuncState: v >= 720 ? false : s.mobileFuncState,
        })),
      setPlayerData: (playerTitle, playerArtist) => set({ playerTitle, playerArtist }),
      setPlayerLrc: (playerLrc) => set({ playerLrc }),
    }),
    {
      name: "data",
      partialize: (s) => ({
        coverType: s.coverType,
        siteStartShow: s.siteStartShow,
        musicClick: s.musicClick,
        musicVolume: s.musicVolume,
        playerLrcShow: s.playerLrcShow,
        footerBlur: s.footerBlur,
        playerAutoplay: s.playerAutoplay,
        playerLoop: s.playerLoop,
        playerOrder: s.playerOrder,
        themeStyle: s.themeStyle,
      }),
    },
  ),
);
