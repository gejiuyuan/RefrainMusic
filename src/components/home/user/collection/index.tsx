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
} from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import "./index.scss";

export default defineComponent({
  name: "UserCollection",
  setup(props, context) {
    return () => {
      return <section class="user-collection"></section>;
    };
  },
});
