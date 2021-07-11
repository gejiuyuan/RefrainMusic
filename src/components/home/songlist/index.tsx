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
import { playlistDetail, playlistDetailDynamic } from "@api/playlist";
import { getLocaleDate, objToQuery, padPicCrop } from "@utils/index";
import { getLocaleCount } from "@utils/calc";
import "./index.scss";

import {
  NAvatar,
  NxButton,
  NMenu
} from 'naive-ui';
import CommonRouterList from "@/widgets/common-router-list";
import KeepAliveRouterview from "@/widgets/keep-alive-routerview";

const baseSonglistRoutelists = [
  { text: "歌曲列表", to: "/songlist/music" },
  { text: "评论", to: "/songlist/comments" },
  { text: "订阅者", to: "/songlist/subscribers" },
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
    });
    provide("songlistInfo", songlistInfo);

    const getsonglist = async (id: string) => {
      const { data = {} } = await playlistDetail({ id, s: subscribedNumber });
      const { playlist = {} } = data;
      playlist.updateTimeStr = getLocaleDate(playlist.updateTime);
      playlist.createTimeStr = getLocaleDate(playlist.createTime);
      playlist.shareCountStr = getLocaleCount(playlist.shareCount);
      playlist.playCountStr = getLocaleCount(playlist.playCount);
      playlist.subscribedCountStr = getLocaleCount(playlist.subscribedCount);
      songlistInfo.playlist = playlist;
    };

    const getsonglistDetail = async (id: string) => {
      const { data = {} } = await playlistDetailDynamic({ id });
      const commentCountStr = getLocaleCount(data.commentCount);
      songlistInfo.dynamicInfo = {
        commentCountStr,
      };
    };

    const updatePageData = async (query: PlainObject) => {
      const { id } = query;
      await Promise.allSettled([getsonglist(id), getsonglistDetail(id)]);
      const tracksLen = songlistInfo.playlist.tracks.length;
      const commentCountStr = songlistInfo.dynamicInfo.commentCountStr;
      baseSonglistRoutelists.forEach(({ text, to }, i) => {
        songlistRoutelists[i] = {
          text,
          to: to + objToQuery(query, true),
        };
      });
      songlistRoutelists[0].text += tracksLen ? `(${tracksLen})` : "";
      songlistRoutelists[1].text += parseFloat(commentCountStr)
        ? `(${commentCountStr})`
        : "";
    };

    updatePageData(router.currentRoute.value.query);

    onBeforeRouteUpdate((to: RouteLocationNormalized, from, next) => {
      const { id: toId } = to.query as any;
      const { id: fromId } = from.query;
      if (toId != fromId) {
        updatePageData(to.query);
      }
      next();
    });

    const toCreatorDetailPage = (id: string) =>
      router.push({ path: "/user", query: { id } });

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

        <section class="yplayer-songlist">

          <section class="songlist-header">

            <div class="songlist-header-playbill">
              <div equalAspectRatio>
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
                  <em singalLineDot>{playlist.description}</em>
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

        </section>

      );

    };

  },

});
