/** @format */

import { anfrage, anfrageWithLoading } from '@/request';
import { filterUselessKey } from '@utils/index';

/**
 * 歌手分类列表
 *  - limit 返回数量 , 默认为 30
 *  - offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值,
 * 默认为 0
 *  - initial: 按首字母索引查找参数,如 /artist/list?type=1&area=96&initial=b
 *          返回内容将以 name 字段开头为 b 或者拼音开头为 b 为顺序排列, 热门传-1,#传0
 *  - type 值：-1:全部
 *              1:男歌手
 *              2:女歌手
 *              3:乐队
 *  - area 值：1:全部
 *              7华语
 *              96欧美
 *              8:日本
 *              16韩国
 *              0:其他
 *
 */
type artistParams = 'limit' | 'offset' | 'initial' | 'type' | 'area';
export function artistList(params: Partial<Record<artistParams, number | string>>) {
	const { limit = 30, offset = 0, type = -1, area = -1, initial } = params;
	return anfrageWithLoading({
		url: '/artist/list',
		method: 'get',
		params: filterUselessKey({
			limit,
			offset: +limit * +offset,
			type,
			area,
			initial,
		}),
	});
}

/**
 * 收藏/取消收藏歌手
 *  - id 歌手id
 *  - t 操作，1为收藏，其他为取消收藏
 */
export function artistSub(params: { id: number | string; sure: boolean }) {
	const { sure, id } = params;
	return anfrage({
		url: '/artist/sub',
		method: 'post',
		params: {
			id,
			t: sure ? 1 : -1,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 歌手热门50首歌曲
 * 说明 : 调用此接口,可获取歌手热门50首歌曲
 *  - id 歌手id
 */
export function artistTopSong(params: { id: number | string }) {
	return anfrageWithLoading({
		url: '/artist/top/song',
		method: 'get',
		params: {
			...params,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 歌手全部歌曲
 * 说明 : 调用此接口,可获取歌手全部歌曲
 *  - id 歌手id
 *  - order : hot ,time 按照热门或者时间排序
 *  - limit: 取出歌单数量 , 默认为 50
 *  - offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 */
export function artistSongs(params: {
	id: number | string;
	order?: string;
	limit?: number | string;
	offset?: number | string;
}) {
	const { limit = 50, offset = 0, order, id } = params;
	return anfrageWithLoading({
		url: '/artist/songs',
		method: 'get',
		params: filterUselessKey({
			limit,
			offset: +limit * +offset,
			order,
			id,
		}),
	});
}

/**
 * 获取歌手单曲
 */
export function artistSingalSongs(params: { id: string | number }) {
	return anfrageWithLoading({
		url: '/artists',
		method: 'get',
		params: {
			...params,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 获取歌手专辑
 */
export function artistAlbum(params: {
	id: string | number;
	limit?: number | string;
	offset?: number | string;
}) {
	const { limit = 50, offset = 0, id } = params;
	return anfrageWithLoading({
		url: '/artist/album',
		method: 'get',
		params: {
			id,
			limit,
			offset: +limit * +offset,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 获取歌手mv
 * @param id 歌手id
 */
export function artistMv(params: {
	id: string | number;
	limit?: number | string;
	offset?: number | string;
}) {
	const { limit = 30, offset = 0, id } = params;
	return anfrageWithLoading({
		url: '/artist/mv',
		method: 'get',
		params: filterUselessKey({
			id,
			limit,
			offset: +limit * +offset,
			timestamp: new Date().valueOf(),
		}),
	});
}

/**
 * 获取歌手描述
 */
export function artistDesc(params: { id: string | number }) {
	return anfrageWithLoading({
		url: '/artist/desc',
		method: 'get',
		params,
	});
}

/**
 * 获取歌手详情
 */
export function artistDetail(params: { id: string | number }) {
	return anfrageWithLoading({
		url: '/artist/detail',
		method: 'get',
		params,
	});
}

/**
 * 获取相似歌手
 */
export function artistSimilar(params: { id: string | number }) {
	return anfrageWithLoading({
		url: '/simi/artist',
		method: 'get',
		params,
	});
}

/**
 * 热门歌手
 */
export function artistHot(params: { limit?: number | string; offset?: number | string }) {
	const { limit = 50, offset = 0 } = params;
	return anfrageWithLoading({
		url: '/top/artists',
		method: 'get',
		params: {
			limit,
			offset: +limit * +offset,
		},
	});
}

/**
 * 歌手榜
 */
export function artistTopList(params: { type?: number | string }) {
	return anfrageWithLoading({
		url: '/toplist/artist',
		method: 'get',
		params: filterUselessKey(params),
	});
}
