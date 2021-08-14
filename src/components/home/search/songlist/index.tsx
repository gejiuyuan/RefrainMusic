import { getLocaleCount } from "@/utils";
import { defineComponent, markRaw, onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SearchCloundData } from "../index";
import RoutePagination, { PagiInfo } from "@widgets/route-pagination";
import "./index.scss";
import { COMPONENT_NAME, PAGE_SIZE } from "@/utils/preference";

const defaultLimit = PAGE_SIZE[COMPONENT_NAME.SEARCH_SONGLIST];

export default defineComponent({
  name: COMPONENT_NAME.SEARCH_SONGLIST,
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const searchData = inject<SearchCloundData>("searchCloundData")!;

    //前往歌单创建者的详情页
    const toCreatorDetailPage = (userId: number) =>
      router.push({
        path: "/user",
        query: {
          id: userId,
        },
      });

    //前往歌单详情页
    const toPlaylistDetailPage = (id: number) =>
      router.push({
        path: "/songlist",
        query: {
          id,
        },
      });

    const renderRoutePagination = (playlistCount: number) => {
      const pagiInfo: PagiInfo = {
        total: playlistCount,
        sizeArr: Array(3)
          .fill(0)
          .map((v, i) => defaultLimit * ++i),
        offset: route.query.offset as string,
        limit: defaultLimit,
      };
      return <RoutePagination pagiInfo={pagiInfo}></RoutePagination>;
    };

    return () => {
      const {
        playlist: { playlists, playlistCount },
      } = searchData;
      return (
        <section class="search-songlist">
          {
            playlists.map(
              ({
                coverImgUrl,
                creator,
                trackCount,
                id,
                name,
                playCount,
                bookCount,
                subscribed,
              }) => (
                <div
                  class="search-songlist-item"
                  onClick={() => toPlaylistDetailPage(id)}
                >
                  <img loading="lazy" src={coverImgUrl} alt="" />
                  <em class="songlist-name">{`${name}`}</em>
                  <em class="songlist-trackcount">
                    {`${getLocaleCount(trackCount)}首`}
                  </em>
                  <em class="songlist-creator" singallinedot>
                    {`by  `}
                    <span
                      onClickCapture={() => toCreatorDetailPage(creator.userId)}
                    >
                      {creator.nickname}
                    </span>
                  </em>
                  <em class="songlist-collection">
                    {`收藏：${getLocaleCount(bookCount)}`}
                  </em>
                  <em class="songlist-listen">
                    {`收听：${getLocaleCount(playCount)}`}
                  </em>
                </div>
              )
            )
          }
          {renderRoutePagination(playlistCount)}
        </section>
      );
    };
  },
});
