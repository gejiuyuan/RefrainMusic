import { anfrageWithLoading } from "@/request";
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
  const { keywords, limit = 30, offset = 0, type = 1 } = params;
  return anfrageWithLoading({
    url: "/cloudsearch",
    method: "get",
    params: filterUselessKey({
      keywords,
      limit,
      type,
      offset: +limit * +offset,
    }),
  });
}

/**
 * 默认搜索关键词
 */
export function searchDefault() {
  return anfrageWithLoading({
    url: "/search/default",
    method: "get",
    params: {
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 热搜列表（简略）
 */
export function hotSearch() {
  return anfrageWithLoading({
    url: "/search/hot",
    method: "get",
    params: {
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 热搜列表（详细）
 */
export function hotSearchDetail() {
  return anfrageWithLoading({
    url: "/search/hot/detail",
    method: "get",
    params: {
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 搜索建议
 */
export function searchSuggest(params: { keywords: string; type?: string }) {
  return anfrageWithLoading({
    url: "/search/suggest",
    method: "get",
    params: {
      ...filterUselessKey(params),
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 搜索多重匹配
 */
export function searchMulMatch(params: { keywords: string }) {
  return anfrageWithLoading({
    url: "/search/multimatch",
    method: "get",
    params: {
      ...filterUselessKey(params),
      timestamp: new Date().valueOf(),
    },
  });
}
