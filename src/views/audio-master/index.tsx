import { defineComponent, watch } from "vue"
import useHowler from "@/use/useHowler"
import useAudioStore from "@/stores/audio"

export default defineComponent({
  name: 'AudioMaster',
  setup(props, { emit, slots }) {
    const audioStore = useAudioStore();

    const { playSound, state, volume, rate, mute, load, loop, play, stop, seek, duration, on, off, once } = useHowler()

    watch(() => audioStore.srcOrId, (val) => {
      console.info(val)
      playSound(val);
    });

    on('load', () => {
      console.info(
        state.value + 'state\n',
        volume.value + 'volume\n',
        rate.value + 'rate\n',
        duration.value + 'duration\n',
        seek.value + 'seek\n',
        mute.value + 'mute\n',
        loop.value + 'loop',
      )
    })
    on('loaderror', () => {
      console.info(
        state.value + 'state\n',
        volume.value + 'volume\n',
        rate.value + 'rate\n',
        duration.value + 'duration\n',
        seek.value + 'seek\n',
        mute.value + 'mute\n',
        loop.value + 'loop',
      )
    })

    return (
      <></>
    )

  }
})