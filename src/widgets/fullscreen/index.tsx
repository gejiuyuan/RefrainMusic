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

    const fscreenInfo = computed(() => {
      let val = '', title = '';
      if (isFullscreen.value) {
        val = "cancelFullscreen";
        title = "退出全屏";
      }
      else {
        val = "fullscreen";
        title = "进入全屏";
      }
      return { val, title };
    });

    return () => {
      const fsInfo = fscreenInfo.value;
      return (
        <section class="yplayer-header-fullscreen" onClick={toggle}>
          <i data-icon-type={fsInfo.val} title={fsInfo.title}>
            <svg class="icon icon-fullscreen" aria-hidden="true">
              <use xlinkHref={`#icon-${fsInfo.val}`}></use>
            </svg>
          </i>
        </section>
      );
    };
  },
});
