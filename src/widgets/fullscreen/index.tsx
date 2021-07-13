import {
  markRaw,
  onMounted,
  ref,
  reactive,
  computed,
  defineComponent,
  watch,
  getCurrentInstance,
} from "vue";
import "./index.scss";

import { useBetterFullscreen } from "@/use";

export default defineComponent({
  name: "FullScreen",
  setup(props, { slots, emit }) {
    const { isSupported, toggle, isFullscreen } = useBetterFullscreen();

    if (!isSupported) {
      return
    }

    return () => { 
      const fullStatus = isFullscreen.value;
      return (
        <section class="yplayer-header-fullscreen" onClick={toggle}>
          <i class="iconfont icon-fullscreen" title="进入全屏" hidden={fullStatus}></i>
          <i class="iconfont icon-cancelfullscreen" title="取消全屏" hidden={!fullStatus}></i>
        </section>
      );
    };
  },
});
