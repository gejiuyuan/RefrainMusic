import { anfrageWithLoading } from "@/request";
import { SubscriberList } from "@/types/songlist";
import { filterUselessKey } from "@utils/index";

/**
 * 歌单分类
 */
export function playlistCate() {
  return anfrageWithLoading({
    url: "/playlist/catlist",
    method: "get",
    params: {
      // timestamp: new Date().valueOf()
    },
  })
}

/**
 * 热门歌单分类
 */
export function hotPlaylistCate() {
  return anfrageWithLoading({
    url: "/playlist/hot",
    method: "get",
    params: {
      // timestamp: new Date().valueOf()
    },
  })
}

/**
 * 歌单 ( 网友精选碟 )
 * - order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * - cat:cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",
 *            可从歌单分类接口获取(/playlist/catlist)
 * - limit: 取出歌单数量 , 默认为 50
 * - offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 */
export function topPlaylist(params: {
  order?: string;
  cat?: string;
  limit?: number;
  offset?: number;
}) {
  const { limit = 50, offset = 0, order, cat } = params;
  return anfrageWithLoading({
    url: "/top/playlist",
    method: "get",
    params: filterUselessKey({
      limit,
      offset: offset * limit,
      order,
      cat,
    }),
  });
}

/**
 * 精品歌单标签列表
 */
export function highqualPlaylistTag() {
  return anfrageWithLoading({
    url: "/playlist/highquality/tags",
    method: "get",
    params: {
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 获取精品歌单
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",
 *        可从精品歌单标签列表接口获取(/playlist/highquality/tags)
 * - limit: 取出歌单数量 , 默认为 20
 * - before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 */
export function highqualPlaylist(params: {
  cat?: string;
  limit?: number;
  before?: number;
}) {
  return anfrageWithLoading({
    url: "/top/playlist/highquality",
    method: "get",
    params: filterUselessKey(params),
  });
}

/**
 * 相关歌单推荐
 *  - id 歌单id
 */
export function relatedPlaylist(params: { id: number | string }) {
  return anfrageWithLoading({
    url: "/related/playlist",
    method: "get",
    params: filterUselessKey(params),
  })
}

/**
 * 获取歌单详情
 *  - id 歌单id
 *  - s 歌单最近的 s 个收藏者,默认为8。实测最大返回19条数据
 *  说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id,
 *      可以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，但是返回的trackIds是完整的，
 *      tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口获取所有歌曲的详情
 *      (https://github.com/Binaryify/NeteaseCloudMusicApi/issues/452)
 */
export function playlistDetail(params: {
  id: number | string;
  s?: string | number;
}) {
  return anfrageWithLoading({
    url: "/playlist/detail",
    method: "get",
    params: {
      ...filterUselessKey(params),
      timestamp: new Date().valueOf(),
    },
  })
}

/**
 * 歌单详情动态
 *  - id 歌单id
 *  说明 : 调用后可获取歌单详情动态部分,如评论数,是否收藏,播放数
 */
export function playlistDetailDynamic(params: { id: number | string }) {
  return anfrageWithLoading({
    url: "/playlist/detail/dynamic",
    method: "get",
    params: {
      ...filterUselessKey(params),
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 专辑评论
 *  - id 专辑id
 *  说明 : 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该专辑的所有评论 ( 不需要 登录 )
 *
 */
export function albumComment(params: {
  id: number | string;
  limit?: number | string;
  offset?: number | string;
  before?: number | string;
}) {
  const { limit = 20, offset = 0, before, id } = params;
  return anfrageWithLoading({
    url: "/comment/album",
    method: "get",
    params: filterUselessKey({
      limit,
      offset: +offset * +limit,
      before,
      id,
      timestamp: new Date().valueOf(),
    }),
  });
}

/**
 * 歌单评论
 *  - id 歌单 id
 *  说明 : 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该歌单的所有评论 ( 不需要 登录 )
 *
 */
export function playlistComment(params: {
  id: number | string;
  limit?: number | string;
  offset?: number | string;
  before?: number | string;
}) {
  const { limit = 20, offset = 0, before, id } = params;
  return anfrageWithLoading({
    url: "/comment/playlist",
    method: "get",
    params: filterUselessKey({
      limit,
      offset: +offset * +limit,
      before,
      id,
      timestamp: new Date().valueOf(),
    }),
  });
}

/**
 * 专辑内容
 */
export function albumDetail(params: { id: number | string }) {
  return anfrageWithLoading({
    url: "/album",
    method: "get",
    params,
  });
}

/**
 * 专辑动态信息
 */
export function albumDynamicInfo(params: { id: number | string }) {
  return anfrageWithLoading({
    url: "/album/detail/dynamic",
    method: "get",
    params: {
      ...params,
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 收藏/取消收藏专辑
 */
export function albumSubscribe(params: {
  id: number | string;
  sure: boolean;
}) {
  const { id, sure } = params;
  return anfrageWithLoading({
    url: "/album/sub",
    method: "post",
    params: {
      id,
      t: sure ? 1 : -1,
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 获取相似歌单
 */
export function playlistSimilar(params: { id: number | string }) {
  return anfrageWithLoading({
    url: "/simi/playlist",
    method: "get",
    params,
  })
}

/**
 * 获取每日推荐歌单
 */
export function playlistRecommend() {
  return anfrageWithLoading({
    url: "/recommend/resource",
    method: "get",
  })
}

/**
 * 新碟上架
 */
export function newAlbumPutOn(params: {
  limit?: number | string;
  offset?: number | string;
  area?: number | string;
  type?: number | string;
  year?: number | string;
  month?: number | string;
}) {
  const { limit = 50, offset = 0, area = "ALL", type = 'new', year, month } = params;
  return anfrageWithLoading({
    url: "/top/album",
    method: "get",
    params: filterUselessKey({
      // limit,
      // offset: +offset * +limit,
      area,
      type,
      year,
      month,
      timestamp: new Date().valueOf(),
    }),
  })
}

/**
 * 全部新碟
 */
export function newAlbum(params: {
  limit?: number | string;
  offset?: number | string;
  area?: number | string;
}) {
  const { limit = 30, offset = 0, area } = params;
  return anfrageWithLoading({
    url: "/album/new",
    method: "get",
    params: filterUselessKey({
      limit,
      offset: +offset * +limit,
      area,
      timestamp: new Date().valueOf(),
    }),
  });
}

/**
 * 最新专辑
 */
export function newestAlbum() {
  return anfrageWithLoading({
    url: "/album/newest",
    method: "get",
    params: {
      timestamp: new Date().valueOf(),
    },
  });
}

/**
 * 推荐歌单（没登录时）
 */
export function recommendSonglist(params: { limit?: number | string }) {
  return anfrageWithLoading({
    url: "/personalized",
    method: "get",
    params: filterUselessKey(params),
  })
}

/**
 * 歌单收藏者
 */
export function PlaylistSubscribe(params: {
  id: number | string;
  limit?: number | string;
  offset?: number | string;
}) {
  const { limit = 20, id, offset = 0 } = params;
  return anfrageWithLoading({
    url: "/playlist/subscribers",
    method: "get",
    params: {
      id,
      limit,
      offset: +limit * +offset,
      timestamp: new Date().valueOf(),
    },
  });
}
