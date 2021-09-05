import {
  customRef,
  onBeforeMount,
  ref,
  watchEffect,
  Ref,
  watch,
  nextTick,
} from "vue";

//类型声明需安装: npm i @types/howler
import { Howl, Howler, HowlErrorCallback, HowlOptions } from "howler";
import { MaybeRef } from "@vueuse/core";
import { EMPTY_OBJ, isURL } from "@/utils";

export type HowlerStateType = "loaded" | "unloaded" | "loading";

export type UseHowlerOptions = Partial<Pick<HowlOptions, "src">> &
  Omit<HowlOptions, "src">;

//自动尝试在移动端和浏览器桌面端播放音频
Howler.autoUnlock = true;
//在30秒不活动后自动暂停Web Audio，以减少资源占用
Howler.autoSuspend = true;

/**
 * 使用音频方法
 * @param options HowlOptions
 * @returns
 */

export const defaultHowlOptions: UseHowlerOptions = {
  autoplay: false,
  html5: true,
  format: ["mp3", "mpeg", "flac", "wav", "webm", "m4a", "ogg", "opus", "aac"],
  xhr: {
    withCredentials: true,
  },
};

/**
 * 获取音乐的url地址
 * @param srcOrId
 * @returns
 */
export const getSoundUrl = (srcOrId: number | string) => {
  srcOrId = String(srcOrId);
  return !isURL(String(srcOrId))
    ? `${location.protocol}//music.163.com/song/media/outer/url?id=${srcOrId}.mp3`
    : srcOrId;
};

const useHowler = (() => {
  let howl: Howl;
  const eventFuncQueue: CommonFunction[] = [];
  return (baseOptions: UseHowlerOptions = defaultHowlOptions) => {
    const playSound = (
      srcOrId: FuncParamsType<typeof getSoundUrl>[0],
      options: UseHowlerOptions = defaultHowlOptions
    ) => {
      //先销毁前面的实例
      Howler.unload();
      const realHowlOptions = {
        ...baseOptions,
        ...options,
        src: getSoundUrl(srcOrId),
      }
      howl = new Howl(realHowlOptions);
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
      set(val) {
        howl?.mute(val);
        trigger();
      },
    }));

    const loopRef = customRef<boolean>((track, trigger) => ({
      get() {
        track();
        return howl?.loop();
      },
      set(val) {
        howl?.loop(val);
        trigger();
      },
    }));

    const currentTimeRef = customRef<number>((track, trigger) => ({
      get() {
        track();
        return howl?.seek() as number;
      },
      set(val) {
        howl?.seek(val);
        trigger();
      },
    }));

    const volumeRef = customRef<number>((track, trigger) => ({
      get() {
        track();
        return howl?.volume();
      },
      set(val) {
        if (val < 0) val = 0;
        else if (val > 1) val = 1;
        howl?.volume(val);
        trigger();
      },
    }));

    const rateRef = customRef<number>((track, trigger) => ({
      get() {
        track();
        return howl.rate();
      },
      set(val) {
        if (val < 0.5) val = 0.5;
        else if (val > 4) val = 4;
        howl?.rate(val);
        trigger();
      },
    }));

    const durationRef = customRef<number>((track, trigger) => ({
      get() {
        track();
        return howl?.duration();
      },
      set(value) {
        trigger();
      },
    }));

    const stateRef = customRef<HowlerStateType>((track, trigger) => ({
      get() {
        track();
        return howl?.state();
      },
      set(value) {
        trigger();
      },
    }));

    const playingRef = customRef<boolean>((track, trigger) => ({
      get() {
        track();
        return howl?.playing();
      },
      set(val) {
        trigger();
        howl?.[val ? "play" : "pause"]();
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
