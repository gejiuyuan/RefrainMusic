//类型声明需安装: npm i @types/howler
import { Howl, Howler, HowlOptions } from 'howler';

//自动尝试在移动端和浏览器桌面端播放音频
Howler.autoUnlock = true;
//在30秒不活动后自动暂停Web Audio，以减少资源占用
Howler.autoSuspend = true;

export default class AudioMaster {

    protected howl: InstanceType<typeof Howl>;

    constructor(options: HowlOptions) {

        const howl = new Howl(options);

        //比如如果自动播放音频失败了，就再次手动触发
        howl.on('playerror', () => {
            howl.once('unlock', () => howl.play());
        });

        this.howl = howl;

    }

    get volume() {
        return this.howl.volume();
    }

    set volume(val: number) {
        this.howl.volume(val)
    }

    get rate() {
        return this.howl.rate()
    }

    set rate(val: number) {
        if (val < 0.5) {
            val = 0.5
        } else if (val > 4.0) {
            val = 4.0
        }
        this.howl.rate(val);
    }

    stop() {
        this.howl.stop();
    }

    pause() {
        this.howl.pause();
    }

    play() {
        this.howl.play();
    }

    get seek() {
        return this.howl.seek() as number;
    }

    set seek(ms: number) {
        const { duration } = this
        if (ms > duration || ms < 0) {
            console.error('the seek value is in invalid interval')
            return
        }
        this.howl.seek(ms)
    }

    get loop() {
        return this.howl.loop()
    }

    set loop(flag: boolean) {
        this.howl.loop(flag)
    }

    get state() {
        return this.howl.state();
    }

    get playing() {
        return this.howl.playing()
    }

    get duration() {
        return this.howl.duration()
    }

    load() {
        this.howl.load();
    }

}