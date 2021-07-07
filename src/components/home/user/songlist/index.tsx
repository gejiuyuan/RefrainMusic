import {
  ref,
  toRefs,
  watch,
  shallowReactive,
  reactive,
  inject,
  computed,
  Ref,
  defineComponent,
} from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import Songlist from "@widgets/song-list";
import { PlaylistCommon } from "@/types/songlist";
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
      const { created, collection } = songlists;
      return (
        <section class="user-songlist">
          <section class="songlist-layer songlist-created">
            <h5 class="songlist-title">
              创建的
              <span>{created.length}</span>
            </h5>
            <Songlist playlists={created}></Songlist>
          </section>
          <section class="songlist-layer songlist-collection">
            <h5 class="songlist-title">
              收藏的
              <span>{collection.length}</span>
            </h5>
            <Songlist playlists={collection}></Songlist>
          </section>
        </section>
      );
    };
  },
});
