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
import { extend, getLocaleDate, padPicCrop } from "@/utils";
import { VideoDetailInfoItem, VideoPlaybackSourceItem } from "@/types/video";
import usePlayerStore from "@/stores/player";
import VideoList from "@/widgets/video-list";
import FollowButton from "@/widgets/follow-button";
import { NSpace, NxButton } from "naive-ui";
import YuanButton from "@/widgets/yuan-button";

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
      detail: {
        videoGroup: [] as VideoDetailInfoItem['videoGroup'],
        coverUrl: '',
        creator: {
          avatarUrl: '',
        },
      } as VideoDetailInfoItem
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
          console.info(data)
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

    const toVideoTagListPage = (tagName: string) => {
      router.push({
        path: '/onlinevideo/category',
        query: {
          tag: tagName
        }
      })
    }

    return () => {
      const [{url}] = videoUrlInfo.value;
      const { detail } = videoData;
      const { title, publishTime, videoGroup, creator: { avatarUrl, nickname } } = detail;
      const videoAuthorAvatarUrl = padPicCrop(avatarUrl, {x: 80, y:80});
      const videoAvatarStyle = `background-image:url(${videoAuthorAvatarUrl})`;
      const publishTimeStr = getLocaleDate(publishTime);

      return <section class="video-page">

        <div className="video-content">
          <div className="video-container">
            <video 
              ref={videoRef} 
              src={url} 
              autoplay={playerStore.video.isPlay} 
              controls 
              onPlay={onVideoPlayHandler} 
              onPause={onVideoPauseHandler}
              poster={detail.coverUrl}
            ></video>
          </div>
          <div className="video-operator">
            <header className="video-author">
              <i class="author-avatar" style={videoAvatarStyle} title={nickname}>
                <em>{nickname}</em>
              </i> 
              <FollowButton></FollowButton>
            </header>
            <h3 class="video-title" title={title} singallinedot>
              {title}
            </h3>
            <p class="video-info">
              <em>
                发布：
                <span>
                  { publishTimeStr }
                </span>
              </em> 
            </p>
            <div class="video-tags">
              <NSpace>
                {
                  videoGroup.map(({id,name}) => {
                    return <NxButton size="small" onClick={() => toVideoTagListPage(name)}>{name}</NxButton>
                  })
                }
              </NSpace>
            </div>
            <div className="video-buttons">
              <NSpace size={30}>
                  <YuanButton>
                    <i className="iconfont icon-shoucang"></i>
                    <em>收藏</em>
                  </YuanButton>
                  <YuanButton>
                    <i className="iconfont icon-dianzan2"></i>
                    <em>赞</em> 
                  </YuanButton>
                  <YuanButton>
                    <i className="iconfont icon-fenxiang"></i>
                    <em>分享</em> 
                  </YuanButton>
                  <YuanButton>
                    <i className="iconfont icon-download"></i>
                    <em>下载</em> 
                  </YuanButton>
              </NSpace>
            </div>
          </div>
          <div className="video-recommend">
            <h4>相关推荐</h4>
            <VideoList videoList={recommendVideos.value} cols={4} gaps={{x:20, y: 20}}></VideoList>
          </div>
        </div>
        <div className="video-comment">

        </div>
      </section>
    };
  },
});
