import {
  computed,
  customRef, 
  defineComponent,
  getCurrentInstance,
  isProxy,
  PropType,
  ref, 
} from "vue";
import ProgressBar, { 
  ProgressInfo,
} from "@widgets/progress-bar";
import "./index.scss";
import { decimalToPercent, is, second2TimeStr, UNICODE_CHAR } from "@/utils";
import { onClickOutside, onKeyStroke, useStorage } from "@vueuse/core";
import { playingRefGlobal, volumeRefGlobal, muteRefGlobal, currentTimeRefGlobal, durationHowlerRef, durationRefGlobal, Order } from "@/stores/audio";
import { useRouter } from "vue-router";
import { CurrentSongInfo, } from "@/utils/apiSpecial";
import usePlayerStore from "@stores/player";
import { orderRefGlobal } from '@stores/audio'
import useUserStore from "@stores/user";
import { userLikeMusic } from "@/api/user";
import { useMessage } from "naive-ui"; 
import { messageBus } from "@/utils/event/register";

export enum PlayOrderInfo {
  order = '顺序播放',
  random = '随机播放',
  singleLoop = '单曲循环'
}
export const PlayOrder = defineComponent({
  name: 'PlayOrder',
  setup(props, { slots, emit }) {
    const playOrderRef = ref<HTMLDivElement>()
    const playerStore = usePlayerStore();
    const suspensionShow = ref(false);

    onClickOutside(playOrderRef, () => {
      suspensionShow.value = false;
    })

    const switchOrderStatus = (orderStatus: Order) => {
      orderRefGlobal.value = orderStatus;
      suspensionShow.value = false;
    }

    const noumenonClick = () => {
      suspensionShow.value = true;
    }

    return () => {
      const order = orderRefGlobal.value;
      return (
        <div class="play-order controller-widget" ref={playOrderRef}>
          <div className="play-order-noumenon controller-widget-noumenon" onClick={noumenonClick} title={PlayOrderInfo[order]}>
            <i className="iconfont icon-random" hidden={order !== 'random'}></i>
            <i className="iconfont icon-order" hidden={order !== 'order'}></i>
            <i className="iconfont icon-single-loop" hidden={order !== 'singleLoop'}></i>
          </div>
          <div className="play-order-suspension controller-widget-suspension" visibility={suspensionShow.value}>
            <div class="play-order-duplicate controller-widget-duplicate">
              <div className="play-order-duplicate-item" onClick={() => switchOrderStatus('random')}>
                <i className="iconfont icon-random"></i>
                <span>{PlayOrderInfo.random}</span>
              </div>
              <div className="play-order-duplicate-item" onClick={() => switchOrderStatus('order')}>
                <i className="iconfont icon-order" hidden={false}></i>
                <span>{PlayOrderInfo.order}</span>
              </div>
              <div className="play-order-duplicate-item" onClick={() => switchOrderStatus('singleLoop')}>
                <i className="iconfont icon-single-loop" hidden={false}></i>
                <span>{PlayOrderInfo.singleLoop}</span>
              </div>
            </div>
          </div>
        </div>
      )

    }

  }
})

export const PlayStatusSwitch = defineComponent({
  name: 'PlayStatusSwitch',
  props: {
    id: {
      type: [String, Number] as PropType<string | number>,
      default: '',
    }
  },
  setup(props, { slots, emit }) {
 
    const playerStore = usePlayerStore();
    const playIconClass = computed(() => {
      return props.id === '' ? 'icon-bofan' : 'icon-play'
    })

    //是否是当前正在播放的歌曲
    const isCurrentPlayingSong = computed(() => {
      const id = props.id;
      return id === '' || playerStore.currentSongInfo.id === id
    });

    //播放按钮状态
    const playing = computed(() => {
      return isCurrentPlayingSong.value ? playingRefGlobal.value : false;
    });

    const switchHandler = () => {
      if (isCurrentPlayingSong.value) {
        if(is.emptyArray(playerStore.playerQueue)) {
          messageBus.dispatch('warnMessage', `阿娜达~快去添加音乐⑧${UNICODE_CHAR.smile}`, {
            duration: 4000,
            closable: true,
          });
          return;
        }
        playingRefGlobal.value = !playingRefGlobal.value;
      }
      else {  
        playerStore.handlePlaySoundNeededData(+props.id);
      }
    }
    return () => {
      const playingValue = playing.value;
      const playingIconClassValue = playIconClass.value;
      return (
        <div
          className="play-switch"
          onClick={switchHandler}
          title={playingValue ? "暂停" : "播放"}
        >
          <i class={`iconfont ${playingIconClassValue}`} hidden={playingValue}></i>
          <i class="iconfont icon-pause" hidden={!playingValue}></i>
        </div>
      )
    }

  }
})


