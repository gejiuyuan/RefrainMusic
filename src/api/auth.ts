import { anfrage, anfrageWithLoading } from "@/request";
import { filterUselessKey, generateFormData } from "@utils/index";

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
  return anfrageWithLoading({
    url: "/login/cellphone",
    method: "post",
    params: {
      ...params,
      timestamp: new Date().valueOf(),
    },
  })
};

/**
 * 网易云邮箱登录
 * - email: 163 网易邮箱
 * - password: 密码
 * - md5_password: md5加密后的密码,传入后 password 将失效
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} params.md5_password
 */

export function loginWithEmail(params: {
  email: string;
  password: string;
  md5_password?: string;
}) {
  return anfrageWithLoading({
    url: "/login",
    method: "post",
    params: {
      ...params,
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 刷新登录
 * 说明 : 调用此接口 , 可刷新登录状态
 * - 调用例子 : /login/refresh
 */

export function refreshCookie() {
  return anfrageWithLoading({
    url: "/login/refresh",
    method: "post",
  });
}

/**
 * 退出登录
 * 说明 : 调用此接口 , 可退出登录
 */

export function logout() {
  return anfrageWithLoading({
    url: "/logout",
    method: "post",
  });
}

/**
 * 登录状态
 */

export function loginStatus() {
  return anfrageWithLoading({
    url: "/login/status",
    params: {
      timestamp: new Date().valueOf(),
    }
  });
}

/**
 * 获取用户等级信息
 * @returns 
 * @introduction
 *    说明 : 登录后调用此接口 , 可以获取用户等级信息,
 *        包含当前登录天数,听歌次数,下一等级需要的登录天数和听歌次数,当前等级进度,
 *        对应 https://music.163.com/#/user/level
 */
export function getMyLevelInfo() {
  return anfrageWithLoading({
    url: "/user/level",
  })
}

/**
 * 二维码key生成接口
 * @returns 
 */
export function getQrCodeKey() {
  return anfrage({
    url: '/login/qr/key',
    params: {
      timestamp: new Date().valueOf(),
    }
  })
}

/**
 * 获取登录二维码图片
 * @param params 
 * @returns 
 */
export function getQrCodeImgInfo(params: {
  key: string;
  qrimg?: boolean;
}) {
  const { key, qrimg = true } = params;
  return anfrageWithLoading({
    url: '/login/qr/create',
    params: {
      key,
      qrimg,
      timestamp: new Date().valueOf(),
    }
  })
}

/**
 * 检测二维码扫码状态
 * @param params 
 * @returns 
 * @introduction
 *  轮询此接口可获取二维码扫码状态,800为二维码过期,801为等待扫码,802为待确认,803为授权登录成功(803状态码下会返回cookies)
 */
export function getQrCodeScanStatus(params: {
  key: string;
}) {
  return anfrage({
    url: '/login/qr/check',
    params: {
      ...params,
      timestamp: new Date().valueOf(),
    }
  })
}