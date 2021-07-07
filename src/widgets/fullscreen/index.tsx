import {
  markRaw,
  onMounted,
  ref,
  reactive,
  computed,
  defineComponent,
} from "vue";
import fscreen from "fscreen";
import "./index.scss";

export type Fullscreen = {
  isFulled: boolean;
  willFullEl: HTMLElement | null;
  type: "full" | "cancelFull";
};

export default defineComponent({
  name: "FullScreen",
  setup(props, { slots, emit }) {
    const fullscreen = reactive<Fullscreen>({
      willFullEl: null,
      isFulled: false,
      type: "full",
    });

    const fullscreenType = computed(() => {
      const isFulled = fullscreen.isFulled;
      const fullType = { val: "", title: "" };
      if (isFulled) {
        fullType.val = "cancelFullscreen";
        fullType.title = "退出全屏";
      } else {
        fullType.val = "fullscreen";
        fullType.title = "进入全屏";
      }
      return fullType;
    });

    //切换全屏
    const switchFullscreen = () => {
      !fullscreen.isFulled
        ? fscreen.requestFullscreen(fullscreen.willFullEl)
        : fscreen.exitFullscreen();
    };

    //设置isFulled是否处于全屏属性
    const setFulled = (flag?: boolean) => {
      return (fullscreen.isFulled =
        flag === void 0 ? !fullscreen.isFulled : flag);
    };

    const initFullscreenHandler = () => {
      const el = document.querySelector("body") as HTMLElement;
      fullscreen.willFullEl = el;
      //全屏改变事件（F11全屏切换的默认行为无法监听到，所以要清除）
      fscreen.addEventListener("fullscreenchange", () => {
        setFulled(fscreen.fullscreenElement === el);
      });
      window.addEventListener("keyup", (ev: KeyboardEvent) => {
        ev.key === "F11" && switchFullscreen();
      });
    };

    onMounted(() => {
      initFullscreenHandler();
    });

    return () => {
      const fscreenType = fullscreenType.value;
      return (
        <section class="yplayer-header-fullscreen" onClick={switchFullscreen}>
          <i data-icon-type={fscreenType.val} title={fscreenType.title}>
            <svg class="icon icon-fullscreen" aria-hidden="true">
              <use xlinkHref={`#icon-${fscreenType.val}`}></use>
            </svg>
          </i>
        </section>
      );
    };
  },
});
