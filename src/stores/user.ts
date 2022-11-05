/** @format */

import { loginStatus, logout } from '@/api/auth';
import { userAccount } from '@/api/user';
import { LoginWithPhoneResult, UserSubCount } from '@/types/auth';
import { EMPTY_OBJ, is, UNICODE_CHAR } from '@/utils';
import { loginCookie } from '@/utils/auth';
import { messageBus } from '@/utils/event/register';
import { defineStore } from 'pinia';
import { nextTick } from 'vue';

export type UserStateType = {
	cookie: string;
	userId: string | number;
	subCount: UserSubCount;
	detail: any;
	// 是否已登录
	isLogin: boolean;
	// 是否显示登录对话框
	showLoginDialog?: boolean;
	//我喜欢的音乐ids
	myLoveListIds: number[];
	playlist: {
		myCreated: any[];
		myCollection: any[];
	};
};

const useUserStore = defineStore({
	id: 'userStore',
	state() {
		const userState: UserStateType = {
			cookie: '',
			userId: '',
			detail: {
				profile: {},
			} as any,
			subCount: {} as any,
			myLoveListIds: [],
			isLogin: false,
			showLoginDialog: false,
			playlist: {
				myCreated: [],
				myCollection: [],
			},
		};
		return userState;
	},
	getters: {},
	actions: {
		async judgeAndSetAccountInfo(
			options: {
				isFirstRefresh?: boolean;
			} = EMPTY_OBJ,
		) {
			const { isFirstRefresh = false } = options;
			await userAccount().then(({ account, profile }) => {
				let topic: string;
				let tip: string;
				if (!account || !profile) {
					if (isFirstRefresh) {
						topic = 'warnMessage';
						tip = `阿娜达~快去登录噢~${UNICODE_CHAR.hugface}`;
					} else {
						topic = 'errorMessage';
						tip = `阿娜达~登录失败啦，再试一次⑧~${UNICODE_CHAR.pensive}`;
					}
				} else {
					this.userId = account.id;
					this.isLogin = true;
					topic = 'successMessage';
					tip = `阿娜达~登录成功啦~${UNICODE_CHAR.smile}`;
				}
				if (!isFirstRefresh) {
					messageBus.dispatch(topic, tip, {
						duration: 4000,
					});
				}
			});
		},
		async logOut() {
			const res = await logout();
			if (res.code === 200) {
				loginCookie.remove();
				this.isLogin = false;
				messageBus.dispatch(
					'successMessage',
					`账号已退出，快重新登录⑧ ${UNICODE_CHAR.smile}`,
				);
				await nextTick();
				this.showLoginDialog = true;
				return true;
			}
		},
	},
});

export default useUserStore;
