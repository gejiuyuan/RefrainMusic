/** @format */

import usePlayerStore, { playerQueue } from './player';
import { getOrPutPlayQueue, playerDB, PlayerDBTables } from '@/database';
import { getOrPutBannerList, MusicHallDBTables } from '@/database/musicHall';
import useMusicHallStore from './musicHall';

const IndexedDBInit = {
	/**
	 * playQueue
	 */
	[PlayerDBTables.playerQueue]: async () => {
		const playQueue = await getOrPutPlayQueue();
		if (playQueue) {
			playerQueue.value = playQueue;
		}
	},
	/**
	 * bannerList
	 */
	[MusicHallDBTables.bannerList]: async () => {
		const bannerList = await getOrPutBannerList();
		useMusicHallStore().setBannerList(bannerList || []);
	},
} as const;

playerDB.transaction('rw', [playerDB.playQueue], async () => {
	await Promise.allSettled(Object.values(IndexedDBInit).map((fn) => fn()));
});
