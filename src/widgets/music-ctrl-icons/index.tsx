
import { defineComponent, ref } from 'vue';
import ProgressBar, { ProgressBarComp } from '@widgets/progress-bar';
import './index.scss';


export enum PlayingStatus {
    '暂停' = 0,
    '播放' = 1,
}

export const PlaySwitch = defineComponent({
    name: 'PlaySwitch',
    setup(props, { slots, emit }) {

        const isPlaying = ref(0);
        const switchPlaying = () => isPlaying.value = (isPlaying.value + 1) % 2;

        return () => {
            const isPlayling = !!isPlaying.value;
            return (
                <div className="play-switch" onClick={switchPlaying}>
                    <i class="iconfont icon-bofan" hidden={isPlayling} title={PlayingStatus[1]}></i>
                    <i class="iconfont icon-pause" hidden={!isPlayling} title={PlayingStatus[0]}></i>
                </div>
            )

        }

    }
})

export const PrevMusic = defineComponent({
    name: 'PrevMusic',
    setup(props, { slots, emit }) {

        return () => {

            return (
                <div className="prev-music" title="上一首">
                    <i class="iconfont icon-prevmusic"></i>
                </div>
            )

        }

    }
})

export const NextMusic = defineComponent({
    name: 'NextMusic',
    setup(props, { slots, emit }) {

        return () => {

            return (
                <div className="next-music">
                    <i class="iconfont icon-nextmusic" title="上一首"></i>
                </div>
            )

        }

    }
})

export const Volume = defineComponent({
    name: 'Volume',
    setup(props, { slots, emit }) {

        const isShow = ref(false)

        const switchShow = () => isShow.value = !isShow.value;

        return () => {

            return (
                <div class="volume">
                    <div className="volume-noumenon" onClick={switchShow}>
                        <i className="iconfont icon-yinliang"></i>
                    </div>
                    <div className="volume-suspension" visibility={isShow.value}>
                        <ProgressBar
                            dir="vertical"
                            dotFixed={true}
                            down={() => {

                            }}
                            move={() => {

                            }}
                            up={() => {

                            }}
                            change={() => {

                            }}
                        ></ProgressBar>
                    </div>
                </div>
            )

        }

    }
})

export enum MusicLoveTitle {
    '本宝宝喜欢你~~' = 1,
    '本宝宝讨厌你~~' = 0
}

export const MusicLoveIcon = defineComponent({
    name: 'MusicLoveIcon',
    setup(props, { slots, emit }) {

        const loveStatus = ref(1)

        return () => {
            return (
                <div className="music-love-icon" title={MusicLoveTitle[1]}>
                    <i className="iconfont icon-xihuan"></i>
                </div>
            )
        }

    }
})

export const CurrentPlayTime = defineComponent({
    name: 'CurrentPlayTime',
    setup(props, { slots, emit }) {

        return () => {

            return (
                <div className="current-playtime">
                    <span class="current">
                        00:40
                    </span>
                    <span> / </span>
                    <span class="total">
                        03:39
                    </span>
                </div>
            )

        }

    }
})