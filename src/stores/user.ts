import { LoginWithPhoneResult, UserSubCount } from "@/types/auth";
import { defineStore } from "pinia";

export const getUserToken = (() => {
  let userToken = ''
  return () => {
    if(!userToken) {
      const stroageToken = localStorage.getItem('userToken');
      stroageToken && (userToken = stroageToken); 
    }
    return userToken;
  }

})();
export type UserStateType = {
  token: string;
  cookie: string;
  subCount: UserSubCount;
  detail: any;
}

const useUserStore = defineStore({
  id: "userStore",
  state() {
    const userState:UserStateType = { 
      token: getUserToken(),
      cookie: '',
      detail: {
        profile: {

        },
        
      } as any,
      subCount: {} as any,
    };
    return userState;
  },
  getters: {
    isLogin(state:UserStateType) {
      return !!state.token
    }
  },
  actions: {
    setUserInfo(info: LoginWithPhoneResult) {
      const { profile, token , cookie ,account } = info;
      this.token = token;
      this.cookie = cookie;
      localStorage.setItem('userToken', token);
    }
  },
});

export default useUserStore;
