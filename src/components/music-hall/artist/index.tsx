import { shallowReactive, defineComponent, ref } from "vue";
import {
  useRouter,
  useRoute,
  useLink,
  LocationQueryValue,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
} from "vue-router";

import { artistList } from "@api/singer";
import ArtistList from "@widgets/artist-list";
import RoutePagination from "@widgets/route-pagination";
import { freeze } from "@/utils";
import { SingerInfo } from "@/types/singer";
import "./index.scss";
import { NRadio, NRadioButton, NRadioGroup, NSpace } from "naive-ui";
import singer from "../../search/singer";
import { COMPONENT_NAME, PAGE_SIZE } from "@/utils/preference";

type SingerListInfo = {
  limit: number;
  offset: number;
  initial?: number;
  type?: number;
  area?: number;
  sizeArr: number[];
};

const catList = [
  { text: "全部", key: -1 },
  { text: "男歌手", key: 1 },
  { text: "女歌手", key: 2 },
  { text: "乐队", key: 3 },
];

const areaList = [
  { text: "全部", key: -1 },
  { text: "华语", key: 7 },
  { text: "欧美", key: 96 },
  { text: "日本", key: 8 },
  { text: "韩国", key: 16 },
  { text: "其它", key: 0 },
];

const initialList = [
  { text: "全部", key: "All" },
  ...Array(90 - 65 + 1)
    .fill("")
    .reduce((total, now, i) => {
      const char = String.fromCharCode(i + 65);
      total.push({ text: char, key: char });
      return total;
    }, []),
];

const defaultSingerInfo = {
  initial: initialList[0].key,
  type: catList[0].key,
  area: areaList[0].key,
  limit: PAGE_SIZE[COMPONENT_NAME.MUSICHALL_ARTIST],
  offset: 0,
};

export default defineComponent({
  name: COMPONENT_NAME.MUSICHALL_ARTIST,
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const hasMore = ref(true);

    const {
      limit: dftLimit,
      type: dftType,
      area: dftArea,
      initial: dftInitial,
      offset: dftOffset,
    } = defaultSingerInfo;

    const singerListInfo = shallowReactive<SingerListInfo>({
      ...defaultSingerInfo,
      sizeArr: Array(3)
        .fill(0)
        .map((v, i) => dftLimit * (i + 1)),
    });

    const singers = shallowReactive({
      singerList: [] as SingerInfo[],
    });

    const getArtistsInfo = async ({
      type = dftType,
      offset = dftOffset,
      initial = dftInitial,
      limit = dftLimit,
      area = dftArea,
    }) => {
      const { artists, more } = await artistList({
        type,
        offset,
        area,
        initial: initial === dftInitial ? "" : initial,
        limit,
      });
      singers.singerList = freeze(artists);
      singerListInfo.limit = +limit;
      singerListInfo.offset = +offset;
      singerListInfo.area = +area;
      singerListInfo.type = +type;
      singerListInfo.initial = initial;
      hasMore.value = more;
    };
    getArtistsInfo(route.query);

    onBeforeRouteUpdate((to, from, next) => {
      getArtistsInfo(to.query);
      next();
    });

    const areaChange = (areaKey: string | number) => {
      router.push({
        query: {
          ...route.query,
          area: areaKey
        },
      });
    }

    const typeChange = (typeKey: string | number) =>
      router.push({
        query: {
          ...route.query,
          type: typeKey
        },
      });

    const initialChange = (initialKey: string | number) =>
      router.push({
        query: {
          ...route.query,
          initial: initialKey
        },
      });

    return () => {
      return (
        <>
          <section class="singer-layer singer-area">
            <NRadioGroup
              value={singerListInfo.area}
              onUpdateValue={areaChange}
              size="small"
            >
              {
                areaList.map(item =>
                  <NRadioButton
                    key={item.key}
                    value={item.key}
                  >
                    {item.text}
                  </NRadioButton>
                )
              }
            </NRadioGroup>
          </section>

          <section class="singer-layer singer-cat">
            <NRadioGroup
              value={singerListInfo.type}
              onUpdateValue={typeChange}
              size="small"
            >
              {
                catList.map(item =>
                  <NRadioButton
                    key={item.key}
                    value={item.key}
                  >
                    {item.text}
                  </NRadioButton>
                )
              }
            </NRadioGroup>
          </section>

          <section class="singer-layer singer-char">
            <NRadioGroup
              value={singerListInfo.initial}
              onUpdateValue={initialChange}
              size="small"
            >
              {
                initialList.map(item =>
                  <NRadioButton
                    key={item.key}
                    value={item.key}
                  >
                    {item.text}
                  </NRadioButton>
                )
              }
            </NRadioGroup>
          </section>

          <ArtistList singerList={singers.singerList} cols={8}></ArtistList>

          <section class="singer-layer singer-pagination">
            <RoutePagination pagiInfo={singerListInfo} hasMore={hasMore.value}></RoutePagination>
          </section>
        </>
      );
    };
  },
});
