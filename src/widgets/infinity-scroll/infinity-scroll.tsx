import { createVNode, ref, defineComponent, withDirectives, onDeactivated, onActivated, vShow } from "vue";
import VInfiniteScroll from ".";
import { messageBus } from '@utils/event/register';
import { UNICODE_CHAR } from "@/utils";

export default defineComponent({
  name: "YuanInfinityScroll",
  props: {
    sliceInterval: {
      type: [Number, String],
      required: false,
      default: 20,
    },
    total: {
      type: [Number, String],
      required: false,
      default: Infinity,
    },
    baseCount: {
      type: [Number, String],
      required: false,
      default: 20,
    },
  },
  setup(props, { emit, slots }) {

    const isloading = ref(false);
    const curCount = ref(+props.baseCount);
    const disabled = ref(false); 
    const deferLoader = () => {
      isloading.value = true;
      // messageBus.dispatch('startLoading');
      setTimeout(() => {
        curCount.value += +props.sliceInterval;
        isloading.value = false;
        disabled.value = curCount.value >= props.total; 
        // messageBus.dispatch('finishLoading');
      }, 1000);
    };

    onDeactivated(() => {
      disabled.value = true;
    });

    onActivated(() => {
      disabled.value = false;
    });
 
    const renderWrapTemplate = () => (
      createVNode(
        'div',
        {
          class: "infinity-scrolling",
          'infinite-scroll-delay': 500,
          'infinite-scroll-immediate': false,
          'infinite-scroll-distance': 30,
          'infinite-scroll-disabled': disabled.value,
        },
        [
          slots.default!(curCount.value),
          createVNode('div', 
            {
              class: "scroll-loading",
              style: "padding: 2em 0;text-align: center",
              visibility: isloading.value,
            },
            `正在加载${UNICODE_CHAR.hugface}...`
          )
        ]
      )
    );

    return () => {
      return (
        withDirectives(
          renderWrapTemplate(),
          [
            [
              VInfiniteScroll,
              deferLoader,
            ]
          ]
        ) 
      )
    } 

  }
});