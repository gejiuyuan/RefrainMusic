import { defineComponent, onMounted } from "vue";
import { RouterView } from "vue-router";
import "./index.scss";

export default defineComponent({
  name: "HomeContent",
  setup(props, { slots, emit }) {
    return () => {
      return (
        <section class="home-content" scrollbar="auto">
          <RouterView></RouterView>
        </section>
      );
    };
  },
});
