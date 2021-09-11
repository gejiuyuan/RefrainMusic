import { defineComponent, nextTick, ref, shallowReactive, shallowReadonly, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";

import {
  getVideoTagList,
  getVideoCategoryList,
  getVideos,
  getAllVideoList,
  getRecommendVideos,
  getRelativeVideos,
  getVideoDetail,
  getVideoRelativeInfo,
  getVideoPlaybackSource,
} from "@api/video";
import { extend } from "@/utils";
import { VideoDetailInfoItem, VideoPlaybackSourceItem } from "@/types/video";
import usePlayerStore from "@/stores/player";

export default defineComponent({
  name: "Video",
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const playerStore = usePlayerStore();
    const videoRef = ref<HTMLVideoElement>()
    const videoData = shallowReactive({
      relativeInfo: {
        commentCount: 0,
        liked: false,
        likedCount: 0,
        shareCount: 0,
      },
      detail: {} as VideoDetailInfoItem
    });

    const videoUrlInfo = ref<VideoPlaybackSourceItem[]>([{  
      id: '',
      payInfo: null,
      needPay: false,
      r: 0,
      size: 0,
      url: '',
      validityTime: 0
    }]);

    const recommendVideos = ref<any[]>([]);
 
    watch(() => playerStore.video.isPlay, async (isPlay) => { 
      await nextTick();
      const videoRefValuePaused = videoRef.value!.paused;
      if(isPlay === videoRefValuePaused) { 
        videoRef.value![ videoRefValuePaused ? 'play' : 'pause']();
      }
    });

    watch(
      () => route.query,
      (query) => {
        const vid = query.vid as string;   
        getRelativeVideos({
          id: vid,
        }).then(({data}) => {
          recommendVideos.value = data;
        });
        getVideoDetail({
          id: vid,
        }).then(({data}) => {
          videoData.detail = data;
        });
        getVideoRelativeInfo({
          vid,
        }).then((detailInfoFromServer) => {
          extend(videoData.relativeInfo, detailInfoFromServer);
        });
        getVideoPlaybackSource({
          id: vid,
        }).then(({urls}) => {
          videoUrlInfo.value = urls;
        });
      },
      {
        immediate: true,
      }
    );

    const onVideoPlayHandler = () => { 
      playerStore.setVideoIsPlay(true);
    }
    const onVideoPauseHandler = () => {
      playerStore.setVideoIsPlay(false);
    }

    return () => {
      const [{url}] = videoUrlInfo.value;
      return <section class="video-page">

        <div className="video-content">
          <video ref={videoRef} src={url} autoplay={playerStore.video.isPlay} controls width={800} height={450} onPlay={onVideoPlayHandler} onPause={onVideoPauseHandler}></video>
        </div>

      </section>
    };
  },
});
