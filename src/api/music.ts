import { anfrage } from "@/request";
import { filterUselessKey } from "@utils/index";
import { SongInfo, SongUrlInfo } from "@type/song";

/**
 * 获取音乐 url
 * 说明 : 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口,
 *      传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,
 *      !!!未登录状态返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
 * @param {string} id - 音乐的 id，例如 id=405998841,33894312
 */
export function getMusic(
  params: {
    id: number | string;
    br?: number | string;
  },
) {
  const queryParams = filterUselessKey({ ...params });
  return anfrage({
    url: "/song/url",
    method: "get",
    params: queryParams,
  });
}

/**
 * 音乐是否可用
 *
 * 说明: 调用此接口,传入歌曲 id, 可获取音乐是否可用,返回
 *      { success: true, message: 'ok' } 或者 { success: false, message: '亲爱的,暂无版权' }
 *
 *  - id 歌曲id
 *  - br 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,
 *          其他类推
 *
 */

export function checkMusic(params: {
  id: number | string;
  br?: number | string;
}) {
  return anfrage({
    url: "/check/music",
    method: "get",
    params: filterUselessKey(params),
  });
}

/**
 * 获取歌词
 * @param params
 * @returns
 */

export function getLyric(params: { id: string | number }) {
  return anfrage({
    url: "/lyric",
    method: "get",
    params,
  });
}

/**
 * 新歌速递
 * @param params
 * @returns
 */

export function getNewExpressMusic(params: { type: number | string }) {
  return anfrage({
    url: "/top/song",
    method: "get",
    params,
  });
}

/**
 * 歌曲评论
 * @param params
 * @returns
 */

export function getMusicComment(params: {
  id: number | string;
  limit?: number | string;
  offset?: number | string;
  before?: number | string;
}) {
  const { limit = 20, offset = 0, before, id } = params;
  return anfrage({
    url: "/comment/music",
    method: "get",
    params: filterUselessKey({
      limit,
      id,
      before,
      offset: +limit * +offset,
    }),
  });
}

/**
 * 歌曲详情
 *
 *
 */
export type GetMusicDetailReturnType = {
  songs: SongInfo[];
};
export function getMusicDetail(params: { ids: string }) {
  return anfrage({
    url: "/song/detail",
    method: "get",
    params,
  })
}

/**
 * 获取相似音乐
 *
 *
 */

export function getMusicSimilar(params: { id: string | number }) {
  return anfrage({
    url: "/simi/song",
    method: "get",
    params,
  });
}

/**
 * 获取每日推荐歌曲
 */

export function musicRecommend() {
  return anfrage({
    url: "/recommend/songs",
    method: "get",
  })
}

/**
 * 推荐新音乐
 */

export function newMusicRecommend(params: { limit?: number | string }) {
  const { limit = 10 } = params;
  return anfrage({
    url: "/personalized/newsong",
    method: "get",
    params: {
      limit,
    },
  })
}
