import { LyricParser } from "@/utils";
import { defineStore } from "pinia";
import useAudioStore from "./audio";
import { getMusicDetail, getLyric } from "@api/music";
import { SongLyricItem } from "@/types/lyric";
import { CurrentSongInfo, getModifiedSongInfo } from "@/utils/apiSpecial";

//实际使用的currentSongInfo的类型
export type PlayerStoreStateType = {
  currentSongInfo: CurrentSongInfo;
  theme: string;
  playerQueue: {
    songList: CurrentSongInfo[];
    show: boolean;
  };
  lyric: {
    common: string;
    translation: string;
  };
};

//初始的currentSongInfo
const initialCurrentSongInfo: CurrentSongInfo = {
  id: 0,
  duration: 0,
  artists: [],
  alias: [],
  name: "",
  albumName: '',
  musicName: "",
  publishTime: 0,
  mark: 0,
  album: { id: 0, name: "", picUrl: "" },
  singers: [{ id: 0, name: "" }],
  localedDuration: "",
  localedMark: "",
  localedPublishTime: "",
};

const usePlayerStore = defineStore({
  id: "playerStore",
  state() {
    const playerState: PlayerStoreStateType = {
      currentSongInfo: initialCurrentSongInfo,
      lyric: {
        common: "",
        translation: "",
      },
      theme: "#ff7875",
      playerQueue: {
        show: false,
        songList: [],
      },
    };
    return playerState;
  },
  getters: {
    lyricParsed(state: PlayerStoreStateType) {
      const { common, translation } = state.lyric;
      const lyricData = new LyricParser(common, translation);
      return lyricData;
    },
  },
  actions: {
    //处理播放歌曲需要的数据
    handlePlaySoundNeededData(id: number) {
      //如果已经是当前播放的歌曲了，就return
      if (this.currentSongInfo.id === id) return;
      //重置相关音频状态
      const audioStore = useAudioStore();
      audioStore.resetAudioStatus();
      //设置全局音频src，以便howler加载mp3的url
      audioStore.srcOrId = id;
      //获取音乐详细信息，因为存在偶现型songItem中picUrl不存在
      getMusicDetail({ ids: String(id) }).then(
        ({ songs: [songDetailData] }) => {
          //设置当前要播放歌曲的信息
          this.currentSongInfo = getModifiedSongInfo(songDetailData);
          //同时添加该歌曲到播放队列中
          const queueSongList = this.playerQueue.songList;
          if (
            !queueSongList.some(({ id: queueSongId }) => id === queueSongId)
          ) {
            queueSongList.push(this.currentSongInfo);
          }
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
