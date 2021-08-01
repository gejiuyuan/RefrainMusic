import {
  computed,
  customRef,
  defineAsyncComponent,
  defineComponent,
  PropType,
  ref,
  shallowReactive,
  watch,
} from "vue";
import ProgressBar, {
  ProgressBarComp,
  ProgressInfo,
} from "@widgets/progress-bar";
import "./index.scss";
import { decimalToPercent, rmDemicalInPercent, second2TimeStr } from "@/utils";
import { onClickOutside } from "@vueuse/core";
import useAudioStore from "@/stores/audio";
import { useRouter } from "vue-router";
import { CurrentSongInfo } from "@/utils/apiSpecial";

export const PlaySwitch = defineComponent({
  name: "PlaySwitch",
  setup(props, { slots, emit }) {
    const audioStore = useAudioStore();
    const switchPlaying = () => (audioStore.playing = !audioStore.playing);
    return () => {
      const { playing } = audioStore;
      return (
        <div
          className="play-switch"
          onClick={switchPlaying}
          title={playing ? "暂停" : "播放"}
        >
          <i class="iconfont icon-bofan" hidden={playing}></i>
          <i class="iconfont icon-pause" hidden={!playing}></i>
        </div>
      );
    };
  },
});

export const PrevMusic = defineComponent({
  name: "PrevMusic",
  setup(props, { slots, emit }) {
    return () => {
      return (
        <div className="prev-music" title="上一首">
          <i class="iconfont icon-prevmusic"></i>
        </div>
      );
    };
  },
});

export const NextMusic = defineComponent({
  name: "NextMusic",
  setup(props, { slots, emit }) {
    return () => {
      return (
        <div className="next-music">
          <i class="iconfont icon-nextmusic" title="下一首"></i>
        </div>
      );
    };
  },
});

export const Volume = defineComponent({
  name: "Volume",
  setup(props, { slots, emit }) {
    const isShow = ref(false);
    const volumeRef = ref<HTMLDivElement>();
    const switchShow = () => (isShow.value = !isShow.value);
    const audioStore = useAudioStore();
    const volumeData = computed(() => {
      const volume = audioStore.volume;
      return {
        decimal: volume,
        ratio: decimalToPercent(volume),
      };
    });
    const volumeChange = ({ decimal }: ProgressInfo) => {
      audioStore.volume = decimal;
    };
    const switchMuted = () => {
      //如果音量为0，就return
      if (audioStore.volume === 0) return;
      //切换静音状态
      audioStore.mute = !audioStore.mute;
    };
    onClickOutside(volumeRef, () => (isShow.value = false), {
      event: "pointerup",
    });

    return () => {
      const { mute } = audioStore;
      const { ratio, decimal } = volumeData.value;
      return (
        <div class="volume" ref={volumeRef}>
          <div className="volume-noumenon" onClick={switchShow}>
            <i className="iconfont icon-yinliang" hidden={mute}></i>
            <i className="iconfont icon-mute" hidden={!mute}></i>
          </div>
          <div className="volume-suspension" visibility={isShow.value}>
            <div className="volume-progressbar">
              <ProgressBar
                dir="vertical"
                dotFixed={true}
                onChange={volumeChange}
                currentRatio={decimal * 100}
              ></ProgressBar>
            </div>
            <div className="volume-ratio">{ratio}</div>
            <div class="volume-duplicate" onClick={switchMuted}>
              <i className="iconfont icon-yinliang" hidden={mute}></i>
              <i className="iconfont icon-mute" hidden={!mute}></i>
            </div>
          </div>
        </div>
      );
    };
  },
});

export enum MusicLoveTitle {
  "本宝宝喜欢你~~" = 1,
  "本宝宝讨厌你~~" = 0,
}

export const MusicLoveIcon = defineComponent({
  name: "MusicLoveIcon",
  setup(props, { slots, emit }) {
    const loved = ref(false);
    const loveSwitch = () => loved.value = !loved.value;
    return () => {
      const isLove = loved.value;
      const loveTitle = MusicLoveTitle[isLove ? 0 : 1];
      return (
        <div className="music-love-icon" title={loveTitle} loved={isLove} onClick={loveSwitch}>
          <i className="iconfont icon-love" hidden={isLove}></i>
          <i className="iconfont icon-loved" hidden={!isLove}></i>
        </div>
      );
    };
  },
});

export const CurrentPlayTime = defineComponent({
  name: "CurrentPlayTime",
  setup(props, { slots, emit }) {
    const audioStore = useAudioStore();
    return () => {
      return (
        <div className="current-playtime">
          <span class="current">{second2TimeStr(audioStore.currentTime)}</span>
          <span> / </span>
          <span class="total">{second2TimeStr(audioStore.duration)}</span>
        </div>
      );
    };
  },
});

export const MusicSinger = defineComponent({
  name: "MusicSinger",
  props: {
    singers: {
      type: Array as PropType<CurrentSongInfo["singers"]>,
      required: true,
    },
    class: {
      type: String as PropType<string>,
      required: false,
      default: () => "",
    },
  },
  setup(props, { slots, emit }) {
    const router = useRouter();
    const toSingerDetailPage = (id: number) => {
      router.push({
        path: "/artist",
        query: { id },
      });
    };
    const className = computed(() => {
      return "music-singer " + props.class;
    });
    return () => {
      const { singers } = props;
      return (
        <p class={className.value} singallinedot>
          {singers.map(({ id, name }, i) => {
            return (
              <>
                <span onClick={() => toSingerDetailPage(id)} title={name}>{name}</span>
                {i !== singers.length - 1 && <em> / </em>}
              </>
            );
          })}
        </p>
      );
    };
  },
});
