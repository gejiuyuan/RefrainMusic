/** @format */

export enum CommentType {
	// 歌曲
	music,
	// mv
	mv,
	// 歌单
	songlist,
	// 专辑
	album,
	// 电台
	radio,
	// 视频
	video,
	// 动态
	dynamic,
}

/**
 * 歌曲费用
 *  0: 免费或无版权
 *  1: VIP 歌曲
 *  4: 购买专辑
 *  8: 非会员可免费播放低音质，会员可播放高音质及下载
 *
 * @export
 * @enum {number}
 *
 * fee 为 1 或 8 的歌曲均可单独购买 2 元单曲
 */
export enum SongFee {
	freeOrNoCopyright = 0,
	vip = 1,
	buyCD = 4,
	weakness = 8,
}

/**
 * 歌曲所属属性
 *
 * @export
 * @enum {number}
 */
export enum OriginCoverType {
	// 未知
	unkown,
	// 原曲
	origin,
	// 翻唱
	cover,
}
