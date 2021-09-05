
import { anfrage } from "@/request";
import { EMPTY_OBJ, filterUselessKey } from "@utils/index";

/**
 * 首页-发现-圆形图标入口列表
 * @returns 
 * @introduction
 *     可获取APP首页圆形图标入口列表
 */
export function getHomepageDragonBall() {
  return anfrage({
    url: '/homepage/dragon/ball',
  })
}

/**
 * 首页-发现
 * @param params
 *    refresh: 是否刷新数据,默认为false
 *    cursor: 上一条数据返回的cursor 
 * @returns 
 * @introduction 
 *    可获取APP首页信息
 */
export function getHomepageFindings(params: {
  refresh?: boolean;
  cursor?: any;
} = EMPTY_OBJ) {
  return anfrage({
    url: '/homepage/block/page',
    params: filterUselessKey(params)
  })
}