import { MutationTree } from "vuex";
import { PlayerState, OrderKeys, SongInfo } from "./player";
import { shallowReactive } from "vue"; 
import { getRanInteger , LyricParser, LyricType } from "@utils/index";

const mutations: MutationTree<PlayerState> = {
  //切换歌曲暂停与播放状态
  togglePaused(state, paused?: boolean) {
    state.paused = paused === void 0 ? !state.paused : paused;
  },

  //设置是否能够更新播放显示的时间
  setCanUpdateTime(state, able: boolean) {
    state.canUpdateTime = able;
  },

  //设置将要播放到的时间
  setWillPlayTime(state, playtime: number) {
    state.willPlayTime = playtime;
  },

  //设置将要播放到的时间（通过百分比），场景：拖动进度条、歌词区时会用到
  setWillPlayTimeByRatio(state, ratio: number | string) {
    state.willPlayTime = state.currentDuration * +ratio;
  },

  //设置实时播放时间
  setCurrentTime(state, currentTime: number) {
    state.currentTime = currentTime;
  },

  //设置实时播放时间（通过百分比）
  setCurrentTimeByRatio(state, ratio: number | string) {
    state.currentTime = state.currentDuration * +ratio;
  },

  //设置当前歌曲的duration。场景：通过durationchange事件触发
  setCurrentDuration(state, duration: number) {
    state.currentDuration = duration;
  },

  //设置是否循环播放
  setLoop(state, loop) {
    state.loop = loop;
  },

  //切换歌曲
  setCurrentIndex(
    state,
    {
      type = "next", //or 'prev' or 'random,
      targetIndex, //目标索引
    }
  ) {
    let {
      playlist: { length, history: historyList },
      currentIndex: curIdx,
      playOrder,
    } = state;
    if (targetIndex) {
      curIdx = +targetIndex;
    } else if (type === "prev") {
      !~--curIdx && (curIdx = length - 1);
    } else if (type === "next") {
      ++curIdx > length - 1 && (curIdx = 0);
    } else if (type === "random") {
      curIdx = getRanInteger(0, length - 1);
    }

    state.currentIndex = curIdx;
  },

  //设置播放列表显示隐藏
  setPlaylistVisible(state, isShow: boolean) {
    state.playlist.isShow = isShow;
  },

  //设置播放列表（固定的）
  setPlaylist(state, list) {
    state.playlist.length = list.length;
    state.playlist.list = list;
  },

  //设置海报
  setPlaybill(state, { playbillSrc: src, size }) {
    state.playbill.size = size;
    state.playbill.src = src.replace(/(\d+)y(\d+)/, `${size[0]}y${size[1]}`);
  },

  //设置歌词内容
  setLrcContent(state, lrcContent) {
    const { data, canTranslate, exsit } = new LyricParser(lrcContent);
    state.lyric = { data, canTranslate, exsit };
  },

  //设置音量
  setVolume(state, volume) {
    state.volume = volume;
  },

  //设置播放顺序
  setPlayOrder(state, playOrder) {
    if (["order", "random", "singalLoop", "loop"].includes(playOrder)) {
      state.playOrder = playOrder;
      return;
    }
    throw new TypeError(
      `the parameter 'order' is invalid, it must 
            be one of the four options: 'order'、'random'、'loop'、'singalLoop'`
    );
  },
};

export default mutations;
