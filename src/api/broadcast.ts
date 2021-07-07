import { anfrage } from "@/request";
import { filterUselessKey } from "@utils/index";

/**
 * 推荐电台
 * @param params
 * @returns
 */

export function djRecomment() {
  return anfrage({
    url: "/personalized/djprogram",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 电台fm Banner
 * @param params
 * @returns
 */

export function djBanner() {
  return anfrage({
    url: "/dj/banner",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 电台个性推荐
 * @param params
 * @returns
 */

export function djPersonalRecommend(params: { limit?: number | string }) {
  return anfrage({
    url: "/dj/personalize/recommend",
    method: "get",
    params: {
      ...filterUselessKey(params),
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 热门电台
 * @param params
 * @returns
 */

export function djHot(params: {
  limit?: number | string;
  offset?: number | string;
}) {
  const { limit = 30, offset = 0 } = params;
  return anfrage({
    url: "/dj/hot",
    method: "get",
    params: {
      limit,
      offset: +offset * +limit,
    },
  });
}

/**
 * 电台 - 节目榜
 * @param params
 * @returns
 */

export function djProgramTopList(params: {
  limit?: number | string;
  offset?: number | string;
}) {
  const { limit = 100, offset = 0 } = params;
  return anfrage({
    url: "/dj/program/toplist",
    method: "get",
    params: {
      limit,
      offset: +offset * +limit,
    },
  });
}

/**
 * 电台 - 24小时节目榜
 * @param params
 * @returns
 */

export function djProgramTopListDay(params: { limit?: number | string }) {
  const { limit = 100 } = params;
  return anfrage({
    url: "/dj/program/toplist/hours",
    method: "get",
    params: {
      limit,
    },
  });
}

/**
 * 电台 - 新晋电台榜/热门电台榜
 * @param params
 * @returns
 */

export function djHotOrNewTopList(params: {
  limit?: number | string;
  offset?: number | string;
  type?: number | string;
}) {
  const { limit = 100, offset = 0, type } = params;

  return anfrage({
    url: "/dj/toplist",
    method: "get",
    params: filterUselessKey({
      type,
      limit,
      offset: +limit * +offset,
    }),
  });
}

/**
 * 电台 - 类别热门电台
 * @param params
 * @returns
 */

export function djCateHot(params: {
  limit?: number | string;
  offset?: number | string;
  cateId?: string | number;
}) {
  const { limit = 30, offset = 0, cateId } = params;
  return anfrage({
    url: "/dj/radio/hot",
    method: "get",
    params: filterUselessKey({
      cateId,
      limit,
      offset: +limit * +offset,
    }),
  });
}

/**
 * 电台推荐 （登录后）
 */

export function djRecommend() {
  return anfrage({
    url: "/dj/recommend",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 电台 - 分类
 */

export function djCateList() {
  return anfrage({
    url: "/dj/catelist",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 电台 - 分类推荐
 */

export function djRecommenCate(params: { type: number | string }) {
  const { type } = params;
  return anfrage({
    url: "/dj/recommend/type",
    method: "get",
    params: {
      type,
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 电台 - 订阅
 */

export function djSubscribe(params: { rid: number | string }) {
  const { rid } = params;
  return anfrage({
    url: "/dj/sub",
    method: "get",
    params: {
      rid,
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 电台 - 订阅列表
 */

export function djSubList() {
  return anfrage({
    url: "/dj/sublist",
    method: "get",
  });
}

/**
 * 电台 - 详情
 */

export function djDetail(params: { rid: number | string }) {
  return anfrage({
    url: "/dj/detail",
    method: "get",
    params,
  });
}

/**
 * 电台 - 非热门类型
 */

export function djCateExcludehot() {
  return anfrage({
    url: "/dj/category/excludehot",
    method: "get",
  });
}

/**
 * 电台 - 推荐类型
 */

export function djCateRecommend() {
  return anfrage({
    url: "/dj/category/recommend",
    method: "get",
  });
}

/**
 * 电台 - 今日优选
 */

export function djTodayPrefer() {
  return anfrage({
    url: "/dj/today/perfered",
    method: "get",
    params: {
      timeStamp: new Date().valueOf(),
    },
  });
}

/**
 * 电台 - 节目
 */

export function djProgram(params: {
  rid: number | string;
  limit?: number | string;
  offset?: number | string;
  asc?: boolean;
}) {
  const { rid, limit = 30, offset = 0, asc } = params;
  return anfrage({
    url: "/dj/program",
    method: "get",
    params: filterUselessKey({
      rid,
      limit,
      offset: +offset * +limit,
      asc,
    }),
  });
}

/**
 * 电台 - 节目详情
 */

export function djProgramDetail(params: { id: number | string }) {
  return anfrage({
    url: "/dj/program/detail",
    method: "get",
    params,
  });
}
