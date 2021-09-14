import { 
  shallowReactive,
  defineComponent,
} from "vue";
import { 
  RouteLocationNormalized, 
  useRoute,
  useRouter,
} from "vue-router";
import { searchCloud } from "@api/search";
import "./index.scss";
import MusicList from "@/widgets/music-list";
import { onFilteredBeforeRouteUpdate } from "@/hooks/onRouteHook";

export default defineComponent({
  name: "SearchSongs",
  setup(props, context) {
    const route = useRoute();

    const songlistData = shallowReactive({
      songCount: 0,
      songs: [],
    });

    const getSearchSongs = async ({ query }: RouteLocationNormalized) => {
      const { type, keywords } = query as PlainObject<string>;
      const { result } = await searchCloud({
        type,
        keywords,
      });
      result &&
        ((songlistData.songCount = result.songCount),
          (songlistData.songs = result.songs));
    };
    getSearchSongs(route);

    onFilteredBeforeRouteUpdate((to) => { 
      getSearchSongs(to);
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
