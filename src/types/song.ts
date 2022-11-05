/** @format */

import { OriginCoverType, SongFee } from '@/dependency/enum';
import { SongCommentUser } from './user';

export declare type SongChargeInfo = {
	rate: 128000 | 192000 | 32000 | 999000 | number;
	chargeUrl: string | null;
};

export declare type PlayRecord = {
	playCount: number;
	score: number;
	song: SongInfo;
}[];

export declare type SongInfo = {
	//歌曲id
	id: number;
	//歌曲名字
	name: string;
	//歌曲别名，如xxx游戏宣传曲
	alia: string[];
	//单曲时长，单位：毫秒
	dt: number;
	// 小数，常取[0.0, 100.0]中离散的几个数值, 表示歌曲热度
	pop: number;
	//歌手信息
	ar: {
		id: number;
		name: string;
		alias?: string[];
	}[];
	// album专辑
	al: {
		id: number;
		name: string;
		picUrl: string;
	};
	//也许没有喜欢
	starred?: boolean;
	// 费用
	fee: SongFee;
	//评论数量
	mark: number;
	// 歌曲发布时间
	publishTime: number;
	originCoverType: OriginCoverType;
	privilege: {
		id: number;
		chargeInfoList: SongChargeInfo[];
	};
} & MediaQualityCategory;

/**
 * 最新音乐
 */
export declare type NewestSongInfo = {
	bMusic: {
		bitrate: number;
		extension: string;
		id: number;
		playTime: number;
		size: number;
		sr: number;
		name: null | string;
	};
	artists: {
		id: number;
		alias: string[];
		name: string;
		musicSize: number;
		albumSize: number;
		picUrl: string;
		brifDesc: string;
		followed: boolean;
		trans: string;
	}[];
	alias: string[];
	duration: number;
	id: number;
	fee: SongFee;
	name: string;
	mvid: number;
	no: number;
	playedNum: number;
	popularity: number;
	singer: string;
	starred: boolean;
	starredNum: number;
	mp3Url: string;

	album: {
		alias: string[];
		picUrl: string;
		blurPicUrl: string;
		description: string;
		artist: {
			img1v1Id: number;
			topicPerson: number;
			followed: boolean;
			musicSize: number;
			alias: string[];
		};
		artists: NewestSongInfo['album']['artist'][];
		briefDesc: string;
		company: string;
		companyId: number;
		copyrightId: number;
		id: number;
		name: string;
		onSale: boolean;
		paid: boolean;
		publishTime: number;
		size: number;
		songs: any[];
		status: number;
		subType: string;
		tags: string;
		type: string;
	};
};

export declare type SongUrlInfo = {
	type: 'mp3' | 'm4a';
	encodeType: 'mp3';
	canExtend: boolean;
	fee: SongFee;
	url: string;
	size: number;
	id: number;
	md5: string;
	gain: 0 | number;
	level: 'standard' | string;
	played: 0 | 1;
	//免费试听时间段，单位：秒
	freeTrialInfo: {
		start: number;
		end: number;
	} | null;
};

export declare type SongCommentItem = {
	commentId: string;
	content: string;
	time: number;
	timeStr: string;
	needDisplayTime: boolean;
	likedCount: number;
	liked: boolean;
	user: SongCommentUser;
	beReplied: Array<{
		content: string;
		beRepliedCommentId: number;
		user: SongCommentUser;
	}>;
};

export declare type SongComment = {
	total: number;
	moreHot: boolean;
	more: boolean;
	userId: number;
	isMusician: boolean;
	commentBanner: null | any;
	comments: Array<SongCommentItem>;
	hotComments: Array<SongCommentItem>;
	topComments: Array<SongCommentItem>;
};

/**
 * getMusicDetail api 返回值
 */
export declare type SongsDetail = {
	privileges: SongInfo['privilege'][];
	songs: Exclude<SongInfo, 'privilege'>[];
};

/**
 * 媒体资源文件质量信息
 */
export type MediaQuality = {
	br: number;
	fid: number;
	size: number;
	vd: number;
};

/**
 * 媒体资源文件质量信息（高、中、低）
 */
export type MediaQualityCategory = Record<'h' | 'm' | 'l', MediaQuality>;
