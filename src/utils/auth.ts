import Cookies from 'js-cookie';
 
export const judgeIsLogin = () => Cookies.get('MUSIC_U') !== void 0;