import { defineComponent, markRaw, onMounted, readonly, ref } from "vue";
import "./index.scss";

export default defineComponent({
  name: "onlineVideo",
  setup(props, context) {
    return () => {
      return <section class="online-video">在线视频</section>;
    };
  },
});
