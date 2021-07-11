import {
  defineComponent,
  inject,
  watch,
  reactive,
  watchEffect,
  onActivated,
  WatchStopHandle,
} from "@vue/runtime-core";
import { markRaw, onMounted, ref } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { SearchCloundData } from "../index";
import "./index.scss";
import AlbumList from "@widgets/album-list";
import RoutePagination, { PagiInfo } from "@widgets/route-pagination";

const defaultSearchVideoInfo = {
  offset: 0,
  limit: 30,
  sizeArr: Array(3)
    .fill(0)
    .map((v, i) => 30 * (i + 1)),
};

export default defineComponent({
  name: "SearchAlbum",
  setup(props, context) {
    const route = useRoute();
    const {
      sizeArr,
      limit: dftLimit,
      offset: dftOffset,
    } = defaultSearchVideoInfo;
    const searchData = inject<SearchCloundData>("searchCloundData")!;
    const albumPagiConf = reactive<PagiInfo>({
      sizeArr,
      total: 0,
      limit: dftLimit,
      offset: dftOffset,
    });
    watchEffect(() => {
      albumPagiConf.total = searchData.album.albumCount;
    });

    let albumRouteWatcher: WatchStopHandle;
    onActivated(() => {
      albumRouteWatcher = watch(
        () => route.query,
        async (query, oldQuery) => {
          const { limit, offset } = query as PlainObject<string>;
          albumPagiConf.limit = limit;
          albumPagiConf.offset = offset;
        },
        {
          immediate: true,
        }
      );
    });

    onBeforeRouteLeave(() => {
      albumRouteWatcher();
    });

    return () => {
      const {
        album: { albums, albumCount },
      } = searchData;
      return (
        <>
          <section class="search-album">
            <AlbumList albumList={albums}></AlbumList>
          </section>
          <RoutePagination pagiInfo={albumPagiConf}></RoutePagination>
        </>
      );
    };
  },
});
