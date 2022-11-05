/** @format */

import { anfrageWithLoading } from '@/request';
import { EMPTY_OBJ } from '@/utils';

/**
 * 获取视频标签列表
 * @returns
 */
export function getVideoTagList() {
	return anfrageWithLoading({
		url: '/video/group/list',
	});
}

/**
 * 获取视频分类列表（需登录）
 * @returns
 */
export function getVideoCategoryList() {
	return anfrageWithLoading({
		url: '/video/category/list',
	});
}

/**
 * 获取视频标签/分类下的视频
 * @param param
 * @returns
 */
export function getVideos(param: {
	id: string | number; //标签/分类id
	offset?: number | string; //分页偏移量;
}) {
	const { offset = 0, id } = param;
	return anfrageWithLoading({
		url: '/video/group',
		params: {
			id,
			offset,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 获取全部视频列表（需登录）
 * @param param
 * @returns
 */
export function getAllVideoList(
	param: {
		offset?: number | string;
	} = EMPTY_OBJ,
) {
	const { offset = 0 } = param;
	return anfrageWithLoading({
		url: '/video/timeline/all',
		params: {
			offset,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 获取推荐的视频（需登录）
 * @param param
 * @returns
 */
export function getRecommendVideos(
	param: {
		offset?: number | string;
	} = EMPTY_OBJ,
) {
	const { offset = 0 } = param;
	return anfrageWithLoading({
		url: '/video/timeline/recommend',
		params: {
			offset,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 获取相关视频
 * @param param
 * @returns
 */
export function getRelativeVideos(param: {
	id: string | number; //当前视频id
}) {
	const { id } = param;
	return anfrageWithLoading({
		url: '/related/allvideo',
		params: {
			id,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 获取视频的详情
 * @param param
 * @returns
 */
export function getVideoDetail(param: { id: string | number }) {
	const { id } = param;
	return anfrageWithLoading({
		url: '/video/detail',
		params: {
			id,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 获取视频点赞、转发、评论数信息
 * @param param
 * @returns
 */
export function getVideoRelativeInfo(param: { vid: string | number }) {
	const { vid } = param;
	return anfrageWithLoading({
		url: '/video/detail/info',
		params: {
			vid,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 获取视频评论数
 * @param param
 *      - id 视频id
 *      - limit 取出评论数，默认20
 *      - offset 第几页
 *      - before 当获取数据超过5000条时需要用到。值为上一页最后一项的time，以得到下一页数据
 * @returns
 */
export function getVideoComments(param: {
	id: string | number;
	limit?: string | number;
	offset?: string | number;
	before?: string | number;
}) {
	const { id, limit = 20, offset = 0, before } = param;
	return anfrageWithLoading({
		url: '/comment/video',
		params: {
			id,
			limit,
			offset: +offset * +limit,
			before,
			timestamp: new Date().valueOf(),
		},
	});
}

/**
 * 获取视频播放源
 * @param param
 * @returns
 */
export function getVideoPlaybackSource(param: { id: string | number }) {
	const { id } = param;
	return anfrageWithLoading({
		url: '/video/url',
		params: {
			id,
		},
	});
}

/**
 * 获取点赞过的视频
 */
export function getPraisedVideos() {
	return anfrageWithLoading({
		url: '/playlist/mylike',
		params: {
			timestamp: new Date().valueOf(),
		},
	});
}
