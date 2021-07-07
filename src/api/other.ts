import { anfrage } from "@/request";
import { filterUselessKey } from "@utils/index";

/**
 * 新歌速递
 * @param params
 * @returns
 */

export function homepageInfo(params: { refresh?: string }) {
  return anfrage({
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
  return anfrage({
    url: "/banner",
    method: "get",
    params: filterUselessKey(params),
  }).then(({ data }) => data);
}

/**
 * 私人 FM
 * @param params
 * @returns
 */

export function personalFm() {
  return anfrage({
    url: "/personal_fm",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 所有榜单
 */

export function allTopList() {
  return anfrage({
    url: "/toplist",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  }).then(({ data }) => data);
}

/**
 * 所有榜单内容摘要
 */

export function allTopListDetail() {
  return anfrage({
    url: "/toplist/detail",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  }).then(({ data }) => data);
}
