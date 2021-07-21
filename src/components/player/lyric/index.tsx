import {
  defineComponent,
  toRefs,
  onMounted,
  isReactive,
  nextTick,
  toRaw,
  ref,
  shallowRef,
  shallowReactive,
  watch,
  reactive,
  onBeforeUnmount,
  markRaw,
} from "vue";
import { computedStyle, NOOP, UNICODE_CHAR } from "@utils/index";
import "./index.scss";
import usePlayerStore from "@/stores/player";
import useAudioStore from "@/stores/audio";
import { useEventListener } from "@vueuse/core";

//歌词移动时的悬浮条
export type Suspension = {
  isShow: boolean; //是否显示悬浮条
  time: string; //悬浮条左侧的时间
  interval: number; //等待多少秒隐藏悬浮框
  tarIndex: number; //目标播放索引
  hiddenTimer: ReturnType<typeof setTimeout>; //隐藏悬浮条的定时器
};

//歌词容器
export type LrcWrap = {
  height: number; //高度
  isDown: boolean; //是否按下
  canMove: boolean; //是否可以移动
  rateFactor: number; //移动速率
  transition: {
    defaultVal: string; //默认过渡时长
    value: string; //当前过渡时长
  }; //过渡效果
  translateY: {
    current: number; //当前偏移值
    min: number; //偏移值边界——最小
    max: number; //偏移值边界——最大
  }; //垂直方向偏移值
};

//歌词元素
export type LrcItemInfo = {
  heightArr: number[]; //每条歌词元素的高度数组
  lastHeight: number; //最后一条歌词元素的高度
  firstHeight: number; //第一条歌词元素的高度
};

