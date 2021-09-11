import { defineComponent } from "vue";
import './index.scss';

export default defineComponent({
  name: "Mv",
  setup(props, { slots, emit }) {

    return () => {
      return (
        <section class="mv-page">
          mv
        </section>
      )
    }

  }
})