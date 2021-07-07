import { getLocaleDate, msSecondToTimeStr } from "@/utils";
import {
  defineComponent,
  markRaw,
  watch,
  onMounted,
  WatchStopHandle,
  onActivated,
  watchEffect,
  ref,
  inject,
  reactive,
  computed,
  PropType,
} from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { SearchCloundData } from "../index";
import "./index.scss";
import { SearchLyricItem } from "@/types/lyric";
import { EMPTY_OBJ } from "@/utils/constant";
import RoutePagination, { PagiInfo } from "@widgets/route-pagination";

const defaultSearchLyricInfo = {
  offset: 0,
  limit: 30,
  sizeArr: Array(3)
    .fill(0)
    .map((v, i) => 30 * (i + 1)),
};

//渲染歌词内容
const renderLyricContent = (
  lyrics: SearchLyricItem["lyrics"],
  lineCount?: number
) => {
  Number.isFinite(lineCount) && (lyrics = lyrics.slice(0, lineCount));
  return lyrics.map((item) => `<li>${item}</li>`).join("");
};

//歌词元素
export const LyricContentItem = defineComponent({
  name: "LyricContentItem",
  props: {
    lyricData: {
      type: Object as PropType<SearchLyricItem>,
      requried: true,
    },
  },
  //解构props值将会丢失其响应式
  setup({ lyricData }, { slots, emit }) {
    if (!lyricData) return;
    const { name, alia, ar, lyrics, al, dt } = lyricData;
    const router = useRouter();

    //前往歌手详情界面
    const toArtistDetailPage = (id: number) =>
      router.push({
        path: "/artist",
        query: { id },
      });

    //歌词是否已经展开
    const isSpreaded = ref(false);
    //歌词显示的行数
    const briefLineCount = computed(() => (isSpreaded.value ? Infinity : 4));
    //切换歌词展开状态
    const switchSpreadStatus = () => (isSpreaded.value = !isSpreaded.value);
    //渲染歌手名字dom
    const renderArtists = () => {
      const lastIdx = ar.length - 1;
      return ar.map(({ name, id }, i) => (
        <>
          <span onClick={() => toArtistDetailPage(id)}>{name}</span>
          {lastIdx > i && " / "}
        </>
      ));
    };
    const artists = ar.map(({ name }) => name).join("/");
    const albumName = `《${al.name}》`;
    const duration = msSecondToTimeStr(dt);
    return () => (
      <section class="search-lyric-item">
        <div className="song-info">
          <em class="song-name" singalLineDot title={name}>
            {name}
          </em>
          <em class="song-artist" title={artists}>
            {renderArtists()}
          </em>
          <em class="song-album" singalLineDot title={albumName}>
            {albumName}
          </em>
          <em class="song-duration" singalLineDot title={duration}>
            {duration}
          </em>
        </div>
        <div className="lyric-wrap">
          <ul
            class="lyric-container"
            v-html={renderLyricContent(lyrics, briefLineCount.value)}
          ></ul>
          <div class="lyric-tool">
            <span class="spread-text" onClick={switchSpreadStatus}>
              {isSpreaded.value ? "收起歌词" : "展开歌词"}
            </span>
            <span class="copy-text">复制歌词</span>
          </div>
        </div>
      </section>
    );
  },
});

export default defineComponent({
  name: "SearchLyric",
  setup(props, context) {
    const route = useRoute();
    const searchData = inject<SearchCloundData>("searchCloundData")!;
    const {
      sizeArr,
      limit: dftLimit,
      offset: dftOffset,
    } = defaultSearchLyricInfo;
    const lyricPagiInfo = reactive<PagiInfo>({
      sizeArr,
      total: 0,
      limit: dftLimit,
      offset: dftOffset,
    });

    watchEffect(() => {
      lyricPagiInfo.total = searchData.lyric.songCount;
    });

    let lyricRouteWatcher: WatchStopHandle;
    onActivated(() => {
      lyricRouteWatcher = watch(
        () => route.query,
        async (query, oldQuery) => {
          const { limit, offset } = query as PlainObject<string>;
          lyricPagiInfo.limit = limit;
          lyricPagiInfo.offset = offset;
        },
        {
          immediate: true,
        }
      );
    });

    onBeforeRouteLeave(() => {
      lyricRouteWatcher();
    });

    return () => {
      const {
        lyric: { songs, songCount },
      } = searchData;
      return (
        <>
          <section class="search-lyric">
            {
              songs?.map((item) =>
                <LyricContentItem lyricData={item}></LyricContentItem>
              )
            }
          </section>
          <RoutePagination pagiInfo={lyricPagiInfo}></RoutePagination>
        </>
      );
    };
  },
});
