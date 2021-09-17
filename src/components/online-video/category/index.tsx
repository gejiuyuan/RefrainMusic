import { getVideoCategoryList, getVideos, getVideoTagList } from "@/api/video";
import { allVideoDatasItem, VideoTagItem } from "@/types/video";
import { messageBus } from "@/utils/event/register"; 
import { NSpace, NxButton } from "naive-ui";
import { computed, defineComponent, reactive, watch, watchEffect } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import VideoList from '@widgets/video-list';
import "./index.scss";
import { is } from "@/utils";
import { onFilteredBeforeRouteUpdate } from "@/hooks/onRouteHook";
export interface CategoryVideosInfoType {
  tagList: VideoTagItem[];
  categoryList: VideoTagItem[];
} 

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
 
export default defineComponent({
  name: "OnlineVideoCategory",
  setup(props, context) { 
    const route = useRoute();
    const router = useRouter();
    const activeInfo = reactive({
      index: -1,
      videoList: [] as allVideoDatasItem['data'][],
      offset: 0,
      hasMore: true,
      msg: '',
    }); 

    const categoryVideosInfo = reactive<CategoryVideosInfoType>({
      tagList: [],
      categoryList: [],
    });
  
    getVideoTagList().then(({data}) => {
      categoryVideosInfo.tagList = getSortedTagOrCategoryList(data);
    }).then(() => {
      getVideoList();
    });
    
    getVideoCategoryList().then(({data}) => {
      categoryVideosInfo.categoryList = getSortedTagOrCategoryList(data);
    });

    const getVideoList = async () => {
      const [{id: firstId}] = categoryVideosInfo.tagList;
      const { offset = 0 , id = firstId } = route.query  
      const { code, msg, hasMore, datas } = await getVideos({
        id: Number(id),
        offset: Number(offset), 
      });
      if(code !== 200) {
        messageBus.dispatch('errorMessage', msg);
        return;
      }
      activeInfo.videoList = (datas as allVideoDatasItem[]).map(({data}) => data);
      activeInfo.msg = msg;
      activeInfo.hasMore = hasMore;
    } 
    
    onFilteredBeforeRouteUpdate((to, from) => {
      const { offset, id } = to.query;
      const { offset:fromOffset, id: fromId } = from.query;
      if( id !== fromId || offset !== fromOffset ) {
        getVideoList();
      } 
    });

    watch<[string, VideoTagItem[]]>(() => [route.query.id as string, categoryVideosInfo.tagList], ([routeId, tagList]) => {
      const realRouteId = +routeId;
      const targetTagIndex = is.undefined(routeId) ? 0 : tagList.findIndex(({id}) => id === realRouteId);   
      activeInfo.index = targetTagIndex;
    });

    const tagButtonClickHandler = (tag: string, id: string | number) => { 
      router.push({
        ...route,
        query: {
          ...route.query, 
          id,
        }
      }); 
    }

    const renderVideoTagList = () => {
      const activeTagIdxVal = activeInfo.index;
      return (
        <NSpace align="center" size={20}>
          {
            categoryVideosInfo.tagList.map(({
              id,
              name,
            }, i) => {
              return (
                <NxButton 
                  size="small"
                  key={id} 
                  round 
                  dashed={i !== activeTagIdxVal}
                  color="#595959"
                  onClick={() => tagButtonClickHandler(name, id)}
                >
                  {
                    name
                  }
                </NxButton>
              )
            })
          }
        </NSpace>
      )
    }

    return () => { 
      return <section class="online-video-category">
        {
          renderVideoTagList()
        }
        <section className="video-category-layer">
          <VideoList videoList={activeInfo.videoList}></VideoList>
        </section>
      </section>;
    };
  },
});
