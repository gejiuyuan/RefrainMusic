import { anfrageWithLoading } from "@/request";

export const MvOptions = {
    areas: [
        '全部',
        '内地',
        '港台',
        '欧美',
        '日本',
        '韩国',
    ],
    types: [
        '全部',
        '官方版',
        '原生',
        '现场版',
        '网易出品',
    ],
    orders: [
        '上升最快',
        '最热',
        '最新',
    ]
}

/**
 * MV评论数
 * @param param 
 *      - id MV的id
 *      - limit 取出评论数，默认20
 *      - offset 第几页
 *      - before 当获取数据超过5000条时需要用到。值为上一页最后一项的time，以得到下一页数据
 * @returns 
 */
export function getMVComments(param: {
    id: string | number,
    limit?: string | number,
    offset?: string | number,
    before?: string | number,
}) {
    const { id, limit = 20, offset = 0, before } = param
    return anfrageWithLoading({
        url: "/comment/mv",
        params: {
            id,
            limit,
            offset: +offset * +limit,
            before
        }
    })
}

/**
 * 所有MV
 * @param param 
 *      - id MV的id
 *      - area 地区，可选值为全部,内地,港台,欧美,日本,韩国
 *      - order 排列顺序，可选值为上升最快,最热,最新
 *      - type 出品类型，可选值为全部,官方版,原生,现场版,网易出品
 *      - limit 取出数量，默认30
 *      - offset 第几页 
 * @returns 
 */
export function getAllMv(param: {
    id: string | number,
    area?: string,
    order?: string,
    type?: string,
    limit?: string | number,
    offset?: string | number
}) {
    const { areas, types, orders } = MvOptions;
    const {
        id,
        area = areas[0],
        order = orders[0],
        type = types[0],
        limit = 30,
        offset = 0
    } = param
    return anfrageWithLoading({
        url: "/mv/all",
        params: {
            id, area, type, limit, order,
            offset: +offset * +limit
        }
    })
}

/**
 * 最新MV
 * @param param 
 *      - id MV的id
 *      - limit 取出数量，默认30
 * @returns 
 */
export function getLatestMV(param: {
    id: string | number,
    limit?: string | number
}) {
    const { id, limit = 30 } = param
    return anfrageWithLoading({
        url: "/mv/first",
        params: {
            id,
            limit
        }
    })
}

/**
 * 网易出品MV
 * @param param 
 *      - id MV的id
 *      - limit 取出数量，默认30
 *      - offset 第几页 
 * @returns 
 */
export function getNeteaseMV(param: {
    id: string | number,
    limit?: string | number,
    offset?: string | number
}) {
    const { id, limit = 30, offset = 0 } = param
    return anfrageWithLoading({
        url: "/mv/exclusive/rcmd",
        params: {
            id,
            limit,
            offset: +offset * +limit,
        }
    })
}

/**
 * 推荐MV
 * @param param 
 *      - id MV的id
 *      - limit 取出数量，默认30 
 * @returns 
 */
export function getRecommendMV() {
    return anfrageWithLoading({
        url: "/personalized/mv",
    })
}