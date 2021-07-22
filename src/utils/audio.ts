//类型声明需安装: npm i @types/howler
import { Howl, Howler, HowlErrorCallback, HowlOptions } from "howler";

//自动尝试在移动端和浏览器桌面端播放音频
Howler.autoUnlock = true;
//在30秒不活动后自动暂停Web Audio，以减少资源占用
Howler.autoSuspend = true;

export type HowlerCommonOnEventsType =
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

export default class HowlerMaster {
  static howl: InstanceType<typeof Howl>;

  static init(options: HowlOptions) {
    const howl = new Howl(options);

    //比如如果自动播放音频失败了，就再次手动触发
    howl.on("playerror", () => {
      howl.once("unlock", () => howl.play());
    });

    this.howl = howl;
  }

  static get mute() {
    return this.howl.mute();
  }

  static set mute(val: boolean) {
    this.howl.mute(val);
  }

  static get volume() {
    return this.howl.volume();
  }

  static set volume(val: number) {
    this.howl.volume(val);
  }

  static get rate() {
    return this.howl.rate();
  }

  static set rate(val: number) {
    if (val < 0.5) {
      val = 0.5;
    } else if (val > 4.0) {
      val = 4.0;
    }
    this.howl.rate(val);
  }

  static stop() {
    this.howl.stop();
  }

  static pause() {
    this.howl.pause();
  }

  static play() {
    this.howl.play();
  }

  static get seek() {
    return this.howl.seek() as number;
  }

  static set seek(ms: number) {
    const { duration } = this;
    if (ms > duration || ms < 0) {
      console.error("the seek value is in invalid interval");
      return;
    }
    this.howl.seek(ms);
  }

  static get loop() {
    return this.howl.loop();
  }

  static set loop(flag: boolean) {
    this.howl.loop(flag);
  }

  /**
   * @return 'loaded' | 'unloaded' | 'loading'
   */
  static get state() {
    return this.howl.state();
  }

  static get playStatus() {
    return this.howl.playing() ? 1 : 0;
  }

  static get duration() {
    return this.howl.duration();
  }

  static load() {
    this.howl.load();
  }

  static destroy() {
    this.howl.unload();
  }

  static onError(
    callback: (
      type: "load" | "play",
      info: {
        soundId: FuncParamsType<HowlErrorCallback>[0];
        error: FuncParamsType<HowlErrorCallback>[1];
      }
    ) => void
  ) {
    this.howl.on("loaderror", (soundId, error) => {
      callback("load", { soundId, error });
    });
    this.howl.on("playerror", (soundId, error) => {
      callback("play", { soundId, error });
    });
  }

  static on(event: HowlerCommonOnEventsType, callback: () => void) {
    this.howl.on(event, callback);
  }

  static once(event: HowlerCommonOnEventsType, callback: () => void) {
    this.howl.once(event, callback);
  }

  static off(event: HowlerCommonOnEventsType, callback?: () => void) {
    this.howl.off(event, callback);
  }
}
