import { watch, toRefs, watchEffect } from "vue";
import useHowler, { UseHowlerOptions } from "@/use/useHowler";
import useAudioStore from "@/stores/audio";
import { useLoadingBar, useMessage } from "naive-ui";
import usePlayerStore from "@/stores/player";
import { messageApiInjectionKey } from "naive-ui/lib/message/src/MessageProvider";
import { UNICODE_CHAR } from "@/utils";
import { isSingleLoopOrder } from "@/widgets/music-tiny-comp";

/**
 * 播放下一首歌的标识，用于在pinia.$action中的after中接受
 */
export const TO_NEXT_MARK = 'toNextMark';

export function useAudioHandler() {
  const loadingBar = useLoadingBar()!;
  const message = useMessage();
  const audioStore = useAudioStore();
  const playerStore = usePlayerStore();

  const {
    playSound,
    state,
    playing,
    volume,
    rate,
    mute,
    loop,
    load,
    play,
    stop,
    currentTime,
    duration,
    on,
    off,
    once,
  } = useHowler();
  let timeUpdateInterval: ReturnType<typeof setInterval>;

  watch(
    () => audioStore.srcOrId,
    (val) => {
      playSound(val);
      //设置是否循环播放
      setLoopStatus();
      audioStore.playing = true;
      loadingBar.start();
    }
  );

  const setLoopStatus = () => {
    loop.value = isSingleLoopOrder(playerStore.order);
  }

  watchEffect(() => {
    //是否单曲循环播放
    loop.value = playerStore.order === 'singleLoop';
  });

  on('end', () => {
    if (playerStore.order === 'singleLoop') {
      return;
    }
    //通知playerStore执行toNext切换下一首方法
    playerStore.publishAfterMark(TO_NEXT_MARK);
  });

  watchEffect(() => {
    currentTime.value = audioStore.nextSeekTime;
  });

  watchEffect(() => {
    volume.value = audioStore.volume;
    audioStore.mute = audioStore.volume === 0;
  });

  watchEffect(() => {
    mute.value = audioStore.mute;
  });

  watch(
    () => audioStore.playing,
    (val) => {
      playing.value = val;
    }
  );

  on("load", () => {
    loadingBar.finish();

    audioStore.duration = duration.value;
    loop.value = playerStore.order === 'singleLoop';

    clearInterval(timeUpdateInterval);
    timeUpdateInterval = setInterval(() => {
      if (!playing.value) return;
      audioStore.currentTime = currentTime.value;
    }, 500);
  });

  on("loaderror", () => {
    loadingBar.error();
    message.error(`歌曲加载失败啦~将在2秒后播放下一首喔~${UNICODE_CHAR.pensive}`, {
      duration: 2000,
    })
    setTimeout(() => {
      //通知playerStore执行toNext切换下一首方法
      playerStore.publishAfterMark(TO_NEXT_MARK);
    }, 2000)
  });
}
