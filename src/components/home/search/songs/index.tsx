import {
  markRaw,
  onMounted,
  ref,
  toRef,
  watch,
  toRefs,
  shallowReactive,
  defineComponent,
} from "vue";
import {
  LocationQuery,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  RouteQueryAndHash,
  useRoute,
  useRouter,
} from "vue-router";
import { searchCloud } from "@api/search";
import "./index.scss";
import MusicList from "@/widgets/music-list";

export default defineComponent({
  name: "SearchSongs",
  setup(props, context) {
    const route = useRoute();

    const songlistData = shallowReactive({
      songCount: 0,
      songs: [],
    });

    const getSearchSongs = async (query: LocationQuery) => {
      const { type, keywords } = query as PlainObject<string>;
      const { data = {} } = await searchCloud({
        type,
        keywords,
      });
      const { result } = data;
      result &&
        ((songlistData.songCount = result.songCount),
          (songlistData.songs = result.songs));
    };

    getSearchSongs(route.query);

    onBeforeRouteUpdate((to, from, next) => {
      getSearchSongs(to.query);
      next();
    });

    return () => {
      return (
        <section class="search-radio">
          <MusicList musiclists={songlistData.songs} cols={4}></MusicList>
        </section>
      );
    };
  },
});
