import {
  toRefs,
  watch,
  ref,
  reactive,
  shallowReactive,
  shallowRef,
  Ref,
  computed,
  defineComponent,
  inject,
} from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import Songlist from "@widgets/song-list";
import "./index.scss";

export default defineComponent({
  name: "UserCollection",
  setup(props, context) {
    const songlists = inject("songlists") as any;
    return () => {
      const { collection: { data, hasMore } } = songlists;
      return (
        <section className="user-collection">

          <section class="songlist-layer songlist-collection">
            <h5 class="songlist-title">
              收藏的
              <span>{data.length}</span>
            </h5>
            <Songlist playlists={data} hasMore={hasMore}></Songlist>
          </section>
        </section>
      )
    };
  },
});
