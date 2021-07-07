import { ActionTree } from "vuex";
import { PlayerState, SongInfo } from "./player";

import ApiParser from "@/special/apiParser";
import { getPlaylist, getLyric, getPlaybill } from "@/request";

const actions: ActionTree<PlayerState, any> = {
  //获取播放列表
  getPlaylist: {
    //设置为全局方法
    root: true,
    async handler({ dispatch, commit }, { musicUrl }) {
      const { realApi: musicApi } = new ApiParser({ url: musicUrl });
      const list = await getPlaylist(musicApi);
      commit("setPlaylist", list);
      return Promise.resolve();
    },
  },

  //获取当前歌词的海报
  getCurPlaybill: {
    root: true,
    async handler({ state, getters, dispatch, commit, rootState }) {
      const {
        playbill: { size },
      } = state;
      const {
        currentSongInfo: { pic },
      } = getters;
      const playbillSrc = await getPlaybill(pic);
      commit("setPlaybill", { playbillSrc, size });
    },
  },

  //获取当前歌曲的歌词
  getCurLyric: {
    root: true,
    async handler({ state, getters, dispatch, commit, rootState }) {
      const {
        currentSongInfo: { lrc },
      } = getters;
      const lrcContent = await getLyric(lrc);
      commit("setLrcContent", lrcContent);
    },
  },

  //切换播放的歌曲
  switchCurrentSong(
    { commit, state },
    {
      endAuto = false, //是否是自动播放完了（如ended事件触发）
      type = "next", // 'prev',
      targetIndex,
    }
  ) {
    //如果是自动播放到下一首（如audio的ended事件触发）并且播放顺序是单曲循环
    if (endAuto && state.playOrder === "singalLoop") {
      commit("setLoop", true);
      return;
    }
    commit("setLoop", false);
    if (targetIndex >= 0) {
      commit("setCurrentIndex", { targetIndex });
    } else if (state.playOrder === "random") {
      commit("setCurrentIndex", { type: "random" });
    } else {
      commit("setCurrentIndex", { type });
    }
  },

  //切换播放顺序
  switchPlayOrder({ commit, state }, type) {
    commit("setPlayOrder", type);
  },
};

export default actions;
