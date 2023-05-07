/** @format */

import Dexie from 'dexie';
import { DbTable } from './database';
import { is } from '@/utils';
import { toRaw } from 'vue';
import { BannerListItem } from '@/types/musicHall';

export enum MusicHallDBTables {
	bannerList = 'bannerList',
}

const bannerListInfo =
	'imageUrl,scm,url,typeTitle,targetId,targetType,exclusive,titleColor,video';

class MusicHallDatabase extends Dexie {
	public bannerList!: DbTable<BannerListItem[], number>;

	constructor() {
		super('MusicHallDatabase');
		this.version(1).stores({
			bannerList: `${bannerListInfo}`,
		});
		this.bannerList.mapToClass(BannerListMaster);
	}
}

export class BannerListMaster {}

export const musicHallDB = new MusicHallDatabase();
musicHallDB.open();

export async function getOrPutBannerList(): Promise<BannerListItem[]>;
export async function getOrPutBannerList(list: BannerListItem[]): Promise<number[]>;
export async function getOrPutBannerList(list?: BannerListItem[]) {
	let method = '';
	if (is.undefined(list)) {
		method = 'toArray';
	} else if (is.array(list)) {
		method = 'bulkPut';
	} else {
		method = 'put';
	}
	return await musicHallDB.bannerList[method](list && toRaw(list));
}
