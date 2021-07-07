import {
  defineComponent,
  markRaw,
  onMounted,
  reactive,
  readonly,
  ref,
} from "vue";
import "./index.scss";

export default defineComponent({
  name: "Setting",
  setup(props, context) {
    return () => {
      return <section class="yplayer-setting-page">设置</section>;
    };
  },
});
