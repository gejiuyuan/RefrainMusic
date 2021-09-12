import { computed, defineComponent, nextTick, reactive, ref, shallowReactive, shallowReadonly, watch, watchEffect } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
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
import { extend, getLocaleCount, getLocaleDate, is, padPicCrop } from "@/utils";
import { VideoDetailInfoItem, VideoPlaybackSourceItem } from "@/types/video";
import usePlayerStore from "@/stores/player";
import VideoList from "@/widgets/video-list";
import FollowButton, { FollowType } from "@/widgets/follow-button";
import { NSpace, NxButton } from "naive-ui";
import YuanButton from "@/widgets/yuan-button";
import { praiseResource } from "@/api/other";
import { unOrFocusUser, userVideoCollect } from "@/api/user";
import { messageBus } from "@/utils/event/register";
import { render } from "naive-ui/lib/_utils";

export default defineComponent({
  name: "Video",
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const playerStore = usePlayerStore();
    const videoRef = ref<HTMLVideoElement>();
    const hasVideoSource = ref(false);
    const videoData = reactive({
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
          nickname: '',
        },
        subscribeCount: 0,
        description: '',
        vid: '',
      } as VideoDetailInfoItem,
      isCollected: false,
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
 
    const vid = String(route.query.vid);
    getRelativeVideos({
      id: vid,
    }).then(({data}) => {
      recommendVideos.value = data; 
    });
    getVideoDetail({
      id: vid,
    }).then(({data, code}) => {
      const isSuccess = code === 200;
      hasVideoSource.value = isSuccess;
      if(!isSuccess) {
        messageBus.dispatch('errorMessage', '无法获取视频信息');
        return;
      }
      videoData.detail = data;
    });
    getVideoRelativeInfo({
      vid,
    }).then((detailInfoFromServer) => {
      videoData.relativeInfo = detailInfoFromServer;
    });
    getVideoPlaybackSource({
      id: vid,
    }).then(({urls}) => {
      if(is.emptyArray(urls)) {
        return;
      }
      videoUrlInfo.value = urls;
    }); 

    const videoDataWatcher = watch(
      () => [videoData.detail.description, videoData.detail.vid, playerStore.video.beLiked],
      () => {
        videoData.isCollected = playerStore.isVideoBeLiked(videoData.detail.vid, videoData.detail.description);
      }
    );

    onBeforeRouteLeave(() => {
      videoDataWatcher();
    });
 
    watch(() => playerStore.video.isPlay, async (isPlay) => { 
      await nextTick();
      const videoRefValuePaused = videoRef.value!.paused;
      if(isPlay === videoRefValuePaused) { 
        videoRef.value![ videoRefValuePaused ? 'play' : 'pause']();
      }
    }); 

    const onVideoPlayHandler = () => { 
      playerStore.setVideoIsPlay(true);
    }
    const onVideoPauseHandler = () => {
      playerStore.setVideoIsPlay(false);
    }

    const toVideoTagListPage = (id: string | number) => {
      router.push({
        path: '/onlinevideo/category',
        query: {
          id
        }
      })
    }

    /**
     * 收藏视频
     * @param value 
     */
    const collectVideoHandler = async (value: boolean) => {
      const { code , message } = await userVideoCollect({
        id: String(route.query.vid),
        sure: value,
      });      
      const isSuccess = code === 200;
      let messageTopic = 'warnMessage';
      if(isSuccess) {
        videoData.isCollected = value;
        videoData.detail.subscribeCount = videoData.detail.subscribeCount + (value ? 1 : -1);
        messageTopic = 'successMessage';
      }
      messageBus.dispatch(messageTopic, message);
    }

    /**
     * 点赞视频
     * @param value 
     */
    const praiseVideoHandler = async (value: boolean) => {
      const { code } = await praiseResource({
        id: String(route.query.vid),
        sure: value,
        type: 5,
      });  
      const isSuccess = code === 200; 
      let messageTopic = 'warnMessage';
      let msg = '取消点赞成功~~';
      if(isSuccess) {
        videoData.relativeInfo.liked = value; 
        videoData.relativeInfo.likedCount = videoData.relativeInfo.likedCount + (value ? 1 : -1); 
        messageTopic = 'successMessage';
        value && (msg = '点赞成功~~');
      }
      messageBus.dispatch(
        messageTopic, 
        msg
      );
    }

    /**
     * 关注用户状态改变
     * @param isFollow 
     */
    const followedChangeHandler = async (isFollow: boolean) => {
      videoData.detail.creator.followed = isFollow;
    }

    const renderVideoOperator = () => {
      const { detail, isCollected, relativeInfo: { liked, likedCount, shareCount } } = videoData;
      const { title, publishTime, videoGroup, subscribeCount, creator: { avatarUrl, userId, nickname, followed } } = detail;
      const videoAuthorAvatarUrl = padPicCrop(avatarUrl, {x: 80, y:80});
      const videoAvatarStyle = `background-image:url(${videoAuthorAvatarUrl})`;
      const publishTimeStr = getLocaleDate(publishTime);  
      const subscribeCountStr = getLocaleCount(subscribeCount);
      const likedCountStr = getLocaleCount(likedCount);
      const shareCountStr = getLocaleCount(shareCount); 
      return (
        <div className="video-operator">
            <header className="video-author">
              <i class="author-avatar" style={videoAvatarStyle} title={nickname}>
                <em>{nickname}</em>
              </i>  
              <FollowButton 
                userId={userId} 
                followed={followed} 
                followType={FollowType.user}
                onUpdateFollow={followedChangeHandler}
              ></FollowButton>
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
                    return <NxButton size="small" onClick={() => toVideoTagListPage(id)}>{name}</NxButton>
                  })
                }
              </NSpace>
            </div>
            <div className="video-buttons">
              <NSpace size={30}>
                  <YuanButton isActive={isCollected} onUpdateIsActive={(value) => collectVideoHandler(value)}>
                    <i className="iconfont icon-collect" iconactive={isCollected}></i>
                    <em>收藏{subscribeCountStr}</em>
                  </YuanButton>
                  <YuanButton isActive={liked} onUpdateIsActive={(value) => praiseVideoHandler(value)}>
                    <i className="iconfont icon-praise" iconactive={liked}></i>
                    <em>赞{likedCountStr}</em> 
                  </YuanButton>
                  <YuanButton>
                    <i className="iconfont icon-fenxiang"></i>
                    <em>分享{shareCountStr}</em> 
                  </YuanButton>
                  <YuanButton>
                    <i className="iconfont icon-download"></i>
                    <em>下载</em> 
                  </YuanButton>
              </NSpace>
            </div>
          </div>
      )
    }

    return () => {
      const [{url}] = videoUrlInfo.value;
      const { detail } = videoData; 
      const hasVideoSourceValue = hasVideoSource.value;

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

          {
            hasVideoSourceValue && renderVideoOperator()
          }
          
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