export default defineComponent({
  name: "PlayerLyric",
  setup(props, { slots, emit }) {
    const playerStore = usePlayerStore();
    const audioStore = useAudioStore();

    //悬浮控制播放区
    const suspension = shallowReactive<Suspension>({
      isShow: false,
      time: "00:00",
      interval: 5000,
      hiddenTimer: setTimeout(NOOP),
      tarIndex: 0,
    });

    //歌词容器
    const lrcWrap = reactive<LrcWrap>({
      height: 0,
      isDown: false,
      canMove: false,
      rateFactor: 1,
      transition: {
        defaultVal: "0.28s",
        value: "0.28s",
      },
      translateY: {
        current: 0,
        min: 0,
        max: 0,
      },
    });

    //歌词元素
    const lrcItemInfo = markRaw<LrcItemInfo>({
      heightArr: [],
      lastHeight: 0,
      firstHeight: 0,
    });

    //当前显示歌词的index索引
    const currentIndex = ref<number>(0);
    //是否显示翻译图标
    const showTranslation = ref(false);

    //歌词为空时的文本
    const emptyText = ref("小果音乐，让生活充满音乐~");

    watch(
      () => audioStore.currentTime,
      (val) => {
        const exist = playerStore.lyricParsed.exist;
        //如果当前显示着播放悬浮框或者没有歌词就return
        if (suspension.isShow || !exist) return;
        const index = getCurItemIndexByTime(val);
        setCurItemIndex(index);
        setTranslateYByDynamicIndex(index);
      }
    );

    watch(
      () => suspension.isShow,
      (val) => {
        //浮动播放条显示时
        setLrcWrapTransition(!val);
      }
    );

    //歌词列表变动时
    watch(
      () => playerStore.lyricParsed,
      async (lyricParsed, oldLyricParsed) => {
        //如果没有歌词
        if (!lyricParsed.exist) {
          //重置本歌词组件的一些数据
          resetLrcData();
          return;
        }
        //重置播放悬浮框状态（如清除定时器）
        resetSuspension();
        await nextTick();
        //DOM更新后，再更新歌词容器等相关数据（如宽高等）
        updatedLrcData();
      }
    );

    //翻译图标显隐变动时
    watch(showTranslation, async (val) => {
      await nextTick();
      //如果播放悬浮窗是显示的，就设置为tarIndex，否则为当前播放的歌词的索引
      const willReachIndex = suspension.isShow
        ? suspension.tarIndex
        : currentIndex.value;
      updatedLrcData(willReachIndex);
    });

    onMounted(() => {
      useEventListener(document, "mousemove", lyricMove);
      useEventListener(document, "mouseup", lyricUp);
    });

    //更新将要播放的位置
    const setWillPlayTime = (time: number) => {
      audioStore.nextSeekTime = time;
    };

    //设置歌词容器过渡时长
    const setLrcWrapTransition = (isTransition: boolean) => {
      const transition = lrcWrap.transition;
      transition.value = isTransition ? transition.defaultVal : "0s";
    };

    //设置translateY值
    const setTranslateY = (value: number) => {
      lrcWrap.translateY.current = value;
    };

    //根据动态target索引设置当前trnslateY值
    const setTranslateYByDynamicIndex = (index: number) => {
      const tarTranslateY = getTarTranslateY(index);
      setTranslateY(tarTranslateY);
    };

    //根据tarIndex目标索引获取translateY值
    const getTarTranslateY = (index: number) => {
      const { heightArr } = lrcItemInfo;
      return (
        -heightArr.slice(0, index + 1).reduce((total, now) => total + now) +
        heightArr[index] / 2
      );
    };

    //根据translateY值获取tarIndex目标索引
    const getTarByTranslateY = () => {
      const curTranslateY = lrcWrap.translateY.current;
      const { heightArr } = lrcItemInfo;
      const { length } = heightArr;
      const offsetY = Math.abs(curTranslateY - lrcWrap.translateY.max);
      let mutipleDis = 0;
      let index = 0;
      for (let i = 0; i < length; i++) {
        const curItemh = heightArr[i];
        if (offsetY <= (mutipleDis += curItemh)) {
          if (Math.abs(offsetY - mutipleDis) >= curItemh / 2) {
            index = i;
          } else {
            index = i + 1;
          }
          break;
        }
      }
      const { time, timeStr } = playerStore.lyricParsed.lrcArr[index];
      return {
        time,
        timeStr,
        index,
      };
    };

    //根据当前播放时间获取歌词列表的index
    const getCurItemIndexByTime = (time: number) => {
      const lrcArr = playerStore.lyricParsed.lrcArr;
      const lastIndex = lrcArr.length - 1;
      let index = 0;
      //如果当前时间大于第一条歌词的时间
      if (time > lrcArr[0].time) {
        for (let i = 0; i < lastIndex; i++) {
          if (time >= lrcArr[i].time && time < lrcArr[i + 1].time) {
            index = i;
            break;
          } else {
            index = lastIndex;
          }
        }
      }
      return index;
    };

    //切换翻译状态
    const switchTranslation = () => {
      showTranslation.value = !showTranslation.value;
    };

    //重置悬浮框
    const resetSuspension = () => {
      setSuspensionShow(false);
      clearSuspensionHiddenTimer();
      setSuspensionTarIndex(0);
    };

    //悬浮条播放按钮的点击事件
    const suspensionPlayClick = () => {
      const tarIndex = suspension.tarIndex;
      setSuspensionShow(false);
      clearSuspensionHiddenTimer();
      setCurItemIndex(tarIndex);
      setTranslateYByDynamicIndex(tarIndex);
      setWillPlayTime(playerStore.lyricParsed.lrcArr[tarIndex].time);
    };

    // 清除悬浮条的隐藏的timer计时器
    const clearSuspensionHiddenTimer = () => {
      clearTimeout(suspension.hiddenTimer);
    };

    //设置悬浮条的隐藏的timer计时器
    const setSuspensionHiddenTimer = (interval: number) => {
      suspension.hiddenTimer = setTimeout(() => {
        setSuspensionShow(false);
        //设置lrcWraptranslateY
        setTranslateYByDynamicIndex(currentIndex.value);
        //定时器结束后将拖动的目标index与curIndex同步，以防不断点击翻译按钮出错。
        setSuspensionTarIndex(currentIndex.value);
      }, interval);
    };

    //设置悬浮条控制的目标索引
    const setSuspensionTarIndex = (index: number) => {
      suspension.tarIndex = index;
    };

    //控制悬浮条显隐
    const setSuspensionShow = (isShow: boolean) => {
      suspension.isShow = isShow;
    };

    //设置悬浮条的目标播放时间
    const setSuspensionTime = (timeStr: string) => {
      suspension.time = timeStr.replace(/\.\d+/, "");
    };

    //设置当前歌词的index索引
    const setCurItemIndex = (i: number) => {
      currentIndex.value = i;
    };

    //重置歌词数据
    const resetLrcData = () => {
      emptyText.value = `小右没有发现歌词喔~~${UNICODE_CHAR.pensive}`;
      lrcItemInfo.heightArr = [];
      lrcItemInfo.lastHeight = 0;
      lrcItemInfo.firstHeight = 0;
      lrcWrap.height = 0;
      lrcWrap.translateY = {
        min: 0,
        max: 0,
        current: 0,
      };
    };

    const lrcContentsRef = ref<HTMLElement>();
    //更新歌词相关数据
    const updatedLrcData = (curIdx: number = 0) => {
      const el = lrcContentsRef.value!;
      const lrcWrapHeight = Number.parseFloat(computedStyle(el, "height"));
      const lrcItemsHeightArr = Array.from(el.children).map((childEl) =>
        Number.parseFloat(computedStyle(childEl, "height"))
      );
      const lrcLastItemHeight = lrcItemsHeightArr[lrcItemsHeightArr.length - 1];
      const lrcfirstItemHeight = lrcItemsHeightArr[0];

      lrcItemInfo.heightArr = lrcItemsHeightArr;
      lrcItemInfo.lastHeight = lrcLastItemHeight;
      lrcItemInfo.firstHeight = lrcfirstItemHeight;
      lrcWrap.height = lrcWrapHeight;
      lrcWrap.translateY.min = -(lrcWrapHeight - lrcLastItemHeight / 2);
      lrcWrap.translateY.max = -lrcfirstItemHeight / 2;
      //根据当前播放的歌词索引来确定translateY值
      setTranslateYByDynamicIndex(curIdx);
    };

    //更新歌词悬浮条信息
    const updateSuspensionPlayInfo = () => {
      const curTimeInfo = getTarByTranslateY();
      setSuspensionTime(curTimeInfo.timeStr);
      setSuspensionTarIndex(curTimeInfo.index);
    };

    const lyricDown = (ev: MouseEvent) => {
      if (ev.button !== 0) return;
      lrcWrap.isDown = true;
      lrcWrap.canMove = true;
      setSuspensionShow(true);
      clearSuspensionHiddenTimer();
      updateSuspensionPlayInfo();
    };

    const lyricMove = (ev: MouseEvent) => {
      const {
        canMove,
        translateY: lrcWrapTranslateY,
        rateFactor,
      } = toRefs(lrcWrap);
      if (!canMove.value) return;
      const { min, max, current } = lrcWrapTranslateY.value;
      let translateY = current + ev.movementY * rateFactor.value;
      if (translateY > max) {
        translateY = max;
      } else if (translateY < min) {
        translateY = min;
      }
      lrcWrap.translateY.current = translateY;
      updateSuspensionPlayInfo();
    };

    const lyricUp = (ev: MouseEvent) => {
      if (!lrcWrap.isDown) return;
      lrcWrap.isDown = false;
      lrcWrap.canMove = false;
      setSuspensionHiddenTimer(suspension.interval);
    };

    return () => {
      const { exist, canTranslate, lrcArr } = playerStore.lyricParsed;
      const { isShow, time } = suspension;
      const showtransIcon = showTranslation.value;
      const emptyTextVal = emptyText.value;
      const currentIndexValue = currentIndex.value;

      return (
        <div class="player-lyric" translated={showtransIcon}>
          <div class="player-lyric-exsit" hidden={!exist}>
            <div class="exsit-operator">
              <div class="operator-textarea" onMousedown={lyricDown}>
                <div
                  visibility={isShow}
                  class="textarea-suspension suspension-left"
                >
                  <span class="suspension-time">{time}</span>
                  <em class="suspension-dots"></em>
                </div>

                <div
                  visibility={isShow}
                  class="textarea-suspension suspension-right"
                  onClick={suspensionPlayClick}
                >
                  <em class="suspension-dots"></em>
                  <em class="suspension-icon">
                    <div class="suspension-play">
                      <i class="iconfont icon-bofan"></i>
                    </div>
                  </em>
                </div>

                <ul
                  class="textarea-contents"
                  ref={lrcContentsRef}
                  style={{
                    transform: `translateY(${lrcWrap.translateY.current}px)`,
                    transition: lrcWrap.transition.value,
                  }}
                >
                  {lrcArr.map((list, i) => {
                    return (
                      <li
                        class="content-lyric"
                        active={i === currentIndexValue}
                      >
                        <span class="lyric-text">{list.text}</span>
                        <div
                          hidden={!(showtransIcon && list.translation)}
                          class="lyric-translation"
                        >
                          {list.translation}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div
              class="player-lyric-translate"
              active={showtransIcon}
              hidden={!canTranslate}
              onClick={switchTranslation}
            >
              <i class="iconfont icon-translate"></i>
            </div>
          </div>
          <div class="player-lyric-empty" hidden={exist}>
            <div className="empty-main">{emptyTextVal}</div>
          </div>
        </div>
      );
    };
  },
});
