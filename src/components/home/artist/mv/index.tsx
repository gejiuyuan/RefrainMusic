import { shallowReactive, onActivated, defineComponent, ref } from "vue";
import {
  useRouter,
  useRoute,
  RouteLocationNormalized,
  onBeforeRouteUpdate,
} from "vue-router";

import { getLocaleDate, getLocaleCount, padPicCrop, freeze } from "@utils/index";
import { artistAlbum, artistMv } from "@api/singer";
import { Mv } from "@/types/mv";
import "./index.scss";
import RoutePagination from "@widgets/route-pagination";
import { COMPONENT_NAME, PAGE_SIZE } from "@/utils/preference";

const defaultSingalMvInfo = {
  limit: PAGE_SIZE[COMPONENT_NAME.ARTIST_MV],
  offset: 0,
};

export interface RealMvInfo {
  mvList: Mv[];
}

export default defineComponent({
  name: COMPONENT_NAME.ARTIST_MV,
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();

    const { limit: dftLimit, offset: dftOffset } = defaultSingalMvInfo;

    const mvInfo = shallowReactive<RealMvInfo>({
      mvList: [],
    });
    const hasMore = ref(true);
    const mvPagiInfo = shallowReactive({
      limit: dftLimit,
      offset: dftOffset,
      sizeArr: Array(3)
        .fill(0)
        .map((v, i) => dftLimit * (i + 1)),
    });

    const getArtistMvs = async (route: RouteLocationNormalized) => {
      const { id, limit = dftLimit, offset = dftOffset } = route.query as any;
      const { data = {}, hasMore: more } = await artistMv({
        id,
        limit,
        offset,
      });
      const { mvs = [] } = data;
      hasMore.value = more;
      mvPagiInfo.limit = limit;
      mvPagiInfo.offset = offset;
      mvs.forEach((item: Mv) => {
        item.playCountStr = getLocaleCount(item.playCount);
      });
      mvInfo.mvList = freeze(mvs);
    };

    onActivated(() => {
      getArtistMvs(route);
    });

    onBeforeRouteUpdate((to, from, next) => {
      getArtistMvs(to);
      next();
    });

    const mvWrapRenderer = (mvList: Mv[]) => {
      return (
        <section class="mv-wrap">
          {
            mvList.map((item) =>
              <div class="mv-item" key={item.id}>
                <img
                  loading="lazy"
                  src={padPicCrop(item.imgurl16v9, { x: 240, y: 160 })}
                  alt={item.name}
                  title={item.name}
                />
                <h6>{item.name}</h6>
                <p>{item.publishTime}</p>
                <em class="playCount">{item.playCountStr}</em>
              </div>
            )
          }
        </section>
      );
    };

    return () => {
      const { mvList } = mvInfo;
      return (
        <>
          {
            mvList.length ?
              (
                <section class="yplayer-artist-mv">
                  {mvWrapRenderer(mvList)}
                  <div class="mv-pagination">
                    <RoutePagination pagiInfo={mvPagiInfo} hasMore={hasMore.value}></RoutePagination>
                  </div>
                </section>
              )
              : (
                <section class="mv-empty">
                  <span>这哩啥也没有喔~</span>
                </section>
              )
          }
        </>
      );
    };
  },
});
