import { EMPTY_OBJ, LyricParser } from "@/utils";
import { defineStore } from "pinia";
import { AudioMaster, playingRefGlobal, srcOrIdRefGlobal } from "./audio";
import { getMusicDetail, getLyric } from "@api/music";
import { SongLyricItem } from "@/types/lyric";
import { CurrentSongInfo, getModifiedSongInfo } from "@/utils/apiSpecial";
import { getOrPutCurrentSong, getOrPutPlayQueue, playerDB } from "@/database";
import { customRef, toRefs } from "vue";
import { PreferenceNames } from "@/utils/preference";
import { VideoBeLiked } from "@/types/video";
import { Mv } from "@/types/mv";

export const defaultPlayerPreferences = {
  //主题色
  [PreferenceNames.theme]: "#ff7875",
  //播放队列是否显示
  [PreferenceNames.playerQueueShow]: false,
}

export const theme = (() => {
  let theme = localStorage.getItem(PreferenceNames.theme) || defaultPlayerPreferences[PreferenceNames.theme];
  return customRef<string>((track, trigger) => {
    return {
      get() {
        track();
        return theme;
      },
      set(value) {
        theme = value;
        localStorage.setItem(PreferenceNames.theme, value);
        trigger();
      }
    }
  })
})();

export const playerQueueShow = (() => {
  let playerQueueShow = localStorage.getItem(PreferenceNames.playerQueueShow) === 'true' || defaultPlayerPreferences[PreferenceNames.playerQueueShow];
  return customRef<boolean>((track, trigger) => {
    return {
      get() {
        track();
        return playerQueueShow;
      },
      set(value) {
        playerQueueShow = !!value;
        localStorage.setItem(PreferenceNames.playerQueueShow, String(playerQueueShow));
        trigger();
      }
    }
  })
})();

//实际使用的currentSongInfo的类型
export type PlayerStoreStateType = {
  currentSongInfo: CurrentSongInfo;
  playerQueue: CurrentSongInfo[];
  personalFM: {
    songList: any[];
    isFM: boolean;
  };
  lyric: {
    common: string;
    translation: string;
  };
  video: {
    isPlay: boolean;
    beLiked: VideoBeLiked[];
  },
  mv: {
    beCollected: Mv[];
  }
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
  starred: false,
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
      playerQueue: [],
      personalFM: {
        isFM: false,
        songList: [],
      },
      video: {
        isPlay: !playingRefGlobal.value,
        beLiked: [],
      },
      mv: {
        beCollected: [],
      }
    };
    return playerState;
  },
  getters: {
    lyricParsed(state: PlayerStoreStateType) {
      const { common, translation } = toRefs(state.lyric);
      const lyricData = new LyricParser(common.value, translation.value);
      return lyricData;
    },
  },
  actions: {

    //发布后置执行的标识
    publishAfterMark(mark: any) {
      return mark;
    },

    setVideoIsPlay(value: boolean) {
      this.video.isPlay = value;
      if (value === true) {
        playingRefGlobal.value = false;
      }
    },

    //处理播放歌曲需要的数据
    handlePlaySoundNeededData(
      id: number,
      options?: {
        force?: boolean;
        needSave?: boolean;
        immediate?: boolean;
      }
    ) {
      const { force = false, needSave = true, immediate = true } = options || EMPTY_OBJ;
      //如果已经是当前播放的歌曲了，就return
      if (!force && this.currentSongInfo.id === id) return;
      immediate && (playingRefGlobal.value = true);
      //设置全局音频src，以便howler加载mp3的url
      srcOrIdRefGlobal.value = id;
      //获取音乐详细信息，因为存在偶现型songItem中picUrl不存在
      getMusicDetail({ ids: String(id) }).then(
        ({ songs: [songDetailData] }) => {
          const currentSongInfo = this.currentSongInfo;
          const willSetCurrentSongInfo = getModifiedSongInfo(songDetailData);
          //设置当前要播放歌曲的信息
          this.currentSongInfo = willSetCurrentSongInfo;
          //同时添加该歌曲到播放队列中
          const queueSongList = this.playerQueue;
          //如果没有在播放队列中
          if (!queueSongList.some(({ id: queueSongId }) => id === queueSongId)) {
            const currentSongId = currentSongInfo.id;
            const currentSongIndex = queueSongList.findIndex(({ id: queueSongId }) => currentSongId === queueSongId);
            queueSongList.splice(currentSongIndex + 1, 0, willSetCurrentSongInfo);
          }
          //保存当前播放的歌曲到IndexedDB
          if (needSave) {
            getOrPutCurrentSong(willSetCurrentSongInfo);
            getOrPutPlayQueue(willSetCurrentSongInfo);
          }
        }
      );
      //获取歌词
      getLyric({ id }).then(({ lrc, tlyric, nolyric }: SongLyricItem) => {
        this.lyric.common = nolyric ? "" : lrc!.lyric;
        this.lyric.translation = nolyric ? "" : tlyric!.lyric;
      });
    },

    //视频是否已被收藏过
    isVideoBeLiked(videoId: string | number, description?: string) {
      return this.video.beLiked.some(({ mlogBaseData: { id, text, desc } }) => id == videoId || description?.includes(desc));
    },

    //视频（mv）是否已被收藏
    isMvBeCollected(mvId: string | number) {
      return this.mv.beCollected.some(({ id }) => id == mvId);
    }
  },
});

export default usePlayerStore;