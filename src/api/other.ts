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
      timestamp: new Date().valueOf(),
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
      timestamp: new Date().valueOf(),
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
      timestamp: new Date().valueOf(),
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
      timestamp: new Date().valueOf(),
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

/**
 * 点赞（MV、电台、视频）
 * @param params 
 *  type:资源类型,对应以下类型：1: mv、4: 电台、5: 视频、6: 动态
 *  t: 操作,1 为点赞,其他未取消点赞 
 *  id: 资源 id
 * @returns 
 * @introduction 
 *  注意：如给动态点赞，不需要传入 id，需要传入 threadId,
 *  可通过 event,/user/event 接口获取，如： /resource/like?t=1&type=6&threadId=A_EV_2_6559519868_32953014
 */
export function praiseResource(params: {
  id: string | number;
  sure: boolean;
  type: 1 | 4 | 5 | 6
}) {
  const { id, sure, type } = params;
  return anfrageWithLoading({
    url: '/resource/like',
    method: 'post',
    params: {
      id,
      type,
      t: sure ? 1 : -1
    }
  });
}