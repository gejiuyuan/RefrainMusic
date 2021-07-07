import { defineComponent } from "vue";
import "./index.scss";

export default defineComponent({
  name: "HomeController",
  setup(props, { slots, emit }) {
    return () => {
      return <aside class="home-controller">controller</aside>;
    };
  },
});
