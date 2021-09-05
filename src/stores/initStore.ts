
import usePlayerStore from './player';

import { getOrPutCurrentSong, getOrPutPlayQueue, playerDB } from '@/database';

/**
 * 从DB中获取playQueue
 */
export async function initPlayQueueFromDB() {
  const playerStore = usePlayerStore();
  const playQueue = await getOrPutPlayQueue();
  if (playQueue) {
    playerStore.playerQueue.songList = playQueue;
  }
}

/**
 * 从DB中获取currentSongInfo
 */
export async function initCurrentSongInfo() {
  const playerStore = usePlayerStore();
  const currentSong = await getOrPutCurrentSong();
  if (currentSong) {
    //先初始化加载音乐播放相关资源或数据
    playerStore.handlePlaySoundNeededData(currentSong.id, {
      needJudge: false,
      needSave: false,
    });
  }
}

playerDB.transaction('rw', [playerDB.playQueue, playerDB.currentSong], () => {
  initPlayQueueFromDB();
  initCurrentSongInfo();
});
