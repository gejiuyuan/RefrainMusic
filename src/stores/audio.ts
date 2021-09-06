import { PreferenceNames } from "@/utils/preference";
import { customRef, ref, watchEffect } from "vue";
import useHowler from "@/use/useHowler";
import { UNICODE_CHAR, is, extend, isURL } from "@utils/index";
import { messageBus } from "@utils/event/register";
import EventDispatcher from "@/utils/event/event";

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
  //播放顺序，options：random、singleLoop
  [PreferenceNames.order]: "order",
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
        rateHowlerRef.value = rate = value;
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

export type Order = 'order' | 'singleLoop' | 'random';
const orderOptions: Order[] = ['order', 'singleLoop', 'random'];
export const orderRefGlobal = (() => {
  let order = (localStorage.getItem(PreferenceNames.order) || defaultAudioPreferences[PreferenceNames.order]) as Order;
  return customRef<Order>((track, trigger) => {
    return {
      get() {
        track();
        return order;
      },
      set(value) {
        if (!orderOptions.includes(value)) {
          console.error(`The 'order' must be one of the three options:${orderOptions.join('、')}`);
          return;
        }
        order = value;
        loopHowlerRef.value = AudioMaster.isSingleLoopOrder;
        localStorage.setItem(PreferenceNames.order, order);
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
        AudioMaster.clearPlayToNextTimeoutWhenError();
        //同时清除播放失败消息提示
        messageBus.dispatch('destroyAllMessage');
        playSound({
          src: AudioMaster.getSoundUrl(srcOrId),
          autoplay: playingRefGlobal.value,
          rate: rateRefGlobal.value,
          loop: AudioMaster.isSingleLoopOrder,
          volume: volumeHowlerRef.value,
          mute: muteRefGlobal.value,
        });
        messageBus.dispatch('startLoading');
      }
    }
  });
})();

export const nextSeekTimeRefGlobal = (() => {
  let nextSeekTime = currentTimeRefGlobal.value;
  currentTimeHowlerRef.value = nextSeekTime;
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

on('end', () => {
  if (AudioMaster.isSingleLoopOrder) {
    return;
  }
  messageBus.dispatch('toNext');
});

on("load", () => {
  messageBus.dispatch('finishLoading');
  durationRefGlobal.value = durationHowlerRef.value;
  AudioMaster.clearTimeUpdateInterval();
  AudioMaster.setTimeUpdateInterval(() => {
    if (!playingHowlerRef.value) return;
    currentTimeRefGlobal.value = currentTimeHowlerRef.value;
  }, 500);
});

on("loaderror", () => {
  messageBus.dispatch('errorLoading');
  messageBus.dispatch(
    'errorMessage',
    `歌曲加载失败啦~将在4秒后播放下一首喔~${UNICODE_CHAR.pensive}`,
    {
      duration: 4000,
    }
  );
  AudioMaster.setPlayToNextTimeoutWhenError(() => {
    messageBus.dispatch('toNext');
  }, 2000);
});

export class AudioMaster extends EventDispatcher {

  static playToNextTimeoutWhenError: ReturnType<typeof setTimeout>;
  static timeUpdateInterval: ReturnType<typeof setInterval>;

  static clearPlayToNextTimeoutWhenError() {
    clearTimeout(this.playToNextTimeoutWhenError);
    this.playToNextTimeoutWhenError = null!;
  }

  static setPlayToNextTimeoutWhenError(...args: FuncParamsType<typeof setTimeout>) {
    this.playToNextTimeoutWhenError = setTimeout(...args);
  }

  static clearTimeUpdateInterval() {
    clearInterval(this.timeUpdateInterval);
    this.timeUpdateInterval = null!;
  }

  static setTimeUpdateInterval(...args: FuncParamsType<typeof setInterval>) {
    this.timeUpdateInterval = setInterval(...args);
  }

  static resetAudioStatus() {
    durationRefGlobal.value = currentTimeRefGlobal.value = nextSeekTimeRefGlobal.value = 0;
  }

  static get isByOrder() {
    return orderRefGlobal.value === 'order';
  }

  static get isSingleLoopOrder() {
    return orderRefGlobal.value === 'singleLoop';
  }

  static get isRandomOrder() {
    return orderRefGlobal.value === 'random';
  }

  /**
   * 获取音乐的url地址 
   */
  static getSoundUrl = (srcOrId: number | string) => {
    srcOrId = String(srcOrId);
    return !isURL(srcOrId)
      ? `${location.protocol}//music.163.com/song/media/outer/url?id=${srcOrId}.mp3`
      : srcOrId;
  };

}
