import {
  inject,
  computed,
  Ref,
  defineComponent,
  provide,
} from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import Songlist from "@widgets/song-list";
import "./index.scss";

export default defineComponent({
  name: "UserSonglist",
  components: {
    Songlist,
  },
  setup(props, context) {
    const router = useRouter();
    const id = Number(router.currentRoute.value.query.id);
    const songlists = inject("songlists") as any;

    return () => {
      const { created: { data, hasMore } } = songlists;
      console.info(songlists)
      return (
        <section class="user-songlist">
          <section class="songlist-layer songlist-created">
            <h5 class="songlist-title">
              创建的
              <span>{data.length}</span>
            </h5>
            <Songlist playlists={data} hasMore={hasMore}></Songlist>
          </section>

        </section>
      );
    };
  },
});
