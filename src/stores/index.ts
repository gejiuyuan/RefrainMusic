export * from './player';
export * from './audio';
export * from './user';

import { playerDB } from '@/database';
import { initCurrentSongInfo, initPlayQueueFromDB } from './player';

export function initStore() {

  playerDB.transaction('rw', playerDB.currentSong, playerDB.playQueue, () => {
    initPlayQueueFromDB();
    initCurrentSongInfo();
  });

}