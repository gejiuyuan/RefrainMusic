import { anfrage } from "@/request";
import { filterUselessKey } from "@utils/index";

/**
 * 搜索
 * @param params
 * @param type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑,
 *  100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
 * @returns
 */

export function searchCloud(params: {
  keywords: string;
  limit?: number | string;
  offset?: number | string;
  type?: number | string;
}) {
  let { keywords, limit, offset, type = 1 } = params;
  limit && offset && (offset = +limit * +offset);
  return anfrage({
    url: "/cloudsearch",
    method: "get",
    params: filterUselessKey({
      keywords,
      limit,
      type,
      offset,
    }),
  });
}

/**
 * 默认搜索关键词
 */

export function searchDefault() {
  return anfrage({
    url: "/search/default",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 热搜列表（简略）
 */

export function hotSearch() {
  return anfrage({
    url: "/search/hot",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 热搜列表（详细）
 */

export function hotSearchDetail() {
  return anfrage({
    url: "/search/hot/detail",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 搜索建议
 */

export function searchSuggest(params: { keywords: string; type?: string }) {
  return anfrage({
    url: "/search/suggest",
    method: "get",
    params: {
      ...filterUselessKey(params),
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 搜索多重匹配
 */

export function searchMulMatch(params: { keywords: string }) {
  return anfrage({
    url: "/search/multimatch",
    method: "get",
    params: {
      ...filterUselessKey(params),
      timeStamp: new Date().valueOf(),
    },
  });
}
