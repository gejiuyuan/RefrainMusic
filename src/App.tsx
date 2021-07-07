import { defineComponent, reactive, toRef } from "vue";
import { RouterView } from "vue-router";
import "./App.scss";

export default defineComponent({
  name: "YuanPlayer",
  setup(props, context) {
    return () => {
      return (
        <main id="Yuan-Player">
          <section class="yplayer-homepage">
            <RouterView></RouterView>
          </section>
        </main>
      );
    };
  },
});
