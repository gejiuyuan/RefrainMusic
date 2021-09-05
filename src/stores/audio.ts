import { is } from "@/utils";
import { PreferenceNames } from "@/utils/preference";
import { defineStore } from "pinia";
import { customRef } from "vue";

export const defaultAudioPreferences = {
  [PreferenceNames.playing]: false,
  [PreferenceNames.currentTime]: 0,
  [PreferenceNames.rate]: 1,
  [PreferenceNames.volume]: 0.5,
  [PreferenceNames.mute]: false,
}

export const playing = (() => {
  let playing = localStorage.getItem(PreferenceNames.playing) === 'true' || defaultAudioPreferences[PreferenceNames.playing];
  return customRef<boolean>((track, trigger) => {
    return {
      get() {
        track();
        return playing;
      },
      set(value) {
        if (!is.boolean(value)) {
          console.error(`The 'playing' must be a boolean!`);
          return;
        }
        playing = value;
        localStorage.setItem(PreferenceNames.playing, String(playing));
        trigger();
      }
    }
  })
})();

export const currentTime = (() => {
  let currentTime = Number(localStorage.getItem(PreferenceNames.currentTime)) || defaultAudioPreferences[PreferenceNames.currentTime];
  return customRef<number>((track, trigger) => {
    return {
      get() {
        track();
        return currentTime;
      },
      set(value) {
        if (!is.number(value)) {
          console.error(`The 'currentTime' must be a number!`);
          return;
        }
        currentTime = value;
        localStorage.setItem(PreferenceNames.currentTime, String(currentTime));
        trigger();
      }
    }
  })
})();

export const rate = (() => {
  let rate = Number(localStorage.getItem(PreferenceNames.rate)) || defaultAudioPreferences[PreferenceNames.rate];
  return customRef<number>((track, trigger) => {
    return {
      get() {
        track();
        return rate;
      },
      set(value) {
        if (!is.number(value)) {
          console.error(`The 'rate' must be a number!`);
          return;
        }
        rate = value;
        localStorage.setItem(PreferenceNames.rate, String(rate));
        trigger();
      }
    }
  })
})();

export const volume = (() => {
  let volume = Number(localStorage.getItem(PreferenceNames.volume)) || defaultAudioPreferences[PreferenceNames.volume];
  return customRef<number>((track, trigger) => {
    return {
      get() {
        track();
        return volume;
      },
      set(value) {
        if (!is.number(value)) {
          console.error(`The 'volume' must be a number!`);
          return;
        }
        volume = value;
        localStorage.setItem(PreferenceNames.volume, String(volume));
        trigger();
      }
    }
  })
})();

export const mute = (() => {
  let mute = localStorage.getItem(PreferenceNames.mute) === 'true' || defaultAudioPreferences[PreferenceNames.mute];
  return customRef<boolean>((track, trigger) => {
    return {
      get() {
        track();
        return mute;
      },
      set(value) {
        if (!is.boolean(value)) {
          console.error(`The 'mute' must be a boolean!`);
          return;
        }
        mute = value;
        localStorage.setItem(PreferenceNames.mute, String(mute));
        trigger();
      }
    }
  })
})();

const defaultAudioOptions = {
  src: "",
  start: 0,
  end: Infinity,
  nextSeekTime: currentTime.value,
  duration: 0,
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
      ...defaultAudioOptions,
      srcOrId: "",
      picUrl: "",
      musicName: "",
      singer: "",
    };
    return audioState;
  },
  getters: {},
  actions: {
    resetAudioStatus() {
      this.start = 0;
      this.end = Infinity;
      currentTime.value = this.nextSeekTime = 0;
      this.duration = 0;
    },
  },
});

export default useAudioStore;
