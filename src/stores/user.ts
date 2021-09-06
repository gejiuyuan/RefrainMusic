import { loginStatus } from "@/api/auth";
import { LoginWithPhoneResult, UserSubCount } from "@/types/auth";
import { is } from "@/utils";
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
    async judgeLoginStatus() {
      const { data: { profile, account } } = await loginStatus();
      const isLoginSuccess = ![profile, account].every(is.null);
      this.updateLoginStatus(isLoginSuccess);
    },
    updateLoginStatus(isLogin: boolean) {
      this.isLogin = isLogin;
      const topic = isLogin ? 'successMessage' : 'errorMessage';
      const tip = isLogin ? '阿娜达~登录成功了哟~' : '阿娜达~登录失败了哟，请再试一次！'
      messageBus.dispatch(topic, tip, {
        duration: 4000,
      });
    }
  },
});

export default useUserStore;
