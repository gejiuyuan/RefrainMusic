import { NOOP } from "@/utils";
import Vue, { defineComponent } from "vue";
import "./index.scss";

export default defineComponent({
  name: "FollowButton",
  props: {
    followed: {
      type: Boolean,
      required: false,
      default: false,
    },
    onClick: {
      type: Function,
      required: false,
      default: NOOP,
    },
  },
  setup(props, { emit, slots }) {
    return () => {
      const { followed, onClick } = props;
      return (
        <button
          class="yplayer-follow-button"
          follow-ed={followed}
          onClick={onClick as any}
        >
          {
            !followed
              ? (
                <span> + 关注 </span>
              )
              : (
                <span class="followed"> 已关注 </span>
              )
          }
        </button>
      );
    };
  },
});
