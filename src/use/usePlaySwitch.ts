import useAudioStore from "@/stores/audio";
import usePlayerStore from "@/stores/player";
import { getRandomList } from "@/utils";
import { PlayOrderType, isRandomOrder } from "@/widgets/music-tiny-comp";
import { onKeyStroke } from "@vueuse/core";
import { computed, customRef, reactive, ref, watch, watchEffect } from "vue";
import { TO_NEXT_MARK } from "./useAudioHandler";

export const isCtrlAndArrowRight = ({ ctrlKey, key }: KeyboardEvent) => {
  return ctrlKey && key === 'ArrowRight'
}

export const isCtrlAndArrowLeft = ({ ctrlKey, key }: KeyboardEvent) => {
  return ctrlKey && key === 'ArrowLeft'
}

export default function usePlaySwitch() {

  const playerStore = usePlayerStore();
  const audioStore = useAudioStore();

  const playlist = playerStore.playerQueue.songList;

  const randomPlaylist = ref<typeof playlist>([]);

  watchEffect(() => {
    if (isRandomOrder(playerStore.order)) {
      randomPlaylist.value = getRandomList(playlist);
    }
  });

  const currentPlayIndex = (() => {

    const getRealPlaylist = () => {
      return isRandomOrder(playerStore.order) ? randomPlaylist.value : playlist
    }

    return customRef<number>((track, trigger) => ({
      get() {
        track();
        const { currentSongInfo: { id: currentSongId } } = playerStore;
        return getRealPlaylist().findIndex(({ id }) => id === currentSongId) || 0
      },
      set(idx) {
        const targetId = getRealPlaylist()[idx].id
        playerStore.handlePlaySoundNeededData(targetId);
        trigger();
      }
    }));

  })();

  //监听action方法执行
  playerStore.$onAction(({ after, onError }) => {
    //action中方法执行后的返回值
    after((resolvedValue) => {
      //播放下一首
      if (resolvedValue === TO_NEXT_MARK) {
        toNext();
      }
    });
  });

  /**
   * 切换至下一首
   */
  const toNext = () => {
    let value = currentPlayIndex.value;
    if (++value >= playlist.length) {
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
      value = playlist.length - 1;
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

  return {
    toNext,
    toPrevious,
  }

}