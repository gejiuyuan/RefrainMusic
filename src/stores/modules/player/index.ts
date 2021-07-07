import { Module as StoreModule, Store } from "vuex";
import { PlayerState } from "./player";

import state from "./state";
import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

const playerStore: StoreModule<PlayerState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default playerStore;
