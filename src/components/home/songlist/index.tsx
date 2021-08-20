import {
  shallowReactive,
  computed,
  toRefs,
  onActivated,
  provide,
  reactive,
  readonly,
  ref,
  defineComponent,
  h,
} from "vue";
import {
  useRouter,
  useRoute,
  RouteLocationNormalized,
  onBeforeRouteUpdate,
  RouterView,
} from "vue-router";
import { playlistDetail, playlistDetailDynamic, relatedPlaylist } from "@api/playlist";
import { getLocaleDate, objToPathname, objToQuery, padPicCrop, UNICODE_CHAR } from "@utils/index";
import { getLocaleCount } from "@utils/calc";
import "./index.scss";

import {
  NAvatar,
  NxButton,
  NMenu
} from 'naive-ui';
import Songlist from '@widgets/song-list';
import CommonRouterList from "@/widgets/common-router-list";
import KeepAliveRouterview from "@/widgets/keep-alive-routerview";
import { getMusicDetail } from "@/api/music";

const baseSonglistRoutelists = [
  { text: "歌曲列表", to: "/songlist/:id/music", },
  { text: "评论", to: "/songlist/:id/comments" },
  { text: "订阅者", to: "/songlist/:id/subscribers" },
];

const subscribedNumber = 99;

export default defineComponent({
  name: "songlist",
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    const songlistRoutelists = reactive<typeof baseSonglistRoutelists>([]);

    const songlistInfo = shallowReactive({
      playlist: {
        name: "",
        creator: {
          avatarDetail: {
            identityIconUrl: "",
          },
          detailDescription: "",
          nickname: "",
          avatarUrl: "",
          userId: "",
        },
        coverImgUrl: "",
        description: "",
        subscribers: [],
        tracks: [],
        playCountStr: "",
        createTimeStr: "",
        subscribedCountStr: "",
        updateTimeStr: "",
        shareCountStr: "",
      },
      dynamicInfo: {
        commentCountStr: "",
      },
      //推荐歌单
      relativeRecommendSonglist: [],
    });
    provide("songlistInfo", songlistInfo);

    const getsonglist = async (id: string) => {
      const { playlist = {} } = await playlistDetail({ id, s: subscribedNumber });
      playlist.updateTimeStr = getLocaleDate(playlist.updateTime);
      playlist.createTimeStr = getLocaleDate(playlist.createTime);
      playlist.shareCountStr = getLocaleCount(playlist.shareCount);
      playlist.playCountStr = getLocaleCount(playlist.playCount);
      playlist.subscribedCountStr = getLocaleCount(playlist.subscribedCount);
      //之所以再获取移除所有歌曲，是因为返回的playlsit.tracks不全
      const { songs } = await getMusicDetail({ ids: playlist.trackIds.map((_: any) => _.id).join(',') });
      playlist.tracks = songs;
      songlistInfo.playlist = playlist;
    };

    const getsonglistDetail = async (id: string) => {
      const { data = {} } = await playlistDetailDynamic({ id });
      const commentCountStr = getLocaleCount(data.commentCount);
      songlistInfo.dynamicInfo = {
        commentCountStr,
      };
    };

    const getRelativeRecommendSonglist = async () => {
      const { playlists } = await relatedPlaylist({
        id: route.params.id + '',
      });
      songlistInfo.relativeRecommendSonglist = playlists;
    }
    getRelativeRecommendSonglist();

    const updatePageData = async (params: PlainObject) => {
      const { id } = params;
      await Promise.allSettled([getsonglist(id), getsonglistDetail(id)]);
      const tracksLen = songlistInfo.playlist.tracks.length;
      const commentCountStr = songlistInfo.dynamicInfo.commentCountStr;
      baseSonglistRoutelists.forEach(({ text, to }, i) => {
        songlistRoutelists[i] = {
          text,
          to: to.replace(':id', objToPathname(params, false)),
        };
      });
      songlistRoutelists[0].text += tracksLen ? `(${tracksLen})` : "";
      songlistRoutelists[1].text += parseFloat(commentCountStr)
        ? `(${commentCountStr})`
        : "";
    };

    updatePageData(router.currentRoute.value.params);

    onBeforeRouteUpdate((to: RouteLocationNormalized, from, next) => {
      const { id: toId } = to.params as any;
      const { id: fromId } = from.params;
      if (toId != fromId) {
        updatePageData(to.params);
      }
      next();
    });

    const toCreatorDetailPage = (id: string) =>
      router.push({ path: "/user", params: { id } });


    const renderRelativeRecommendSonglist = () => {
      return (
        <section class="songlist-relative-playlist">
          <h5 class="relative-title">
            相关歌单推荐 {UNICODE_CHAR.smile}
          </h5>
          <Songlist playlists={songlistInfo.relativeRecommendSonglist} showPagination={false} gaps={{ x: 40, y: 40 }} cols={7}></Songlist>
        </section>
      )
    }

    return () => {
      const { playlist } = songlistInfo;
      const {
        coverImgUrl,
        creator: {
          userId,
          detailDescription,
          avatarDetail,
          avatarUrl,
          nickname,
        },
      } = playlist;

      return (

        <section class="songlist-page">

          <section class="songlist-header">

            <div class="songlist-header-playbill">
              <div aspectratio="1">
                <img
                  loading="lazy"
                  class="songlist-pic"
                  src={coverImgUrl && padPicCrop(coverImgUrl, { x: 380, y: 380 })}
                  alt=""
                />
              </div>
            </div>

            <section class="songlist-header-body">

              <section class="songlist-info">
                <h5>{playlist.name}</h5>

                <div class="songlist-creator">

                  <div
                    class="songlist-creator-detail"
                    onClick={() => toCreatorDetailPage(userId)}
                  >
                    <div class="songlist-creator-avatar" title={detailDescription}>
                      <NAvatar
                        circle
                        size="medium"
                        src={padPicCrop(avatarUrl, { x: 80, y: 80 })}
                      ></NAvatar>
                      {avatarDetail && (
                        <img
                          loading="lazy"
                          class="detail-avatar"
                          src={avatarDetail?.identityIconUrl}
                        />
                      )}
                    </div>
                    <em>{nickname}</em>
                  </div>

                  <NxButton
                    class="play-count"
                    size="small"
                    type="error"
                    ghost
                    dashed
                    disabled
                  >
                    <span>播放量：</span>
                    <em>{playlist.playCountStr}</em>
                  </NxButton>
                </div>

                <p class="desc" title={playlist.description}>
                  <span> 描述： </span>
                  <em singallinedot>{playlist.description}</em>
                </p>

                <div
                  class="relative-data create-time"
                  title={`创建时间：${playlist.createTimeStr}`}
                >
                  <span>创建时间：</span>
                  <em>{playlist.createTimeStr}</em>
                </div>
                <div
                  class="relative-data update-time"
                  title={`更新时间：${playlist.updateTimeStr}`}
                >
                  <span>更新时间：</span>
                  <em>{playlist.updateTimeStr}</em>
                </div>
              </section>

              <section class="songlist-tools">
                <div
                  class="songlist-btn"
                  title={`分享量${playlist.shareCountStr}`}
                >
                  <NxButton
                    type="warning"
                    size="small"
                    ghost
                    dashed
                  >
                    分享量：
                    {playlist.shareCountStr}
                  </NxButton>
                </div>
                <div
                  class="songlist-btn"
                  title={`订阅量${playlist.subscribedCountStr}`}
                >
                  <NxButton
                    type="warning"
                    size="small"
                    ghost
                    dashed
                  >
                    订阅量：
                    {playlist.subscribedCountStr}
                  </NxButton>
                </div>
              </section>

            </section>

          </section>

          <section class="songlist-routelist">
            <CommonRouterList routelist={songlistRoutelists}></CommonRouterList>
          </section>

          <section class="songlist-main">
            <KeepAliveRouterview></KeepAliveRouterview>
          </section>

          {
            renderRelativeRecommendSonglist()
          }

        </section>

      );

    };

  },

});
