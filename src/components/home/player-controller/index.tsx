import { defineComponent } from "vue";
import "./index.scss";

export default defineComponent({
  name: "PlayerController",
  setup(props, { slots, emit }) {
    return () => {
      return <section class="player-controller">controller</section>;
    };
  },
});
