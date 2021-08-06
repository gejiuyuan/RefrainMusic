import { defineStore } from "pinia";

const defaultAudioOptions = {
  volume: 0.5, //
  order: "order", // random、loop
  src: "",
  rate: 1,
  playing: false,
  start: 0,
  end: Infinity,
  currentTime: 0,
  nextSeekTime: 0,
  duration: 0,
  loop: true,
  mute: false,
};

export type AudioStateType = {
  srcOrId: string | number;
  picUrl: string;
  musicName: string;
  singer: string;
} & typeof defaultAudioOptions;

const useAudioStore = defineStore({
  id: "audioStore",
  state() {
    const audioState: AudioStateType = {
      volume: 0.5, //
      order: "order", // random、loop
      src: "",
      rate: 1,
      playing: false,
      start: 0,
      end: Infinity,
      currentTime: 0,
      nextSeekTime: 0,
      duration: 0,
      loop: true,
      srcOrId: "",
      picUrl: "",
      musicName: "",
      singer: "",
      mute: false,
    };
    return audioState;
  },
  getters: {},
  actions: {
    setCurrentTime(currentTime: number) {
      this.currentTime = currentTime;
    },
    resetAudioStatus() {
      this.start = 0;
      this.end = Infinity;
      this.currentTime = this.nextSeekTime = 0;
      this.duration = 0;
    },
  },
});

export default useAudioStore;
