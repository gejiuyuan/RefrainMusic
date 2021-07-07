import { createStore } from "vuex";
import playerStore from "./modules/player";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  strict: debug,
});

store.registerModule("playerStore", playerStore);

export default store;
