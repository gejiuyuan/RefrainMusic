import { getAllVideoList, getVideoCategoryList, getVideoTagList } from "@/api/video";
import { allVideoDatasItem, VideoTagItem } from "@/types/video";
import { defineComponent, InjectionKey, markRaw, onMounted, provide, reactive, readonly, ref, shallowReactive, shallowRef } from "vue";
import CommonRouterList, { RouteListProp } from "@/widgets/common-router-list";
import "./index.scss";
import KeepAliveRouterview from "@/widgets/keep-alive-routerview";
export interface AllVideosInfoType {  
  offset: number;
  list: allVideoDatasItem[];
  hasMore: boolean;
  msg: string;
}
export interface CategoryVideosInfoType {
  tagList: VideoTagItem[];
  categoryList: VideoTagItem[];
}

const videoPageRouteList:RouteListProp = [
  { text: '全部', to: 'all' },
  { text: '分类', to: 'category' },
]

/**
 * 对tagList、categoryList内容排序
 * @param list 
 * @returns 
 */
export const getSortedTagOrCategoryList = (list: VideoTagItem[]) => {
  return list.sort((a,b) => a.name.localeCompare(b.name, void 0, {
    //地域匹配算法
    localeMatcher: 'lookup',
    //排序敏感程度
    sensitivity: 'base',
    //是否忽略标点符号
    ignorePunctuation: false,
    //是否使用数字排序
    numeric: true,
    //大小写排序顺序：小写优先
    caseFirst: 'lower',
  })); 
}

export const videoTagOrCategoryListSorter = ([a,b]:[VideoTagItem,VideoTagItem]) => {
  return a.name.length - b.name.length
}

export default defineComponent({
  name: "OnlineVideo",
  setup(props, context) {
 
    const allVideosInfo = reactive<AllVideosInfoType>({
      offset: 0,
      list: [],
      hasMore: true,
      msg: '',
    });

    const categoryVideosInfo = reactive<CategoryVideosInfoType>({
      tagList: [],
      categoryList: [],
    });
 
    provide('categoryVideosInfo', categoryVideosInfo);
    provide('allVideosInfo', allVideosInfo);
 
    getVideoTagList().then(({data}) => {
      categoryVideosInfo.tagList = getSortedTagOrCategoryList(data);
    });
    
    getVideoCategoryList().then(({data}) => {
      categoryVideosInfo.categoryList = getSortedTagOrCategoryList(data);
    });

    getAllVideoList({
      offset: allVideosInfo.offset
    }).then(({datas, hasMore, msg}) => {
      allVideosInfo.list = datas;
      allVideosInfo.hasMore = hasMore;
      allVideosInfo.msg = msg;
    });

    return () => {
      return <section class="online-video">
        <h2>
          视频
        </h2>
        <CommonRouterList routelist={videoPageRouteList}></CommonRouterList>
        <KeepAliveRouterview></KeepAliveRouterview>
      </section>;
    };
  },
});
