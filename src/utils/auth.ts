import Cookies from 'js-cookie';
import { is } from './common';

export const judgeIsLogin = () => {
  const isLogin = !is.undefined(Cookies.get('MUSIC_U'));
  return isLogin;
}