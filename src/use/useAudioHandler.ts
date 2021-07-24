import { watch, toRefs, watchEffect } from "vue";
import useHowler from "@/use/useHowler";
import useAudioStore from "@/stores/audio";
import { useLoadingBar, useMessage } from "naive-ui";
import usePlayerStore from "@/stores/player";
import { messageApiInjectionKey } from "naive-ui/lib/message/src/MessageProvider";
import { UNICODE_CHAR } from "@/utils";

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
    load,
    loop,
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
      playSound(val, {
        loop: audioStore.loop,
      });
      audioStore.playing = true;
      loadingBar.start();
    }
  );

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

    clearInterval(timeUpdateInterval);
    timeUpdateInterval = setInterval(() => {
      if (!playing.value) return;
      audioStore.currentTime = currentTime.value;
    }, 500);
  });

  on("loaderror", () => {
    loadingBar.error();
    message.error(`歌曲加载失败啦~${UNICODE_CHAR.pensive}`, {
      duration: 2000,
    })
  });
}
