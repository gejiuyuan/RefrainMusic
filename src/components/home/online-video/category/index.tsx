import { getAllVideoList, getVideoCategoryList, getVideos, getVideoTagList } from "@/api/video";
import { allVideoDatasItem, VideoTagItem } from "@/types/video";
import { messageBus } from "@/utils/event/register";
import keepAliveRouterview from "@/widgets/keep-alive-routerview";
import { NSpace, NxButton } from "naive-ui";
import { computed, defineComponent, inject, markRaw, onMounted, reactive, readonly, ref, shallowReactive, shallowRef, watch, watchEffect } from "vue";
import { onBeforeRouteUpdate, RouteLocationNormalized, RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";
import VideoList from '@widgets/video-list';
import "./index.scss";
import { is } from "@/utils";
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
    });
    
    getVideoCategoryList().then(({data}) => {
      categoryVideosInfo.categoryList = getSortedTagOrCategoryList(data);
    });

    const getVideoList = async () => {
      const { offset = 0 } = route.query  
      const targetTagItem = categoryVideosInfo.tagList[activeInfo.index];
      if(!targetTagItem) {
        messageBus.dispatch('errorMessage', '标签或分类名字有误', {
          duration: 2000,
        });
        return;
      }
      const { msg, hasMore, datas } = await getVideos({
        id: targetTagItem.id,
        offset: Number(offset),
      });
      activeInfo.videoList = (datas as allVideoDatasItem[]).map(({data}) => data);
      activeInfo.msg = msg;
      activeInfo.hasMore = hasMore;
    } 

    watch<[string, VideoTagItem[]]>(() => [route.query.tag as string, categoryVideosInfo.tagList], ([tagName, tagList]) => {
      const targetTagIndex = tagList.findIndex(({name}) => name === tagName);   
      activeInfo.index = ~targetTagIndex ? targetTagIndex : 0;
    });

    watch(() => activeInfo.index, (index) => {    
      getVideoList();
    });

    const tagButtonClickHandler = (tagName: string) => { 
      router.push({
        ...route,
        query: {
          ...route.query,
          tag: tagName,
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
                  onClick={() => tagButtonClickHandler(name)}
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
