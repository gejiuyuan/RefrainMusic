import { defineComponent } from "vue"; 
import './index.scss';

/**  
 * 评论等内容回复的公共组件
 */
export default defineComponent({
  name: "ReplyTextarea",
  setup() {
 
    return () => {
      return (
        <section class="reply-textarea"></section>
      )
    }
  }
})