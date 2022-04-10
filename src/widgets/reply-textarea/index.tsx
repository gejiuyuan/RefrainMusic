import { computed, defineComponent, ref, shallowReactive } from "vue"; 
import './index.scss';

/**  
 * 评论等内容回复的公共组件
 */
export default defineComponent({
  name: "ReplyTextarea",
  setup() {

    const rowCount = ref<number>(1);
    const fixedSize = {
      font: 12,
      lineHeight: 1.5,
    }

    const textareaStyle = computed(() => {
      return {
        'font-size': `${fixedSize.font}px`,
        'line-height': fixedSize.lineHeight,
        height: `${rowCount.value * fixedSize.font * fixedSize.lineHeight}px`,
      }
    });

    const changeHandler = (ev: Event) => {
      console.dir(ev)
    }
 
    return () => {
      return (
        <section class="reply-container">
          <div class="reply-textarea" contenteditable="true" style={textareaStyle.value} onChange={changeHandler}></div>
        </section>
      )
    }
  }
})