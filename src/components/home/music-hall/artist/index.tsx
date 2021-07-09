import { shallowReactive, defineComponent } from "vue";
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

type SingerListInfo = {
  limit: number;
  offset: number;
  initial?: string;
  type?: string;
  area?: string;
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
  limit: 30,
  offset: 0,
};

export default defineComponent({
  name: "musicHallArtist",
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();

    const {
      limit: dftLimit,
      type: dftType,
      area: dftArea,
      initial: dftInitial,
      offset: dftOffset,
    } = defaultSingerInfo;

    const singerListInfo = shallowReactive<SingerListInfo>({
      limit: dftLimit,
      offset: dftOffset,
      initial: dftInitial,
      type: catList[0].text,
      area: areaList[0].text,
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
      const { data: willShowArtist } = await artistList({
        type,
        offset,
        area,
        initial: initial === dftInitial ? "" : initial,
        limit,
      });
      if (willShowArtist) {
        const { artists } = willShowArtist;
        singers.singerList = freeze(artists);
        singerListInfo.limit = +limit;
        singerListInfo.offset = +offset;
        singerListInfo.area = areaList.find(({ key }) => key == area)?.text;
        singerListInfo.type = catList.find(({ key }) => key == type)?.text;
        singerListInfo.initial = initialList.find(
          ({ key }) => key === initial
        )?.text;
      }
    };
    getArtistsInfo(route.query);

    onBeforeRouteUpdate((to, from, next) => {
      getArtistsInfo(to.query);
      next();
    });

    const areaChange = (areaText: string | number) => {
      router.push({
        query: {
          ...route.query,
          area: areaList.find(({ text }) => text == areaText)?.key ?? dftArea,
        },
      });
    }

    const typeChange = (typeText: string) =>
      router.push({
        query: {
          ...route.query,
          type: catList.find(({ text }) => text == typeText)?.key ?? dftType,
        },
      });

    const initialChange = (initialText: string) =>
      router.push({
        query: {
          ...route.query,
          initial:
            initialList.find(({ text }) => text === initialText)?.key ??
            dftInitial,
        },
      });

    return () => {
      return (
        <>
          <section class="singer-layer singer-area">
            <el-radio-group
              v-model={singerListInfo.area}
              size="mini"
              onChange={areaChange}
            >
              {
                areaList.map((item) =>
                  <el-radio-button
                    label={item.text}
                    key={item.text}
                  ></el-radio-button>
                )
              }
            </el-radio-group>
          </section>

          <section class="singer-layer singer-cat">
            <el-radio-group
              v-model={singerListInfo.type}
              size="mini"
              onChange={typeChange}
            >
              {
                catList.map((item) =>
                  <el-radio-button
                    label={item.text}
                    key={item.text}
                  ></el-radio-button>
                )
              }
            </el-radio-group>
          </section>

          <section class="singer-layer singer-char">
            <el-radio-group
              v-model={singerListInfo.initial}
              size="mini"
              onChange={initialChange}
            >
              {
                initialList.map((item) =>
                  <el-radio-button
                    label={item.text}
                    key={item.key}
                  ></el-radio-button>
                )
              }
            </el-radio-group>
          </section>

          <ArtistList singerList={singers.singerList} cols={8}></ArtistList>

          <section class="singer-layer singer-pagination">
            <RoutePagination pagiInfo={singerListInfo}></RoutePagination>
          </section>
        </>
      );
    };
  },
});
