import { reactive, shallowReactive, onActivated, defineComponent } from "vue";
import {
  useRouter,
  onBeforeRouteUpdate,
  RouteLocationNormalized,
} from "vue-router";
import "./index.scss";

import { getLocaleDate, padPicCrop } from "@utils/index";
import { artistAlbum } from "@api/singer";
import { AlbumInfo } from "@/types/album";

import RoutePagination from "@/widgets/route-pagination";
import { EMPTY_OBJ, freeze } from "@/utils/constant";

const defaultSingerAlbumInfo = {
  limit: 18,
  offset: 0,
};

export interface RealAlbumInfo {
  albumList: AlbumInfo[];
}

export default defineComponent({
  name: "ArtistAlbum",
  setup(props, { slots, emit }) {
    const router = useRouter();

    const { limit: dftLimit, offset: dftOffset } = defaultSingerAlbumInfo;

    const albumInfo = shallowReactive<RealAlbumInfo>({
      albumList: [],
    });

    const albumPagiInfo = reactive({
      limit: dftLimit,
      offset: dftOffset,
      sizeArr: Array(3)
        .fill(0)
        .map((v, i) => dftLimit * (i + 1)),
    });
    const getAlbum = async (route: RouteLocationNormalized) => {
      const { id, limit = dftLimit, offset = dftOffset } = route.query as any;
      const { data = {} } = await artistAlbum({
        id,
        limit,
        offset,
      });
      const { hotAlbums = [] } = data;

      albumPagiInfo.limit = +limit;
      albumPagiInfo.offset = +offset;

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

    onBeforeRouteUpdate((to, from, next) => {
      getAlbum(to);
      next();
    });

    return () => (
      <>
        <section class="yplayer-artist-album">
          <section class="album-wrap">
            {
              albumInfo.albumList.map((item, i) =>
                <div class="album-item" key={item.id}>
                  <img
                    loading="lazy"
                    src={padPicCrop(item.picUrl, { x: 180, y: 180 })}
                    alt={item.name}
                    title={item.name}
                  />
                  <h6>{item.name}</h6>
                  <p>{item.publishTimeStr}</p>
                </div>
              )
            }
          </section>
          <section class="album-pagination">
            <RoutePagination pagiInfo={albumPagiInfo}></RoutePagination>
          </section>
        </section>
      </>
    );
  },
});
