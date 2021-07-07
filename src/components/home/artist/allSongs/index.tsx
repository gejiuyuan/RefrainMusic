import { shallowReactive, toRefs, onActivated, defineComponent } from "vue";
import {
  useRouter,
  useRoute,
  onBeforeRouteUpdate,
  RouteLocationNormalized,
} from "vue-router";

import SongTable from "@/widgets/song-table";
import RoutePagination from "@widgets/route-pagination";
import { EMPTY_OBJ, freeze } from "@/utils/constant";

import { SongInfo } from "@/types/song";

import { artistSongs } from "@api/singer";
import "./index.scss";

const orders = [
  { text: "最新", key: "time" },
  { text: "热门", key: "hot" },
];

const defaultAllSongs = {
  order: orders[0].key,
  limit: 30,
  offset: 0,
};

export default defineComponent({
  name: "ArtistAllSongs",
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();

    const {
      order: dftOrder,
      limit: dftLimit,
      offset: dftOffset,
    } = defaultAllSongs;

    const songPagiInfo = shallowReactive({
      limit: dftLimit,
      offset: dftOffset,
      order: dftOrder,
      sizeArr: Array(3)
        .fill(0)
        .map((v, i) => dftLimit * (i + 1)),
    });

    const songsData = shallowReactive({
      songList: [] as SongInfo[],
    });

    const getAllSongs = async (route: RouteLocationNormalized) => {
      const {
        id,
        limit = dftLimit,
        offset = dftOffset,
        order = dftOrder,
      } = route.query as any;

      const { data = {} } = await artistSongs({
        id,
        limit,
        offset,
        order,
      });
      const { songs = [] } = data;
      songsData.songList = freeze(songs);
    };

    onActivated(() => {
      getAllSongs(route);
    });

    onBeforeRouteUpdate((to, from, next) => {
      getAllSongs(to);
      next();
    });

    const handleOrderChange = (order: string) =>
      router.push({ path: route.path, query: { ...route.query, order } });

    return () => {
      const { songList } = toRefs(songsData);
      return (
        <section class="yplayer-artist-allSongs">
          <section class="allSongs-header">
            <section class="allSong-order">
              {orders.map((item, i) => {
                <elRadio
                  key={item.key}
                  v-model={songPagiInfo.order}
                  label={item.key}
                  onChange={handleOrderChange}
                >
                  {item.text}
                </elRadio>;
              })}
            </section>
          </section>
          <section class="allSongs-wrap">
            <SongTable dataList={songList.value}></SongTable>
          </section>
          <section class="allSongs-pagination">
            <RoutePagination pagiInfo={songPagiInfo}></RoutePagination>
          </section>
        </section>
      );
    };
  },
});
