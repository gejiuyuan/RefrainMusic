import { defineComponent, watch, toRefs, watchEffect } from "vue"
import useHowler from "@/use/useHowler"
import useAudioStore from "@/stores/audio"
import {
  useLoadingBar
} from 'naive-ui';

export default defineComponent({
  name: 'AudioMaster',
  setup(props, { emit, slots }) {
    const loadingBar = useLoadingBar()!;
    const audioStore = useAudioStore();
    const {
      playSound, state, playing, volume, rate, mute, load, loop, play,
      stop, currentTime, duration, on, off, once,
    } = useHowler()
    let timeUpdateInterval: ReturnType<typeof setInterval>;
    watch(() => audioStore.srcOrId, (val) => {
      playSound(val, {
        loop: audioStore.loop
      });
      audioStore.playing = true;
      loadingBar.start();
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
    })

    watch(() => audioStore.playing, (val) => {
      playing.value = val;
    })

    on('load', () => {
      loadingBar.finish();

      audioStore.duration = duration.value;

      timeUpdateInterval = setInterval(() => {
        if (!playing.value) return;
        audioStore.currentTime = currentTime.value;
      }, 1000);

    });


    on('loaderror', () => {
      loadingBar.error();
    })

    return (
      <></>
    )

  }
})