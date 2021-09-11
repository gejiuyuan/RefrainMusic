import { defineComponent } from "vue";
import {
  useRouter,
  useRoute,
  RouteLocationNormalized,
  onBeforeRouteUpdate,
} from "vue-router";
import "./index.scss";

export default defineComponent({
  name: "songlistComment",
  setup(props, context) {
    const route = useRoute();

    return () => {
      return <section class="songlist-comment">评论</section>;
    };
  },
});
