import { ref, onDeactivated, onActivated, defineComponent } from "vue";
import { ElLoading } from "element-plus";
import "./index.scss";

export type InfinityScrollingDefaultSlotArg = {
  currentCount: number;
};

export default defineComponent({
  name: "InfinityScrolling",
  emits: ["update:currentCount"],
  props: {
    sliceInterval: {
      type: [Number, String],
      required: false,
      default: 10,
    },
    total: {
      type: [Number, String],
      required: false,
      default: Infinity,
    },
    baseCount: {
      type: [Number, String],
      required: false,
      default: 10,
    },
  },
  setup(props, { slots, emit }) {
    const isloading = ref(false);
    const curCount = ref(+props.baseCount);
    const disabled = ref(false);
    let loadingIns: any;
    const deferLoader = () => {
      isloading.value = true;
      loadingIns = ElLoading.service({
        target: ".scroll-loading",
        lock: true,
        spinner: "el-icon-loading",
        text: "加载中...",
      });
      setTimeout(() => {
        curCount.value += +props.sliceInterval;
        isloading.value = false;
        disabled.value = curCount.value >= props.total;
        loadingIns.close();
      }, 1000);
    };

    onDeactivated(() => {
      disabled.value = true;
    });

    onActivated(() => {
      disabled.value = false;
    });

    const renderSlot = () =>
      slots.default ? (
        slots.default({
          currentCount: curCount.value,
        } as InfinityScrollingDefaultSlotArg)
      ) : (
        <span>内容为空</span>
      );

    return () => {
      return (
        <section
          class="infinity-scrolling"
          v-infinite-scroll={deferLoader}
          infinite-scroll-immediate={false}
          infinite-scroll-distance={30}
          infinite-scroll-delay={500}
          infinite-scroll-disabled={disabled.value}
        >
          {renderSlot()}
          <div class="scroll-loading" v-show={isloading.value}></div>
        </section>
      );
    };
  },
});
