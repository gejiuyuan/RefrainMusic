import { defineComponent } from "vue";
import { NPagination } from "naive-ui";

export default defineComponent({
  name: "NaivePagination",
  setup(props, { slots, emit }) {
    return () => {
      return <section class="naive-pagination"></section>;
    };
  },
});
