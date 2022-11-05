/** @format */

import usePlayerStore, { playerQueue } from './player';
import { getOrPutPlayQueue, playerDB } from '@/database';

/**
 * 从DB中获取playQueue
 */
export async function initPlayQueueFromDB() {
	const playQueue = await getOrPutPlayQueue();
	if (playQueue) {
		playerQueue.value = playQueue;
	}
}

playerDB.transaction('rw', [playerDB.playQueue], () => {
	initPlayQueueFromDB();
});
