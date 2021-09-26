import { EMPTY_OBJ, getRandomList, LyricParser } from "@/utils";
import { defineStore } from "pinia";
import { AudioMaster, playingRefGlobal, srcOrIdRefGlobal } from "./audio";
import { getMusicDetail, getLyric } from "@api/music";
import { SongLyricItem } from "@/types/lyric";
import { CurrentSongInfo, getModifiedSongInfo } from "@/utils/apiSpecial";
import { getOrPutCurrentSong, getOrPutPlayQueue, playerDB } from "@/database";
import { customRef, toRefs, ref, watchEffect } from "vue";
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

export const currentSongRefGlobal = (() => {
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
  let currentSong = getOrPutCurrentSong() || initialCurrentSongInfo;
  if (currentSong.id) {
    setTimeout(() => {
      //先初始化加载音乐播放相关资源或数据
      usePlayerStore().handlePlaySoundNeededData(currentSong.id, {
        force: true,
        needSave: false,
        immediate: false
      });
    });
  }
  return customRef<CurrentSongInfo>((track, trigger) => {
    return {
      get() {
        track();
        return currentSong;
      },
      set(value) {
        if (!value) return;
        currentSong = value;
        trigger();
      }
    }
  });
})();

//实际使用的currentSongInfo的类型
export type PlayerStoreStateType = {
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

export const playerQueue = ref<CurrentSongInfo[]>([]);
export const randomPlayerQueue = ref<CurrentSongInfo[]>([]);
watchEffect(() => {
  if (AudioMaster.isRandomOrder) {
    randomPlayerQueue.value = getRandomList(playerQueue.value);
  }
});
const realPlaylist = {
  get value() {
    return AudioMaster.isRandomOrder ? randomPlayerQueue.value : playerQueue.value;
  }
}
const currentPlayIndex = customRef<number>((track, trigger) => ({
  get() {
    track();
    const { id: currentSongId } = currentSongRefGlobal.value;
    return realPlaylist.value.findIndex(({ id }) => id == currentSongId) || 0
  },
  set(idx) {
    const targetId = realPlaylist.value[idx].id
    usePlayerStore().handlePlaySoundNeededData(targetId);
    trigger();
  }
}));

/**
 * 切换至下一首
 */
export function toNext() {
  let value = currentPlayIndex.value;
  if (++value >= realPlaylist.value.length) {
    value = 0;
  }
  currentPlayIndex.value = value;
}

/**
 * 切换至上一首
 */
export function toPrevious() {
  let value = currentPlayIndex.value;
  if (--value < 0) {
    value = realPlaylist.value.length - 1;
  }
  currentPlayIndex.value = value;
}


const usePlayerStore = defineStore({
  id: "playerStore",
  state() {
    const playerState: PlayerStoreStateType = {
      lyric: {
        common: "",
        translation: "",
      },
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
      const currengSongId = currentSongRefGlobal.value.id;
      if (!force && currengSongId === id) return;
      immediate && (playingRefGlobal.value = true);
      //设置全局音频src，以便howler加载mp3的url
      srcOrIdRefGlobal.value = id;
      //获取音乐详细信息，因为存在偶现型songItem中picUrl不存在
      getMusicDetail({ ids: String(id) }).then(
        ({ songs: [songDetailData] }) => {
          const willSetCurrentSongInfo = getModifiedSongInfo(songDetailData);
          //如果没有在播放队列中, 就添加该歌曲到播放队列中
          const queueSongList = playerQueue.value;
          if (!queueSongList.some(({ id: queueSongId }) => id === queueSongId)) {
            const currentSongIndex = queueSongList.findIndex(({ id: queueSongId }) => currengSongId === queueSongId);
            queueSongList.splice(currentSongIndex + 1, 0, willSetCurrentSongInfo);
          }
          //设置当前要播放歌曲的信息
          currentSongRefGlobal.value = willSetCurrentSongInfo;
          //保存当前播放的歌曲到IndexedDB
          if (needSave) {
            getOrPutCurrentSong(willSetCurrentSongInfo);
            getOrPutPlayQueue(willSetCurrentSongInfo);
          }
        }
      );
      //获取歌词
      getLyric({ id }).then(({ lrc, tlyric, nolyric }: SongLyricItem) => {
        this.lyric.common = lrc?.lyric || '';
        this.lyric.translation = tlyric?.lyric || '';
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