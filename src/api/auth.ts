import { anfrage } from "@/request";
import { filterUselessKey } from "@utils/index";

/**
 * 手机登录
 * - phone: 手机号码
 * - password: 密码
 * - countrycode: 国家码，用于国外手机号登录，例如美国传入：1
 * - md5_password: md5加密后的密码,传入后 password 将失效
 * @param {Object} params
 * @param {string} params.phone
 * @param {string} params.password
 * @param {string=} params.countrycode
 * @param {string=} params.md5_password
 */

export const loginWithPhone = (params: {
  phone: string;
  password: string;
  countrycode?: string;
  md5_password?: string;
}) => {
  anfrage({
    url: "/login/cellphone",
    method: "post",
    params: filterUselessKey(params),
  });
};

/**
 * 邮箱登录
 * - email: 163 网易邮箱
 * - password: 密码
 * - md5_password: md5加密后的密码,传入后 password 将失效
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {string=} params.md5_password
 */

export function loginWithEmail(params: {
  email: string;
  password: string;
  md5_password?: string;
}) {
  return anfrage({
    url: "/login",
    method: "post",
    params: filterUselessKey(params),
  });
}

/**
 * 刷新登录
 * 说明 : 调用此接口 , 可刷新登录状态
 * - 调用例子 : /login/refresh
 */

export function refreshCookie() {
  return anfrage({
    url: "/login/refresh",
    method: "post",
  });
}

/**
 * 退出登录
 * 说明 : 调用此接口 , 可退出登录
 */

export function logout() {
  return anfrage({
    url: "/logout",
    method: "post",
  });
}

/**
 * 登录状态
 */

export function loginStatus() {
  return anfrage({
    url: "/login/status",
    method: "post",
  });
}
