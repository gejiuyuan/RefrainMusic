import { loginStatus } from "@/api/auth";
import { LoginWithPhoneResult, UserSubCount } from "@/types/auth";
import { EMPTY_OBJ, is, UNICODE_CHAR } from "@/utils";
import { judgeIsLogin } from "@/utils/auth";
import { messageBus } from "@/utils/event/register";
import { defineStore } from "pinia";

export type UserStateType = {
  cookie: string;
  subCount: UserSubCount;
  detail: any;
  isLogin: boolean;
  //我喜欢的音乐ids
  myLoveListIds: number[];
  playlist: {
    myCreated: any[];
    myCollection: any[];
  }
}

const useUserStore = defineStore({
  id: "userStore",
  state() {
    const userState: UserStateType = {
      cookie: '',
      detail: {
        profile: {

        },

      } as any,
      subCount: {} as any,
      myLoveListIds: [],
      isLogin: judgeIsLogin(),
      playlist: {
        myCreated: [],
        myCollection: [],
      }
    };
    return userState;
  },
  getters: {

  },
  actions: {
    async judgeAndUpdateLoginStatus(options: {
      //是否是第一次刷新页面
      isFirstRefresh: boolean
    } = EMPTY_OBJ) {
      const { isFirstRefresh = false } = options;
      const { data: { profile, account } } = await loginStatus();
      const isLoginSuccess = ![profile, account].every(is.null);
      this.isLogin = isLoginSuccess;
      let topic: string;
      let tip: string;
      if (isLoginSuccess) {
        topic = 'successMessage';
        tip = `阿娜达~登录成功啦~${UNICODE_CHAR.smile}`
      } else if (isFirstRefresh) {
        topic = 'warnMessage';
        tip = `阿娜达~快去登录噢~${UNICODE_CHAR.hugface}`;
      } else {
        topic = 'errorMessage';
        tip = `阿娜达~登录失败啦，再试一次⑧~${UNICODE_CHAR.pensive}`
      }
      messageBus.dispatch(topic, tip, {
        duration: 4000,
      });
    },
  },
});

export default useUserStore;
