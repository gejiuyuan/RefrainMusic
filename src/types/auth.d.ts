/** @format */

export type LoginWithPhoneResult = {
	account: {
		createTime: number;
		id: number;
		userName: string;
		vipType: number;
		anonimousUser: boolean;
	};
	bindings: Array<{
		bindingTime: number;
		expired: boolean;
		expiresIn: number;
		id: number;
		refreshTime: number;
		tokenJsonStr: string;
		type: number;
		url: string;
		uerId: number;
	}>;
	cookie: string;
	token: string;
	loginType: number;
	profile: {
		avatarUrl: string;
		authStatus: number;
		//已认证
		authenticated: boolean;
		authority: number;
		backgroundUrl: string;
		birthday: number;
		city: number;
		description: string;
		detailDescription: string;
		eventCount: number;
		expertTags: null | any;
		experts: PlainObject;
		mutual: boolean;
		follows: number;
		followeds: number;
		followed: boolean;
		nickname: string;
		playlistCount: number;
		province: number;
		remarkName: string;
		signature: string;
		userId: number;
		vipType: number;
		userType: number;
		playlistBeSubscribedCount: number;
	};
};

export type UserSubCount = {
	artistCount: number;
	createDjRadioCount: number;
	createdPlaylistCount: number;
	djRadioCount: number;
	mvCount: number;
	newProgramCount: number;
	programCount: number;
	subPlaylistCount: number;
};
