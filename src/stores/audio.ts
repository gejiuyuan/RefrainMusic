import { type } from "os";
import { defineStore } from "pinia";

const defaultAudioOptions = {
  volume: 0.5, //
  order: "order", // random、loop
  src: "",
  playbackRate: 1,
  playStatus: 0,
  start: 0,
  end: Infinity,
  currentTime: 0,
  duration: 0,
};

export type AudioStateType = {
  srcOrId: string | number;
} & typeof defaultAudioOptions;

const useAudioStore = defineStore({
  id: "audioStore",
  state() {
    const audioState: AudioStateType = {
      ...defaultAudioOptions,
      srcOrId: "",
    };
    return audioState;
  },
  getters: {},
  actions: {
    setCurrentTime(currentTime: number) {
      this.currentTime = currentTime;
    },
  },
});

export default useAudioStore;
