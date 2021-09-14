import {
  markRaw,
  onMounted,
  readonly,
  ref,
  defineComponent,
  shallowReactive,
  reactive,
  WatchStopHandle,
  onActivated,
  watch,
} from "vue";
import "./index.scss";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { newAlbumPutOn } from "@/api/playlist";
import { NRadioButton, NRadioGroup } from "naive-ui";
import { EMPTY_OBJ } from "@/utils";
import AlbumList from "@/widgets/album-list";
import { onFilteredBeforeRouteUpdate, RouteHookNames } from "@/hooks/onRouteHook";

export const areaKeyList = [
  { key: 'ALL', area: '全部' },
  { key: 'ZH', area: '华语' },
  { key: 'EA', area: '欧美' },
  { key: 'KR', area: '韩国' },
  { key: 'JP', area: '日本' },
]

const typeKeyList = [
  { key: 'new', type: '最新' },
  { key: 'hot', type: '热门' }
]

const defaultDiscInfos = {
  area: areaKeyList[0].key,
  type: typeKeyList[0].key,

}

export type ListMap = PlainObject<{
  weekData: any[],
  monthData: any[],
} | undefined>

export default defineComponent({
  name: "MusicHallNewdisc",
  setup(props, context) {

    const route = useRoute();
    const router = useRouter();

    const { area: defaultAreaKey, type: defaultTypeKey } = defaultDiscInfos;
    const listMap = areaKeyList.reduce<ListMap>((map, { key }) => {
      map[key] = void 0;
      return map;
    }, {});

    const newDiscInfos = reactive({
      listMap,
      hasMore: false,
    });
 
    const routeUpdateHandler = async (
      toQuery: PlainObject,
      fromQuery?: PlainObject,
    ) => {
      const {
        area = defaultAreaKey,
        type = defaultTypeKey,
        limit,
        year,
        month,
        offset,
      } = toQuery;
      const { type: oldType } = fromQuery || EMPTY_OBJ;
      if (type !== oldType || !newDiscInfos.listMap[area]) { 
        const { hasMore, weekData, monthData } = await newAlbumPutOn({
          area, limit, type, year, month, offset
        });
        newDiscInfos.hasMore = hasMore;
        newDiscInfos.listMap[area] = {
          weekData, monthData
        }
      }
    }
    routeUpdateHandler(route.query);
    onFilteredBeforeRouteUpdate((to, from) => {
      routeUpdateHandler(to.query, from.query);
    });

    const areaChange = (areaKey: string | number) => {
      router.push({
        path: route.path,
        query: {
          ...route.query,
          area: areaKey
        }
      })
    }

    const typeChange = (typeKey: string | number) => {
      router.push({
        path: route.path,
        query: {
          ...route.query,
          type: typeKey
        }
      })
    }

    return () => {
      const {
        area = defaultAreaKey,
        type = defaultTypeKey,
      } = route.query as any;

      const { listMap, hasMore } = newDiscInfos;
      const { weekData, monthData } = listMap[area]! || EMPTY_OBJ;
      return (
        <section class="newestdisc">

          <section class="newestdisc-layer">
            <NRadioGroup
              value={type}
              onUpdateValue={typeChange}
              size="small"
            >
              {
                typeKeyList.map(item =>
                  <NRadioButton
                    key={item.key}
                    value={item.key}
                  >
                    {item.type}
                  </NRadioButton>
                )
              }
            </NRadioGroup>
          </section>

          <section class="newestdisc-layer">
            <NRadioGroup
              value={area}
              onUpdateValue={areaChange}
              size="small"
            >
              {
                areaKeyList.map(item =>
                  <NRadioButton
                    key={item.key}
                    value={item.key}
                  >
                    {item.area}
                  </NRadioButton>
                )
              }
            </NRadioGroup>
          </section>

          <section class="newestdisc-layer">
            <h4 class="disc-title">
              本周新碟
            </h4>
            {
              weekData && (
                <AlbumList albumList={weekData} gaps={{ x: 60, y: 50 }} isNew={true}></AlbumList>
              )
            }
          </section>

          <section class="newestdisc-layer">
            <h4 class="disc-title">
              本月新碟
            </h4>
            {
              monthData && (
                <AlbumList albumList={monthData} gaps={{ x: 60, y: 50 }} isNew={true}></AlbumList>
              )
            }
          </section>


        </section>
      );
    };
  },
});
