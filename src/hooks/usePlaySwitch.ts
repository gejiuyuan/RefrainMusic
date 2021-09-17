import usePlayerStore, { currentSongRefGlobal } from "@/stores/player";
import { AudioMaster } from "@/stores/audio";
import { getRandomList } from "@/utils";
import { onKeyStroke } from "@vueuse/core";
import { computed, customRef, reactive, ref, watch, watchEffect } from "vue";
import { messageBus } from "@/utils/event/register";

export const isCtrlAndArrowRight = ({ ctrlKey, key }: KeyboardEvent) => {
  return ctrlKey && key === 'ArrowRight'
}

export const isCtrlAndArrowLeft = ({ ctrlKey, key }: KeyboardEvent) => {
  return ctrlKey && key === 'ArrowLeft'
}

export default function usePlaySwitch() {

  const playerStore = usePlayerStore();

  const randomPlaylist = ref<typeof playerStore.playerQueue>([]);

  watchEffect(() => {
    if (AudioMaster.isRandomOrder) {
      randomPlaylist.value = getRandomList(playerStore.playerQueue);
    }
  });

  const realPlaylist = computed(() => {
    return AudioMaster.isRandomOrder ? randomPlaylist.value : playerStore.playerQueue
  })

  const currentPlayIndex = customRef<number>((track, trigger) => ({
    get() {
      track();
      const { id: currentSongId } = currentSongRefGlobal.value;
      return realPlaylist.value.findIndex(({ id }) => id == currentSongId) || 0
    },
    set(idx) {
      const targetId = realPlaylist.value[idx].id
      playerStore.handlePlaySoundNeededData(targetId);
      trigger();
    }
  }));

  /**
   * 切换至下一首
   */
  const toNext = () => {
    let value = currentPlayIndex.value;
    if (++value >= realPlaylist.value.length) {
      value = 0;
    }
    currentPlayIndex.value = value;
  }

  /**
   * 切换至上一首
   */
  const toPrevious = () => {
    let value = currentPlayIndex.value;
    if (--value < 0) {
      value = realPlaylist.value.length - 1;
    }
    currentPlayIndex.value = value;
  }

  /**
   * Ctrl+Left切换上一首
   */
  onKeyStroke(isCtrlAndArrowLeft, toPrevious, {
    eventName: 'keyup'
  });

  /**
   * Ctrl+Right切换下一首
   */
  onKeyStroke(isCtrlAndArrowRight, toNext, {
    eventName: 'keyup'
  });

  //订阅播放下一首歌曲的消息
  messageBus.on('toNext', toNext);

  return {
    toNext,
    toPrevious,
  }

}