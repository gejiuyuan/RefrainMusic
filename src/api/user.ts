import { anfrage } from "@/request";
import { filterUselessKey } from "@utils/index";

/**
 * 获取用户详情
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户详情
 * - uid : 用户 id
 * @param {number} uid
 */

export function userDetail(uid: string | number) {
  return anfrage({
    url: "/user/detail",
    method: "get",
    params: {
      uid,
    },
  }).then(({ data }) => data);
}

/**
 * 获取账号信息
 * 说明 : 登录后调用此接口 ,可获取用户账号信息
 */
export function userAccount() {
  return anfrage({
    url: "/user/account",
    method: "get",
    params: {
      timestamp: new Date().valueOf(),
    },
  }).then(({ data }) => data);
}

/**
 * 获取用户信息 , 歌单，收藏，mv, dj 数量
 */
export function userSubcount() {
  return anfrage({
    url: "/user/subcount",
    method: "get",
    params: {
      timestamp: new Date().valueOf(),
    },
  }).then(({ data }) => data);
}

/**
 * 获取用户绑定信息
 *  - uid : 用户 id
 * @param {number} uid
 */
export function userBinding(uid: string | number) {
  return anfrage({
    url: "/user/binding",
    method: "get",
    params: {
      uid,
      timestamp: new Date().valueOf(),
    },
  }).then(({ data }) => data);
}

/**
 * 获取用户歌单
 *  - uid : 用户 id
 *  - limit : 返回数量 , 默认为 30
 *  - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param {number} uid
 * @param {number} limit
 * @param {number} offset
 */
export function userPlaylist(params: {
  uid: string | number;
  limit?: string | number;
  offset?: string | number;
}) {
  const { uid, limit = 30, offset = 0 } = params;
  return anfrage({
    url: "/user/playlist",
    method: "get",
    params: filterUselessKey({
      uid,
      limit,
      offset: +limit * +offset,
    }),
  }).then(({ data }) => data);
}

/**
 * 获取用户电台
 *  - uid : 用户 id
 * @param {number} uid
 */
export function userDj(uid: string | number) {
  return anfrage({
    url: "/user/dj",
    method: "get",
    params: {
      uid,
    },
  }).then(({ data }) => data);
}

/**
 * 获取用户关注列表
 *  - uid : 用户 id
 *  - limit : 返回数量 , 默认为 30
 *  - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param {number} uid
 * @param {number} limit
 * @param {number} offset
 */
export function userFollows(params: {
  uid: string | number;
  limit?: string | number;
  offset?: string | number;
}) {
  const { uid, limit = 30, offset = 0 } = params;
  return anfrage({
    url: "/user/follows",
    method: "get",
    params: filterUselessKey({
      uid,
      limit,
      offset: +limit * +offset,
    }),
  });
}

/**
 * 获取用户粉丝列表
 *  - uid : 用户 id
 *  - limit : 返回数量 , 默认为 30
 *  - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param {number} uid
 * @param {number} limit
 * @param {number} offset
 */
export function userFans(params: {
  uid: string | number;
  limit?: string | number;
  offset?: string | number;
}) {
  const { uid, limit = 30, offset = 0 } = params;
  return anfrage({
    url: "/user/followeds",
    method: "get",
    params: filterUselessKey({
      uid,
      limit,
      offset: +limit * +offset,
    }),
  });
}

/**
 * 关注/取消关注用户
 *  - id : 目标用户 id
 *  - t : 1为关注,其他为取消关注
 * @param {number} id
 * @param {number} t
 */
export function unOrFocusUser(params: { id: string | number; t: number }) {
  return anfrage({
    url: "/follow",
    method: "post",
    params,
  });
}

/**
 * 获取用户播放记录
 *  - uid : 用户 id
 *  - type : type=1 时只返回 weekData, type=0 时返回 allData
 * @param {number} uid
 * @param {number} type
 */
export function userRecord(params: { uid: string | number; type?: 0 | 1 }) {
  params.type ??= 1;
  return anfrage({
    url: "/user/record",
    method: "post",
    params: {
      ...filterUselessKey(params),
      timestamp: new Date().valueOf(),
    },
  }).then(({ data }) => data);
}

/**
 * 收藏的歌手列表
 *
 */

export function userLoveArtist() {
  return anfrage({
    url: "/artist/sublist",
    method: "get",
    params: {
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 收藏视频
 *  - id 视频id
 *  - t 1为收藏，其他为取消收藏
 *
 */

export function userVideoCollect(params: Record<"id" | "t", number>) {
  return anfrage({
    url: "/video/sub",
    method: "post",
    params,
  });
}

/**
 * 收藏/取消收藏 MV
 *  - mvid mv的id
 *  - t 1为收藏，其他为取消收藏
 *
 */

export function userMvCollect(params: Record<"mvid" | "t", number>) {
  return anfrage({
    url: "/mv/sub",
    method: "post",
    params: filterUselessKey(params),
  });
}

/**
 * 收藏的 MV 列表
 *
 */

export function userCollectedMv(params: Record<"mvid" | "t", number>) {
  return anfrage({
    url: "/mv/sublist",
    method: "get",
    params: filterUselessKey(params),
  });
}

/**
 * 喜欢音乐列表
 *
 */

export function userLikeList(params: { uid: number | string }) {
  return anfrage({
    url: "/likelist",
    method: "get",
    params: {
      ...params,
      timeStamp: new Date().valueOf(),
    },
  }).then(({ data }) => data);
}

/**
 * 喜欢音乐
 * @returns 
 */
export function userLikeMusic(params: {
  id: string | number,
  like: boolean,
}) {
  return anfrage({
    url: '/like',
    method: "post",
    params: filterUselessKey(params)
  }).then(({ data }) => data)
}

/**
 * 用户设置
 *
 */

export function userLSetting() {
  return anfrage({
    url: "/setting",
    method: "get",
  }).then(({ data }) => data);
}
