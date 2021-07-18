import { SongInfo } from "@/types/song";
import { realSongInfo } from "@/widgets/song-table";
import { defineStore } from "pinia";

export type PlayerStoreStateType = {
  currentSongInfo: Pick<realSongInfo, "name" | "alia" | "id" | "ar" | "al">;
  theme: string;
  playerQueueShow: boolean;
};

const usePlayerStore = defineStore({
  id: "playerStore",
  state() {
    const playerState: PlayerStoreStateType = {
      currentSongInfo: {
        name: "",
        alia: [],
        id: 0,
        ar: [{ name: "", alias: [], id: 0 }],
        al: {
          id: 0,
          name: "",
          picUrl: "",
        },
      },
      theme: "#ff7875",
      playerQueueShow: false,
    };
    return playerState;
  },
  getters: {},
  actions: {},
});

export default usePlayerStore;
