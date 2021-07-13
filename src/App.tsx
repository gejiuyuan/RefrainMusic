import { computed, defineComponent, reactive, toRef, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import "./App.scss";
import Player from '@views/player';
import usePlayerStore from "./stores/player";
import { NBackTop } from "naive-ui";


export default defineComponent({
  name: "YuanPlayer",
  setup(props, context) {

    const playerStore = usePlayerStore();
    const themeLayerStyle = computed(() => {
      return `--theme:${playerStore.theme};`
    })
    return () => {
      return (
        <section class="theme-layer" style={themeLayerStyle.value}>
          <RouterView></RouterView>
          <Player></Player>

          <NBackTop
            listenTo=".player-container"
            visibilityHeight={320}
            bottom={90}
            themeOverrides={{
              width: "38px",
              height: "38px",
              iconSize: "20px",
            }}
          ></NBackTop>
        </section>
      );
    };
  },
});
