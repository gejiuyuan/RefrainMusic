import { UNICODE_CHAR } from "@/utils";
import { computed, defineComponent, ref, shallowReactive } from "vue";
import './index.scss';

/**  
 * 评论等内容回复的公共组件
 */
export default defineComponent({
  name: "ReplyTextarea",
  setup() {
    
    return () => {
      return (
        <section class="reply-container">
          <div class="reply-textarea">
            <custom-textarea
              placeholder={`赶快输入⑧${UNICODE_CHAR.pensive}`}
              focus={true}
            ></custom-textarea>
          </div>
        </section>
      )
    }
  }
})