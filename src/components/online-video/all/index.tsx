import { getAllVideoList, getVideoCategoryList, getVideoTagList } from "@/api/video";
import { allVideoDatasItem, VideoTagItem } from "@/types/video";
import { NSpace, NxButton } from "naive-ui";
import { defineComponent, inject, InjectionKey, markRaw, onMounted, reactive, readonly, ref, shallowReactive, shallowRef } from "vue";
import VideoList from '@widgets/video-list';
import "./index.scss";
import YuanButton from "@/widgets/yuan-button";

export interface AllVideosInfoType {  
  list: allVideoDatasItem[];
  hasMore: boolean;
  msg: string;
}

export default defineComponent({
  name: "OnlineVideoAll",
  setup(props, context) {
    
    const allVideosInfo = reactive<AllVideosInfoType>({ 
      list: [],
      hasMore: true,
      msg: '',
    });

    const loadCount = ref(0);

    const updateAllVideoList = () => {
      getAllVideoList({
        offset: loadCount.value, 
      }).then(({datas, hasmore, msg}) => {
      console.info(allVideosInfo.list)

        allVideosInfo.list.push(...datas.map(({data}: allVideoDatasItem)=>data));
        allVideosInfo.hasMore = hasmore;
        allVideosInfo.msg = msg;
      }); 
    }
    updateAllVideoList();

    const loadMoreHandler = () => { 
      if(!allVideosInfo.hasMore) {
        return;
      }
      loadCount.value++;
      updateAllVideoList();
    }

    return () => { 
      const { hasMore } = allVideosInfo;
      return <section class="online-video-all">
        <section className="video-layer">
          <VideoList videoList={allVideosInfo.list}></VideoList>
        </section>
        <div className="video-all-foot">
          <YuanButton text={"加载更多"} onClick={() => loadMoreHandler()} disabled={!hasMore}></YuanButton>
        </div>
      </section>;
    };
  },
});