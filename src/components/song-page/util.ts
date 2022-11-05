/** @format */

import { SongInfo } from '@/types/song';
import { getLocaleDate, second2TimeStr } from '@/utils';

export const getSongDetailList = ({
	al: { name: albumName },
	ar,
	dt,
	publishTime,
	pop,
}: SongInfo) => {
	return [
		{
			attr: '歌者',
			value: ar
				.map(
					({ name, alias }) =>
						`${name}${alias?.length ? '(' + alias.join('、') + ')' : ''}`,
				)
				.join(' / '),
		},
		{
			attr: '专辑',
			value: `《 ${albumName} 》`,
		},
		{
			attr: '时长',
			value: second2TimeStr(dt / 1000),
		},
		{
			attr: '发行时间',
			value: getLocaleDate(publishTime),
		},
		{
			attr: '热度',
			value: pop,
		},
	];
};
