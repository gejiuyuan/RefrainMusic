
import { defineComponent, ref, shallowReactive } from 'vue';
import ProgressBar, { ProgressBarComp, ProgressInfo } from '@widgets/progress-bar';
import './index.scss';
import { rmDemicalInPercent } from '@/utils';
import { onClickOutside } from '@vueuse/core';


export enum PlayingStatus {
    '暂停' = 0,
    '播放' = 1,
}

export const PlaySwitch = defineComponent({
    name: 'PlaySwitch',
    setup(props, { slots, emit }) {

        const playStatus = ref(1);
        const switchPlaying = () => playStatus.value = (playStatus.value + 1) % 2;

        return () => {
            const status = playStatus.value;
            return (
                <div className="play-switch" onClick={switchPlaying} title={PlayingStatus[status]}>
                    <i class="iconfont icon-bofan" hidden={!status}></i>
                    <i class="iconfont icon-pause" hidden={!!status}></i>
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
        const volumeRef = ref<HTMLDivElement>()
        const switchShow = () => isShow.value = !isShow.value;

        const isMuted = ref(false);

        const volumeData = shallowReactive<ProgressInfo>({
            ratio: '50%',
            decimal: 0.5,
        })

        const volumeChange = (data: ProgressInfo) => {
            const { decimal, ratio } = data;
            isMuted.value = !decimal;
            volumeData.decimal = decimal;
            volumeData.ratio = rmDemicalInPercent(ratio)
        }

        const switchMuted = () => {
            //如果已经是静音了，就return
            if (volumeData.decimal === 0) {
                return
            }
            isMuted.value = !isMuted.value
        }

        onClickOutside(volumeRef, () => isShow.value = false, { event: 'pointerup' });

        return () => {
            const muted = isMuted.value;
            return (
                <div class="volume" ref={volumeRef}>
                    <div className="volume-noumenon" onClick={switchShow}>
                        <i className="iconfont icon-yinliang" hidden={muted}></i>
                        <i className="iconfont icon-mute" hidden={!muted}></i>
                    </div>
                    <div className="volume-suspension" visibility={isShow.value}>
                        <div className="volume-progressbar">
                            <ProgressBar
                                dir="vertical"
                                dotFixed={true}
                                onChange={volumeChange}
                                currentRatio={volumeData.decimal * 100}
                            ></ProgressBar>
                        </div>
                        <div className="volume-ratio">
                            {volumeData.ratio}
                        </div>
                        <div class="volume-duplicate" onClick={switchMuted}>
                            <i className="iconfont icon-yinliang" hidden={muted}></i>
                            <i className="iconfont icon-mute" hidden={!muted}></i>
                        </div>
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