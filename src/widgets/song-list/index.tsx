import {
  watch,
  ref,
  shallowReactive,
  shallowRef,
  computed,
  defineComponent,
  PropType,
} from "vue";
import {
  useRouter,
  useRoute,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  RouterLink,
} from "vue-router";
import RoutePagination from "@/widgets/route-pagination";
import "./index.scss";
import { NEmpty, NGrid, NGridItem } from "naive-ui";
import { UNICODE_CHAR, padPicCrop } from "@utils/index";
import { getFullName, getFullNames } from "@/utils/apiSpecial";
import { PAGE_SIZE } from "@/utils/preference";
import { PlaylistCommon } from "@/types/songlist";

const songlistDefaultLimit = PAGE_SIZE.DEFAULT;

export default defineComponent({
  name: "Songlist",
  props: {
    playlists: {
      type: Array as PropType<PlaylistCommon[]>,
      required: false,
      default: () => [],
    },
    defaultLimit: {
      type: Number as PropType<number>,
      required: false,
      default: songlistDefaultLimit,
    },
    total: {
      type: Number as PropType<number>,
      required: false,
      default: 0,
    },
    gaps: {
      type: Object as PropType<Partial<Record<'x' | 'y', number>>>,
      required: false,
      default: () => ({ x: 30, y: 30 }),
    },
    cols: {
      type: Number as PropType<number>,
      required: false,
      default: 7
    },
    hasMore: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: true
    },
    showPagination: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    const topListInfo = shallowReactive({
      limit: 0,
      offset: 0,
      total: 0,
      sizeArr: [] as number[],
    });

    const updateTolListInfo = (query: PlainObject) => {
      const { defaultLimit, total } = props;
      const { limit = defaultLimit, offset = 0 } = query;
      topListInfo.limit = limit;
      topListInfo.offset = offset;
      topListInfo.total = total;
      topListInfo.sizeArr = Array(2)
        .fill("")
        .map((v, i) => defaultLimit * (i + 1));
    };
    updateTolListInfo(route.query as PlainObject);

    onBeforeRouteUpdate((to, from, next) => {
      updateTolListInfo(to.query as PlainObject);
      next();
    });

    const toSonglistDetailPage = (id: string | number) =>
      router.push({
        path: "/songlist/:id",
        name: 'songlist',
        params: { id }
      });

    const toUserDetailPage = (userId: string | number) =>
      router.push({
        path: '/user',
        query: {
          id: userId
        }
      })

    const renderMainList = () => {
      const { playlists, gaps, cols, showPagination } = props;
      return (
        <section class="music-wrap">
          {
            playlists.length
              ? (
                <NGrid xGap={gaps.x} yGap={gaps.y} cols={cols}>
                  {
                    playlists.map(({ name, id, coverImgUrl, picUrl, description, creator }) => {
                      const { userId, nickname, avatarUrl } = creator;
                      return (
                        <NGridItem key={id}>
                          <section
                            class="music-item"
                          >
                            <div class="music-cover" aspectratio="1" onClick={() => toSonglistDetailPage(id)}>
                              <img
                                loading="lazy"
                                src={padPicCrop(coverImgUrl || picUrl, { x: 340, y: 340 })}
                                alt={`${name}-${description}`}
                                title={`${name}-${description}`}
                              />
                            </div>
                            <div class="music-body">
                              <h6 title={name}>{name}</h6>
                              <div className="music-creator">
                                <>
                                  {
                                    avatarUrl ? (
                                      <div class="creator-avatar-wrap">
                                        <div aspectratio="1" onClick={() => toUserDetailPage(userId)}>
                                          <img src={padPicCrop(avatarUrl, { x: 60, y: 60 })} alt="" />
                                        </div>
                                      </div>
                                    ) : (
                                      <span class="creator-title">创建者：</span>
                                    )
                                  }
                                  <em class="creator-nickname">
                                    <span onClick={() => toUserDetailPage(userId)}>
                                      {nickname}
                                    </span>
                                  </em>
                                </>
                              </div>
                            </div>
                          </section>
                        </NGridItem>
                      )
                    })
                  }
                </NGrid>
              )
              : (
                <NEmpty
                  class="songlist-empty"
                  description={`歌单走丢啦~~${UNICODE_CHAR.hugface}`}
                ></NEmpty>
              )
          }
        </section>
      );
    };

    return () => {

      return (
        <section class="song-list">
          {renderMainList()}

          {
            props.showPagination && (
              <section class="songlist-pagination">
                <RoutePagination pagiInfo={topListInfo} hasMore={props.hasMore}></RoutePagination>
              </section>
            )
          }

        </section>
      );
    };
  },
});
