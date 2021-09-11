import { getAllVideoList, getVideoCategoryList, getVideoTagList } from "@/api/video";
import { allVideoDatasItem, VideoTagItem } from "@/types/video";
import { NSpace, NxButton } from "naive-ui";
import { defineComponent, inject, InjectionKey, markRaw, onMounted, reactive, readonly, ref, shallowReactive, shallowRef } from "vue";
import { AllVideosInfoType, CategoryVideosInfoType } from "..";
import "./index.scss";

export default defineComponent({
  name: "OnlineVideoAll",
  setup(props, context) {
    
    const allVideosInfo = inject<AllVideosInfoType>('allVideosInfo')!;

    return () => {
      return <section class="online-video-all">
        
      </section>;
    };
  },
});
