import { customRef, onBeforeMount, ref, watchEffect, Ref, watch } from "vue";

//类型声明需安装: npm i @types/howler
import { Howl, Howler, HowlErrorCallback, HowlOptions } from "howler";

//自动尝试在移动端和浏览器桌面端播放音频
Howler.autoUnlock = true;

//在30秒不活动后自动暂停Web Audio，以减少资源占用
Howler.autoSuspend = true;

export type HowlerCommonOnEventsType =
  | "playerror"
  | "loaderror"
  | "load"
  | "play"
  | "end"
  | "pause"
  | "stop"
  | "mute"
  | "volume"
  | "rate"
  | "seek"
  | "fade"
  | "unlock";

export type HowlerStateType = "loaded" | "unloaded" | "loading";

/**
 * 使用音频方法
 * @param options HowlOptions
 * @returns
 */
export default function useHowler(options: HowlOptions) {
  const howl = new Howl(options);

  const src = ref<string | string[]>(options.src ?? "");

  //比如如果自动播放音频失败了，就再次手动触发
  howl.on("playerror", () => {
    howl.once("unlock", () => howl.play());
  });

  const { stop, pause, play, load, on, once, off, fade } = howl;

  const muteRef = customRef<boolean>((track, trigger) => ({
    get() {
      track();
      return howl.mute();
    },
    set(val) {
      howl.mute(val);
      trigger();
    },
  }));

  const loopRef = customRef<boolean>((track, trigger) => ({
    get() {
      track();
      return howl.loop();
    },
    set(val) {
      howl.loop(val);
      trigger();
    },
  }));

  const seekRef = customRef<number>((track, trigger) => ({
    get() {
      track();
      return howl.seek() as number;
    },
    set(val) {
      howl.seek(val);
      trigger();
    },
  }));

  const volumeRef = customRef<number>((track, trigger) => ({
    get() {
      track();
      return howl.volume();
    },
    set(val) {
      if (val < 0) val = 0;
      else if (val > 1) val = 1;
      howl.volume(val);
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
      howl.rate(val);
      trigger();
    },
  }));

  const durationRef = customRef<number>((track, trigger) => ({
    get() {
      track();
      return howl.duration();
    },
    set(value) {},
  }));

  const stateRef = customRef<HowlerStateType>((track, trigger) => ({
    get() {
      track();
      return howl.state();
    },
    set(value) {},
  }));

  onBeforeMount(() => {
    howl.unload();
  });

  const offHowlListener = function (
    event: HowlerCommonOnEventsType,
    callback?: () => void
  ) {
    off.call(howl, event, callback);
  };

  const onHowlListener = function (
    event: HowlerCommonOnEventsType,
    callback: () => void,
    options: {
      once?: boolean;
    } = {}
  ) {
    (options.once ? once : on).call(howl, event, callback);
  };

  return {
    volume: volumeRef,
    rate: rateRef,
    seek: seekRef,
    loop: loopRef,
    mute: muteRef,
    duration: durationRef,
    state: stateRef,

    fade: fade.bind(howl),
    stop: stop.bind(howl),
    pause: pause.bind(howl),
    play: play.bind(howl),
    load: load.bind(howl),
    onHowlListener,
    offHowlListener,
  };
}
