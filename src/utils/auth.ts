import Cookies from 'js-cookie';
import { is, trim } from './common';

export const loginCookie = (() => {
  let loginCookie: string;
  const cookieKey = 'RefrainMusic'
  return {
    get value() {
      if (!loginCookie) {
        const cookie = Cookies.get(cookieKey);
        const MUSIC_C = cookie?.split(/\s*;\s*/).find(v => v.trim().startsWith('MUSIC_U'));
        return loginCookie = !MUSIC_C ? '' : encodeURIComponent(MUSIC_C);
      }
      return loginCookie;
    },
    set value(val: string) {
      if (!is.string(val)) {
        return;
      }
      loginCookie = val;
      if (!val) {
        this.remove();
        return;
      }
      // 给手动保存的登陆cookie设置180天过期
      Cookies.set(cookieKey, val, {
        expires: 180,
      });
    },
    remove() {
      Cookies.remove(cookieKey)
    }
  }
})();
