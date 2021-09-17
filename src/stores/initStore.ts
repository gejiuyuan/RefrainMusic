
import usePlayerStore from './player';
import { getOrPutPlayQueue, playerDB } from '@/database';

/**
 * 从DB中获取playQueue
 */
export async function initPlayQueueFromDB() {
  const playerStore = usePlayerStore();
  const playQueue = await getOrPutPlayQueue();
  if (playQueue) {
    playerStore.playerQueue = playQueue;
  }
}

playerDB.transaction('rw', [playerDB.playQueue], () => {
  initPlayQueueFromDB();
});
