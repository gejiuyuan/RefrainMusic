import { anfrageWithLoading, anfrage } from "@/request";
import { filterUselessKey } from "@utils/index";

/**
 * 新歌速递
 * @param params
 * @returns
 */

export function homepageInfo(params: { refresh?: string }) {
  return anfrageWithLoading({
    url: "/homepage/block/page",
    method: "get",
    params: {
      ...filterUselessKey(params),
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * banner
 * @param params
 * @returns
 */

export function bannerInfo(params: { type?: number | string }) {
  params.type ??= 0;
  return anfrageWithLoading({
    url: "/banner",
    method: "get",
    params: filterUselessKey(params),
  })
}

/**
 * 私人 FM
 * @param params
 * @returns
 */

export function getPersonalFm() {
  return anfrageWithLoading({
    url: "/personal_fm",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  })
}

/**
 * 所有榜单
 */

export function allTopList() {
  return anfrageWithLoading({
    url: "/toplist",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 所有榜单内容摘要
 */

export function allTopListDetail() {
  return anfrageWithLoading({
    url: "/toplist/detail",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  })
}

/**
 * 国家编码列表
 * @returns 
 */
export function getCountryCode() {
  return anfrage({
    url: '/countries/code/list',
  })
}
