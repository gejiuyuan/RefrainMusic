/** @format */

import { bannerInfo } from '@/api/other';
import { getOrPutBannerList } from '@/database/musicHall';
import { BannerListItem } from '@/types/musicHall';
import { once, onceInLoop } from '@/utils';
import { defineStore } from 'pinia';
import { customRef } from 'vue';

interface MusicHallStoreType {
	bannerList: BannerListItem[];
}

const pollingTasks = {
	bannerList: onceInLoop(function (this: ReturnType<typeof useMusicHallStore>) {
		// 等2分钟请求同步一次
		bannerInfo({ type: 0 }).then(({ banners = [] }) => {
			getOrPutBannerList((this.bannerList = banners));
		});
	}, 1000 * 60 * 2),
} as const;

const useMusicHallStore = defineStore({
	id: 'musicHallStore',
	state() {
		const musicHallState: MusicHallStoreType = {
			bannerList: [],
		};
		return musicHallState;
	},
	getters: {},
	actions: {
		setBannerList(bannerList: typeof this.bannerList) {
			this.bannerList = bannerList;
			pollingTasks.bannerList.call(this, {
				immediate: !this.bannerList.length,
			});
		},
	},
});

export default useMusicHallStore;
