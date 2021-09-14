import { reactive, shallowReactive, onActivated, defineComponent, ref } from "vue";
import {
  useRouter,
  onBeforeRouteUpdate,
  RouteLocationNormalized,
} from "vue-router";
import "./index.scss";

import { getLocaleDate, padPicCrop, EMPTY_OBJ, freeze } from "@utils/index";
import { artistAlbum } from "@api/singer";
import { AlbumInfo } from "@/types/album";
import RoutePagination from "@/widgets/route-pagination";
import AlbumList from "@/widgets/album-list";
import { COMPONENT_NAME, PAGE_SIZE } from "@/utils/preference";
import { onFilteredBeforeRouteUpdate } from "@/hooks/onRouteHook";

const defaultSingerALbumLimit = PAGE_SIZE[COMPONENT_NAME.ARTIST_ALBUM];

export interface RealAlbumInfo {
  albumList: AlbumInfo[];
  hasMore: boolean;
}

export default defineComponent({
  name: COMPONENT_NAME.ARTIST_ALBUM,
  setup(props, { slots, emit }) {
    const router = useRouter(); 
    const albumInfo = shallowReactive<RealAlbumInfo>({
      albumList: [],
      hasMore: true,
    }); 
 
    const getAlbum = async (route: RouteLocationNormalized) => {
      const { id, limit = defaultSingerALbumLimit, offset } = route.query as PlainObject;
      const { hotAlbums = [], more } = await artistAlbum({
        id,
        limit,
        offset,
      });
      albumInfo.hasMore = more; 
      hotAlbums.forEach((item: AlbumInfo) => {
        item.publishTimeStr = getLocaleDate(item.publishTime, {
          delimiter: "-",
          divide: "day",
        });
      });
      albumInfo.albumList = freeze(hotAlbums);
    };

    onActivated(() => {
      getAlbum(router.currentRoute.value);
    });

    onFilteredBeforeRouteUpdate((to) => {
      getAlbum(to);
    });
 
    return () => (
      <>
        <section class="yplayer-artist-album">
          <AlbumList 
            albumList={albumInfo.albumList} 
            hasMore={albumInfo.hasMore}
            defaultLimit={PAGE_SIZE[COMPONENT_NAME.ARTIST_ALBUM]}
          ></AlbumList>
        </section>
      </>
    );
  },
});
