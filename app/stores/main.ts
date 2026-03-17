import { defineStore } from "pinia";

interface MainState {
  imgLoadStatus: boolean;
  innerWidth: number | null;
  coverType: string;
  siteStartShow: boolean;
  musicClick: boolean;
  musicIsOk: boolean;
  musicVolume: number;
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
  playerLrcShow: boolean;
  footerBlur: boolean;
  playerAutoplay: boolean;
  playerLoop: "all" | "one" | "none";
  playerOrder: "list" | "random";
}

export const mainStore = defineStore("main", {
  state: (): MainState => {
    const c = useRuntimeConfig().public;
    return {
      imgLoadStatus: false,
      innerWidth: null,
      coverType: c.defaultCoverType as string,
      siteStartShow: c.defaultSiteStartShow === "true",
      musicClick: c.defaultMusicClick === "true",
      musicIsOk: false,
      musicVolume: 0,
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
      playerLrcShow: c.defaultPlayerLrcShow !== "false",
      footerBlur: c.defaultFooterBlur !== "false",
      playerAutoplay: c.defaultPlayerAutoplay === "true",
      playerLoop: (c.defaultPlayerLoop as MainState["playerLoop"]) || "all",
      playerOrder: (c.defaultPlayerOrder as MainState["playerOrder"]) || "list",
    };
  },
  getters: {
    getPlayerData(state): { name: string | null; artist: string | null } {
      return {
        name: state.playerTitle,
        artist: state.playerArtist,
      };
    },
  },
  actions: {
    setInnerWidth(value: number) {
      this.innerWidth = value;
      if (value >= 720) {
        this.mobileOpenState = false;
        this.mobileFuncState = false;
      }
    },
    setPlayerState(value: boolean) {
      this.playerState = !value;
    },
    setPlayerLrc(value: string) {
      this.playerLrc = value;
    },
    setPlayerData(title: string, artist: string) {
      this.playerTitle = title;
      this.playerArtist = artist;
    },
    setImgLoadStatus(value: boolean) {
      this.imgLoadStatus = value;
    },
  },
  persist: {
    key: "data",
    storage: localStorage,
    pick: [
      "coverType",
      "musicVolume",
      "siteStartShow",
      "musicClick",
      "playerLrcShow",
      "footerBlur",
      "playerAutoplay",
      "playerLoop",
      "playerOrder",
    ],
  },
});
