/** @format */

export declare type UserProfile = {
	allSubscribedCount: number;
	avatarUrl: string;
	backgroundUrl: string;
	birthday: number;
	blacklist: boolean;
	createTime: number;
	city: number;
	description: string;
	detailDescription: string;
	followMe: boolean;
	followTime: null | number | string;
	followeds: number; //粉丝数
	newFollows: number; //新关注数
	follows: number; //关注数
	gender: number; //性别
	mutual: boolean; //是否互相关注
	nickname?: string;
	playlistBeSubscribedCount: number;
	playlistCount: number;
	province: number;
	userId: number;
	remarkName: null | string;
	signature: string;
	eventCount: number; //动态
	userType: number;
	vipType: number; // 11表示vip、0表示普通用户
};

export declare type UserDetail = {
	adValid: boolean;
	bindings: {
		expired: boolean;
		type: number;
		userId: number;
		url: string;
		bindingTime: number;
		id: number;
		refreshTime: number;
	}[];
	// 认证
	identify?: {
		actionUrl: string;
		imageDesc: string;
		imageUrl: string;
	};
	createDays: number;
	createTime: number;
	level: number; //等级
	listenSongs: number;
	mobileSign?: boolean;
	pcSign?: boolean;
	peopleCanSeeMyPlayRecord: boolean; //播放记录是否可见
	profile: Partial<UserProfile>;
	//积分
	userPoint?: {
		balance: number;
		blockBalance: number;
		updateTime: number;
		userId: number;
		version: number;
		status: number;
	};
};

export declare type SearchUserProfileItem = {
	accountStatus: number;
	anchor: boolean;
	authStatus: number;
	avatarUrl: string;
	backgroundUrl: string;
	birthday: number;
	city: number;
	defaultAvatar: boolean;
	description: string;
	detailDescription: string;
	followed: string;
	followeds: number;
	follows: number;
	//是否互相关注
	mutual: boolean;
	nickname: string;
	playlistBeSubscribedCount: number;
	//歌单数量
	playlistCount: number;
	province: number;
	remarkName: null;
	signature: string;
	userId: number;
	userType: number;
	vipType: number;
};

export declare type SongCommentUser = {
	anonym: number;
	authStatus: number;
	avatarDetail: null | any;
	avatarUrl: string;
	commonIdentity: null | any;
	expertTags: null | any[];
	experts: null | any;
	followed: boolean;
	liveInfo: null | any;
	locationInfo: null | any;
	mutual: boolean;
	nickname: string;
	remarkName: null | any;
	userId: number;
	userType: number;
	vipRights: null | any;
	vipType: number;
};
