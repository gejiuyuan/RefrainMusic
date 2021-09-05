import { PreferenceNames } from "@/utils/preference";
import { defineStore } from "pinia";
import { customRef, ref } from "vue";
import { watch, toRefs, watchEffect, toRaw } from "vue";
import useHowler, { UseHowlerOptions } from "@/use/useHowler";
import usePlayerStore, { orderRefGlobal } from "@/stores/player";
import { UNICODE_CHAR, is } from "@utils/index";
import { isSingleLoopOrder } from "@/widgets/music-tiny-comp";
import { getOrPutCurrentSong } from "@/database";
import { messageBus } from "@utils/event/register";

export const {
  state: stateHowlerRef,
  playing: playingHowlerRef,
  volume: volumeHowlerRef,
  rate: rateHowlerRef,
  mute: muteHowlerRef,
  loop: loopHowlerRef,
  currentTime: currentTimeHowlerRef,
  duration: durationHowlerRef,
  playSound,
  load,
  play,
  stop,
  on,
  off,
  once,
} = useHowler();

export const defaultAudioPreferences = {
  [PreferenceNames.playing]: false,
  [PreferenceNames.currentTime]: 0,
  [PreferenceNames.rate]: 1,
  [PreferenceNames.volume]: 0.5,
  [PreferenceNames.mute]: false,
}

export const playingRefGlobal = (() => {
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
        playingHowlerRef.value = playing = value;
        localStorage.setItem(PreferenceNames.playing, String(playing));
        trigger();
      }
    }
  })
})();

export const currentTimeRefGlobal = (() => {
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

export const rateRefGlobal = (() => {
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

export const volumeRefGlobal = (() => {
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
        volumeHowlerRef.value = volume = value;
        muteHowlerRef.value = value === 0;
        localStorage.setItem(PreferenceNames.volume, String(volume));
        trigger();
      }
    }
  })
})();

export const muteRefGlobal = (() => {
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
        muteHowlerRef.value = mute = value;
        localStorage.setItem(PreferenceNames.mute, String(mute));
        trigger();
      }
    }
  })
})();

export const srcOrIdRefGlobal = (() => {
  let srcOrId: string | number = '';
  return customRef<string | number>((track, trigger) => {
    return {
      get() {
        track();
        return srcOrId;
      },
      set(value) {
        srcOrId = value;
        trigger();
        //清除播放失败后要播放下一首的的定时器
        clearTimeout(playToNextTimeoutInError);
        //同时清除播放失败消息提示
        messageBus.dispatch('destroyAllMessage');
        playSound(srcOrId, {
          volume: volumeRefGlobal.value,
          autoplay: playingRefGlobal.value,
          mute: muteRefGlobal.value,
          rate: rateRefGlobal.value,
        });
        //设置是否循环播放
        loopHowlerRef.value = isSingleLoopOrder(orderRefGlobal.value);
        messageBus.dispatch('startLoading');
      }
    }
  });
})();

export const nextSeekTimeRefGlobal = (() => {
  let nextSeekTime = currentTimeRefGlobal.value;
  return customRef<number>((track, trigger) => {
    return {
      get() {
        track();
        return nextSeekTime;
      },
      set(value) {
        currentTimeHowlerRef.value = nextSeekTime = value;
        trigger();
      }
    }
  });
})();

export const durationRefGlobal = ref(0);

let timeUpdateInterval: ReturnType<typeof setInterval>;
let playToNextTimeoutInError: ReturnType<typeof setTimeout>;

on('end', () => {
  if (isSingleLoopOrder(orderRefGlobal.value)) {
    return;
  }
  messageBus.dispatch('toNext');
});

on("load", () => {
  messageBus.dispatch('finishLoading');
  durationRefGlobal.value = durationHowlerRef.value;
  loopHowlerRef.value = isSingleLoopOrder(orderRefGlobal.value);

  clearInterval(timeUpdateInterval);
  timeUpdateInterval = setInterval(() => {
    if (!playingHowlerRef.value) return;
    currentTimeRefGlobal.value = currentTimeHowlerRef.value;
  }, 500);
});

on("loaderror", () => {
  messageBus.dispatch('errorLoading');
  messageBus.dispatch(
    'errorMessage',
    `歌曲加载失败啦~将在2秒后播放下一首喔~${UNICODE_CHAR.pensive}`,
    {
      duration: 4000,
    }
  );
  playToNextTimeoutInError = setTimeout(() => {
    messageBus.dispatch('toNext');
  }, 2000);
});

const defaultAudioOptions = {
  src: "",
  start: 0,
  end: Infinity,
  duration: 0,
};

export type AudioStateType = {
  picUrl: string;
  musicName: string;
  singer: string;
} & typeof defaultAudioOptions;

const useAudioStore = defineStore({
  id: "audioStore",
  state() {
    const audioState: AudioStateType = {
      ...defaultAudioOptions,
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
      currentTimeRefGlobal.value = nextSeekTimeRefGlobal.value = 0;
      durationRefGlobal.value = 0;
    },
  },
});

export default useAudioStore;
