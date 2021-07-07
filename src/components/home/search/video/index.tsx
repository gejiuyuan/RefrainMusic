import {
  computed,
  defineComponent,
  markRaw,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  shallowReactive,
  toRefs,
  watch,
  WatchStopHandle,
  inject,
  watchEffect,
} from "vue";
import {
  useRoute,
  useRouter,
  LocationQuery,
  onBeforeRouteUpdate,
  onBeforeRouteLeave,
} from "vue-router";
import { searchCloud } from "@api/search";
import { getLocaleCount, padPicCrop } from "@utils/index";
import "./index.scss";
import RoutePagination, { PagiInfo } from "@widgets/route-pagination";
import { SearchCloundData } from "../index";

const defaultSearchVideoInfo = {
  offset: 0,
  limit: 30,
  sizeArr: Array(3)
    .fill(0)
    .map((v, i) => 30 * (i + 1)),
};

export default defineComponent({
  name: "SearchVideo",
  setup(props, context) {
    const route = useRoute();
    const {
      sizeArr,
      limit: dftLimit,
      offset: dftOffset,
    } = defaultSearchVideoInfo;
    const videoPagiConf = reactive<PagiInfo>({
      sizeArr,
      total: 0,
      limit: dftLimit,
      offset: dftOffset,
    });
    const searchData = inject<SearchCloundData>("searchCloundData")!;

    watchEffect(() => {
      videoPagiConf.total = searchData.video.videoCount;
    });

    let videoRouteWatcher: WatchStopHandle;
    onActivated(() => {
      videoRouteWatcher = watch(
        () => route.query,
        async (query, oldQuery) => {
          const { limit, offset } = query as PlainObject<string>;
          videoPagiConf.limit = limit;
          videoPagiConf.offset = offset;
        },
        {
          immediate: true,
        }
      );
    });

    onBeforeRouteLeave(() => {
      videoRouteWatcher();
    });

    return () => {
      const {
        video: { videos, videoCount },
      } = searchData;
      videos.forEach((v: any) => {
        v.playTimeStr = getLocaleCount(v.playTime);
        v.userName = v.creator.map((item: any) => item.userName).join("、");
      });
      return (
        <>
          <section class="search-video">
            {
              videos.map((video) =>
                <section class="video-card" key={video.vid}>
                  <img
                    loading="lazy"
                    src={padPicCrop(video.coverUrl, { x: 280, y: 150 })}
                    alt=""
                  />
                  <div class="video-main">
                    <h5 class="video-title">{video.title}</h5>
                    <p class="video-info">
                      <span class="video-artist">{video.userName}</span>
                      <span class="video-playcount">{video.playTimeStr}</span>
                    </p>
                  </div>
                </section>
              )
            }
          </section>
          <RoutePagination pagiInfo={videoPagiConf}></RoutePagination>
        </>
      );
    };
  },
});
