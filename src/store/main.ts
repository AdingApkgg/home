import type { Song } from "@/lib/api";
import { createStore } from "@/lib/create-store";

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

const STORAGE_KEY = "data";

type Persisted = Pick<
  MainState,
  "coverType" | "musicVolume" | "playerAutoplay" | "playerLoop" | "playerOrder"
>;

const DEFAULTS: Persisted = {
  coverType: "0",
  musicVolume: 0.7,
  playerAutoplay: false,
  playerLoop: "all",
  playerOrder: "list",
};

const readPersisted = (): Partial<Persisted> => {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const root = JSON.parse(raw) as Record<string, unknown>;
    // zustand/persist 写的是 { state, version }，取 state；也认直接平铺的旧格式。
    const parsed = (typeof root.state === "object" && root.state !== null ? root.state : root) as Record<
      string,
      unknown
    >;
    // 只认自己写过的键，坏数据或旧版本字段一律忽略。
    const out: Partial<Persisted> = {};
    if (
      parsed.coverType === "0" ||
      parsed.coverType === "1" ||
      parsed.coverType === "2" ||
      parsed.coverType === "3"
    ) {
      out.coverType = parsed.coverType;
    }
    if (typeof parsed.musicVolume === "number") out.musicVolume = parsed.musicVolume;
    if (typeof parsed.playerAutoplay === "boolean") out.playerAutoplay = parsed.playerAutoplay;
    if (parsed.playerLoop === "all" || parsed.playerLoop === "one" || parsed.playerLoop === "none") {
      out.playerLoop = parsed.playerLoop;
    }
    if (parsed.playerOrder === "list" || parsed.playerOrder === "random")
      out.playerOrder = parsed.playerOrder;
    return out;
  } catch {
    return {};
  }
};

export const useMain = createStore<MainState>({
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

  ...DEFAULTS,
  ...readPersisted(),

  set: (key, value) => {
    useMain.setState({ [key]: value } as Partial<MainState>);
  },
  setPlayerData: (playerTitle, playerArtist) => {
    useMain.setState({ playerTitle, playerArtist });
  },
});

// 只有五个偏好设置进 localStorage，播放进度之类的运行时状态不落盘。
useMain.subscribe(() => {
  if (typeof localStorage === "undefined") return;
  const { coverType, musicVolume, playerAutoplay, playerLoop, playerOrder } = useMain.getState();
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ coverType, musicVolume, playerAutoplay, playerLoop, playerOrder }),
    );
  } catch {
    // 隐私模式下 setItem 可能抛错，偏好丢失可接受。
  }
});
