import { loginStatus } from "@/api/auth";
import { LoginWithPhoneResult, UserSubCount } from "@/types/auth";
import { judgeIsLogin } from "@/utils/auth";
import { defineStore } from "pinia";

export type UserStateType = {
  cookie: string;
  subCount: UserSubCount;
  detail: any;
  isLogin: boolean;
  //我喜欢的音乐ids
  myLoveListIds: number[],
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
    };
    return userState;
  },
  getters: {

  },
  actions: {
    setUserInfo(info: LoginWithPhoneResult) {
      const { profile, token, cookie, account } = info;
      this.isLogin = true;
      this.cookie = cookie;
      localStorage.setItem('userToken', token);
    }
  },
});

export default useUserStore;
