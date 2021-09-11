import { getAllVideoList, getVideoCategoryList, getVideoTagList } from "@/api/video";
import { allVideoDatasItem, VideoTagItem } from "@/types/video";
import { defineComponent, InjectionKey, markRaw, onMounted, provide, reactive, readonly, ref, shallowReactive, shallowRef } from "vue";
import CommonRouterList, { RouteListProp } from "@/widgets/common-router-list";
import "./index.scss";
import KeepAliveRouterview from "@/widgets/keep-alive-routerview";

const videoPageRouteList:RouteListProp = [
  { text: '全部', to: 'all' },
  { text: '分类', to: 'category' },
]
  
export default defineComponent({
  name: "OnlineVideo",
  setup(props, context) {
  
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
