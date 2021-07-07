import { GetterTree } from "vuex";
import { PlayerState } from "./player";
import { SongInfo } from "./player";

const getters: GetterTree<PlayerState, any> = {
  currentSongInfo(state, getters, rootState) {
    const {
      playlist: { list },
      currentIndex,
    } = state;
    return list[currentIndex];
  },
};

export default getters;
