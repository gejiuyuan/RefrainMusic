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
import { COMPONENT_NAME, PAGE_SIZE } from "@/utils/preference";

const defaultLimit = PAGE_SIZE[COMPONENT_NAME.USER_COLLECTION];

export default defineComponent({
  name: COMPONENT_NAME.USER_COLLECTION,
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
            <Songlist playlists={data} hasMore={hasMore} defaultLimit={defaultLimit}></Songlist>
          </section>
        </section>
      )
    };
  },
});