export const isCtrlAndArrowUp = ({ key, ctrlKey }: KeyboardEvent) => {
  return ctrlKey && key === "ArrowUp";
}
export const isCtrlAndArrowDown = ({ key, ctrlKey }: KeyboardEvent) => {
  return ctrlKey && key === 'ArrowDown';
}

export const Volume = defineComponent({
  name: "Volume",
  setup(props, { slots, emit }) {
    const isShow = ref(false);
    const volumeRef = ref<HTMLDivElement>();
    const switchShow = () => (isShow.value = !isShow.value); 
    const volumeData = computed(() => {
      const volumeValue = volumeRefGlobal.value;
      return {
        decimal: volumeValue,
        ratio: decimalToPercent(volumeValue),
      };
    });
    const volumeChange = ({ decimal }: ProgressInfo) => {
      volumeRefGlobal.value = decimal;
    };
    const switchMuted = () => {
      //如果音量为0，就return
      if (volumeRefGlobal.value === 0) return;
      //切换静音状态
      muteRefGlobal.value = !muteRefGlobal.value;
    };
    onClickOutside(volumeRef, () => (isShow.value = false), {
      event: "pointerup",
    });

    onKeyStroke(isCtrlAndArrowUp, () => {
      let tarVolume = volumeRefGlobal.value + .05;
      tarVolume > 1 && (tarVolume = 1);
      volumeRefGlobal.value = tarVolume;
    }, {
      eventName: 'keyup',
    })

    onKeyStroke(isCtrlAndArrowDown, () => {
      let tarVolume = volumeRefGlobal.value - .05;
      tarVolume < 0 && (tarVolume = 0);
      volumeRefGlobal.value = tarVolume;
    }, {
      eventName: 'keyup',
    })

    return () => { 
      const mute = muteRefGlobal.value;
      const { ratio, decimal } = volumeData.value;
      const title = `音量：${ratio}；增大音量：Ctrl+Up；减小音量：Ctrl+Down`
      return (
        <div class="volume controller-widget" ref={volumeRef}>
          <div className="volume-noumenon controller-widget-noumenon" onClick={switchShow} title={title}>
            <i className="iconfont icon-yinliang" hidden={mute}></i>
            <i className="iconfont icon-mute" hidden={!mute}></i>
          </div>
          <div className="volume-suspension controller-widget-suspension" visibility={isShow.value} title={title}>
            <div className="volume-progressbar">
              <ProgressBar
                dir="vertical"
                dotFixed={true}
                onChange={volumeChange} 
                currentRatio={decimal * 100}
              ></ProgressBar>
            </div>
            <div className="volume-ratio">{ratio}</div>
            <div class="volume-duplicate controller-widget-duplicate" onClick={switchMuted}>
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
  props: {
    songInfo: {
      type: Object as PropType<CurrentSongInfo>,
      required: true,
    }
  },
  setup(props, { slots, emit }) {
    const loved = ref(false);
    const playerStore = usePlayerStore();
    const userStore = useUserStore();
    const message = useMessage();
    const vm = getCurrentInstance()!;

    const isLoved = customRef<boolean>((track, trigger) => ({
      get() {
        track();
        return userStore.myLoveListIds.includes(props.songInfo.id);
      },
      set(isLove) {
        const curId = props.songInfo.id;
        if (isLove) {
          userStore.myLoveListIds.push(curId);
        } else {
          userStore.myLoveListIds.some((tarId, i) => {
            if (tarId === curId) {
              userStore.myLoveListIds.splice(i, 1);
              return true;
            }
          })
        }
        trigger();
      }
    }))

    const loveSwitch = async () => {
      const { id, } = props.songInfo;
      if (!id) {
        message.error(`还没有播放的歌曲哦~${UNICODE_CHAR.hugface}`);
        return;
      }
      const willIsLovedValue = !isLoved.value;
      const { code } = await userLikeMusic({
        id,
        like: willIsLovedValue
      })
      if (code == 200) {
        isLoved.value = willIsLovedValue;
        message.success(`${willIsLovedValue ? `喜欢成功${UNICODE_CHAR.hugface}` : `已移除${UNICODE_CHAR.pensive}`}`);
        return;
      }

    }

    return () => {
      const isLovedValue = isLoved.value;
      const loveTitle = MusicLoveTitle[isLovedValue ? 0 : 1];
      return (
        <div className="music-love-icon" title={loveTitle} loved={isLovedValue} onClick={loveSwitch}>
          <i className="iconfont icon-love" hidden={isLovedValue}></i>
          <i className="iconfont icon-loved" hidden={!isLovedValue}></i>
        </div >
      );
    };
  },
});

export const CurrentPlayTime = defineComponent({
  name: "CurrentPlayTime",
  setup(props, { slots, emit }) { 
    return () => {
      return (
        <div className="current-playtime">
          <span class="current">{second2TimeStr(currentTimeRefGlobal.value)}</span>
          <span> / </span>
          <span class="total">{second2TimeStr(durationRefGlobal.value )}</span>
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

