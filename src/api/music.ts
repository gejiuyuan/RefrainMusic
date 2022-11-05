/** @format */

import { anfrage, anfrageWithLoading } from '@/request';
import { filterUselessKey, is } from '@utils/index';
import { SongInfo, SongsDetail, SongUrlInfo } from '@type/song';
import { CommentType } from '@/dependency/enum';

/**
 * 获取音乐 url
 * 说明 : 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口,
 *      传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,
 *      !!!未登录状态返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
 * @param {string} id - 音乐的 id，例如 id=405998841,33894312
 */
export function getMusic(params: { id: number | string; br?: number | string }) {
	const queryParams = filterUselessKey({ ...params });
	return anfrageWithLoading({
		url: '/song/url',
		method: 'get',
		params: {
			...queryParams,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 音乐是否可用
 *
 * 说明: 调用此接口,传入歌曲 id, 可获取音乐是否可用,返回
 *      { success: true, message: 'ok' } 或者 { success: false, message: '亲爱的,暂无版权' }
 *
 *  - id 歌曲id
 *  - br 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,
 *          其他类推
 *
 */
export function checkMusic(params: { id: number | string; br?: number | string }) {
	return anfrageWithLoading({
		url: '/check/music',
		method: 'get',
		params: filterUselessKey(params),
	});
}

/**
 * 获取歌词
 * @param params
 * @returns
 */
export function getLyric(params: { id: string | number }) {
	return anfrageWithLoading({
		url: '/lyric',
		method: 'get',
		params,
	});
}

/**
 * 新歌速递
 * @param params
 * @returns
 */
export function getNewExpressMusic(params: { type: number | string }) {
	return anfrageWithLoading({
		url: '/top/song',
		method: 'get',
		params: {
			...params,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 歌曲评论
 * @param params
 * @returns
 */
export function getMusicComment(params: {
	id: number | string;
	limit?: number | string;
	offset?: number | string;
	before?: number | string;
}) {
	const { limit = 20, offset = 0, before, id } = params;
	return anfrageWithLoading({
		url: '/comment/music',
		method: 'get',
		params: filterUselessKey({
			limit,
			id,
			before,
			offset: +limit * +offset,
			timestamp: new Date().valueOf(),
		}),
	});
}

/**
 * 歌曲详情
 */
export type GetMusicDetailReturnType = {
	songs: SongInfo[];
};
export function getMusicDetail({
	ids,
}: {
	ids: string | string[];
}): Promise<SongsDetail> {
	return anfrageWithLoading({
		url: '/song/detail',
		method: 'get',
		params: {
			ids: is.array(ids) ? ids.join(',') : ids,
		},
	});
}

/**
 * 获取相似音乐
 */
export function getMusicSimilar(params: { id: string | number }) {
	return anfrageWithLoading({
		url: '/simi/song',
		method: 'get',
		params,
	});
}

/**
 * 获取每日推荐歌曲
 */
export function musicRecommend() {
	return anfrageWithLoading({
		url: '/recommend/songs',
		method: 'get',
	});
}

/**
 * 推荐新音乐
 */
export function newMusicRecommend(params: { limit?: number | string }) {
	const { limit = 10 } = params;
	return anfrageWithLoading({
		url: '/personalized/newsong',
		method: 'get',
		params: {
			limit,
			timestamp: new Date().valueOf,
		},
	});
}

/**
 *
 * 评论(取消）点赞
 * @export
 * @param {({
 *   id: string | number;
 *   cid: string | number;
 *   t: 1 | 0;
 *   type: CommentType;
 * })} {id, cid, t, type}
 * @return {*}
 */
export function musicCommentLike({
	id,
	cid,
	t,
	type,
}: {
	// 资源id，如歌曲、mv等
	id: string | number;
	// 评论id
	cid: string | number;
	// 1为点赞、0为取消点赞
	t: 1 | 0;
	// 资源类型
	type: CommentType;
}) {
	const actualParams: PlainObject = { cid, t, type };
	// 如果是动态的评论
	if (type === CommentType.dynamic) {
		actualParams.threadId = id;
	} else {
		actualParams.id = id;
	}
	return anfrage({
		url: '/comment/like',
		method: 'post',
		params: actualParams,
	}).then((res) => res.code === 200);
}
