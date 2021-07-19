import { watch, toRefs, watchEffect } from "vue";
import useHowler from "@/use/useHowler";
import useAudioStore from "@/stores/audio";
import { useLoadingBar } from "naive-ui";
import usePlayerStore from "@/stores/player";

export function useAudioHandler() {
  const loadingBar = useLoadingBar()!;
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

  watch(
    () => playerStore.lyricParsed,
    (data) => {
      console.info(data);
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
    }, 1000);
  });

  on("loaderror", () => {
    loadingBar.error();
  });
}
