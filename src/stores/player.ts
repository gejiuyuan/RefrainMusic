import { SongInfo } from "@/types/song";
import { LyricParser } from "@/utils";
import { realSongInfo } from "@/widgets/song-table";
import { defineStore } from "pinia";
import useAudioStore from "./audio";
import { getMusicDetail, getLyric } from "@api/music";
import { SongLyricItem } from "@/types/lyric";
import { getFullName, getFullNames } from "@/utils/apiSpecial";

export type PlayerStoreStateType = {
  currentSongInfo: Pick<realSongInfo, "name" | "alia" | "id" | "ar" | "al">;
  theme: string;
  playerQueueShow: boolean;
  lyric: {
    common: string;
    translation: string;
  };
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
      lyric: {
        common: "",
        translation: "",
      },
      theme: "#ff7875",
      playerQueueShow: false,
    };
    return playerState;
  },
  getters: {
    lyricParsed(state: PlayerStoreStateType) {
      const { common, translation } = state.lyric;
      return new LyricParser(common, translation);
    },
    currentSongModifiedInfo(state: PlayerStoreStateType) {
      const { id, ar, name, alia: alias, al } = state.currentSongInfo;
      return {
        id,
        musicName: getFullName({ name, alias }),
        singer: ar.map(({ id, name, alias }) => {
          return {
            id,
            name: getFullName({ name, alias }),
          };
        }),
        al,
      };
    },
  },
  actions: {
    //处理播放歌曲需要的数据
    handlePlaySoundNeededData(id: number) {
      //设置全局音频src，以便howler加载mp3的url
      useAudioStore().srcOrId = id;
      //获取音乐详细信息，因为存在偶现型songItem中picUrl不存在
      getMusicDetail({ ids: String(id) }).then(
        ({ songs: [songDetailData] }) => {
          this.currentSongInfo = songDetailData as realSongInfo;
        }
      );
      //获取歌词
      getLyric({ id }).then(({ lrc, tlyric, nolyric }: SongLyricItem) => {
        this.lyric.common = nolyric ? "" : lrc!.lyric;
        this.lyric.translation = nolyric ? "" : tlyric!.lyric;
      });
    },
  },
});

export default usePlayerStore;
