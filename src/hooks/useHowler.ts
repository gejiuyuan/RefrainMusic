import {
  customRef,
} from "vue";

//类型声明需安装: npm i @types/howler
import { Howl, Howler, HowlErrorCallback, HowlOptions } from "howler";
import { MaybeRef } from "@vueuse/core";
import { is } from "@/utils";

export type HowlerStateType = "loaded" | "unloaded" | "loading";

//自动尝试在移动端和浏览器桌面端播放音频
Howler.autoUnlock = false;
//在30秒不活动后自动暂停Web Audio，以减少资源占用
Howler.autoSuspend = true;

/**
 * 使用音频方法
 * @param options HowlOptions
 * @returns
 */

export const defaultHowlOptions: HowlOptions = {
  autoplay: false,
  html5: true,
  format: ["mp3", "mpeg", "flac", "wav", "webm", "m4a", "ogg", "opus", "aac"],
  xhr: {
    withCredentials: true,
  },
};


const useHowler = (() => {
  let howl: Howl;
  const eventFuncQueue: CommonFunction[] = [];
  const eventFuncOnceQueue: CommonFunction[] = [];
  return (baseOptions: HowlOptions = defaultHowlOptions) => {
    const playSound = (
      options: HowlOptions = defaultHowlOptions
    ) => {
      //先销毁前面的实例
      Howler.unload();
      const realHowlOptions = {
        ...baseOptions,
        ...options,
      }
      howl = new Howl(realHowlOptions);
      if (!is.emptyArray(eventFuncOnceQueue)) {
        eventFuncOnceQueue.forEach(func => func());
        eventFuncOnceQueue.length = 0;
      }
      eventFuncQueue.forEach((func) => func());

      //解决某些浏览器自动播放失效问题
      if (realHowlOptions.autoplay) {
        howl.on("playerror", () => {
          howl.once("unlock", () => howl.play());
        });
      }
    };

    const muteRef = customRef<boolean>((track, trigger) => ({
      get() {
        track();
        return howl?.volume() === 0;
      },
      set(value) {
        howl?.mute(value);
        trigger();
      },
    }));

    const loopRef = customRef<boolean>((track, trigger) => ({
      get() {
        track();
        return howl?.loop();
      },
      set(value) {
        howl?.loop(value);
        trigger();
      },
    }));

    const currentTimeRef = customRef<number>((track, trigger) => ({
      get() {
        track();
        return howl?.seek() as number;
      },
      set(value) {
        const fn = () => howl.seek(value);
        !howl ? eventFuncOnceQueue.push(fn) : fn();
        trigger();
      },
    }));

    const volumeRef = customRef<number>((track, trigger) => ({
      get() {
        track();
        return howl?.volume();
      },
      set(value) {
        if (value < 0) value = 0;
        else if (value > 1) value = 1;
        howl?.volume(value);
        trigger();
      },
    }));

    const rateRef = customRef<number>((track, trigger) => ({
      get() {
        track();
        return howl.rate();
      },
      set(value) {
        if (value < 0.5) value = 0.5;
        else if (value > 4) value = 4;
        howl?.rate(value);
        trigger();
      },
    }));

    const durationRef = customRef<number>((track, trigger) => ({
      get() {
        track();
        return howl?.duration();
      },
      set(value) {
        // trigger();
      },
    }));

    const stateRef = customRef<HowlerStateType>((track, trigger) => ({
      get() {
        track();
        return howl?.state();
      },
      set(value) {
        // trigger();
      },
    }));

    const playingRef = customRef<boolean>((track, trigger) => ({
      get() {
        track();
        return howl?.playing();
      },
      set(value) {
        howl?.[value ? 'play' : 'pause']();
        trigger();
      },
    }));

    return {
      volume: volumeRef,
      rate: rateRef,
      currentTime: currentTimeRef,
      loop: loopRef,
      mute: muteRef,
      duration: durationRef,
      playing: playingRef,
      state: stateRef,

      playSound,
      load: () => howl?.load(),
      unload: () => howl?.unload(),
      on: (...args: FuncParamsType<Howl["on"]>) => {
        eventFuncQueue.push(() => {
          howl.on(...args);
        });
      },
      once: (...args: FuncParamsType<Howl["once"]>) => {
        eventFuncQueue.push(() => {
          howl.once(...args);
        });
      },
      off: (...args: FuncParamsType<Howl["off"]>) => howl?.off(...args),
      fade: (...args: FuncParamsType<Howl["fade"]>) => howl?.fade(...args),
      stop: (...args: FuncParamsType<Howl["stop"]>) => howl?.stop(...args),
      play: (...args: FuncParamsType<Howl["play"]>) => howl?.play(...args),
      pause: (...args: FuncParamsType<Howl["pause"]>) => howl?.pause(...args),
    };
  };
})();

export default useHowler;
