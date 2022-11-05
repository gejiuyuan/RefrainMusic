/** @format */

export const playRecordTimeRange = [
	{ type: 1, text: '最近一周' },
	{ type: 0, text: '所有时间' },
];

export const defaultPlayRecordType = playRecordTimeRange[0].type;

export const baseUserMenuRouteLists = [
	{ to: '/user/playRecord', text: '听歌排行' },
	{ to: '/user/collection', text: '收藏' },
	{ to: '/user/songlist', text: '歌单' },
];
