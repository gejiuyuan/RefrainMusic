import { defineComponent, reactive, toRef, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import "./App.scss";
import Player from '@views/player';

export default defineComponent({
  name: "YuanPlayer",
  setup(props, context) {
    return () => {
      return (
        <>
          <RouterView></RouterView>
          <Player></Player>
        </>
      );
    };
  },
});
