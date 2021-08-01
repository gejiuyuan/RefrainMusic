import { computed, defineComponent, reactive, toRef, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import "./App.scss";
import Player from '@views/player';
import usePlayerStore from "./stores/player";
import { GlobalThemeOverrides, NBackTop, NConfigProvider, NLoadingBarProvider, NMessageProvider, NThemeEditor } from "naive-ui";

export default defineComponent({
  name: "YuanPlayer",
  setup(props, context) {

    const playerStore = usePlayerStore();
    const themeLayerStyle = computed(() => {
      return `--theme:${playerStore.theme};`
    })

    const NaiveThemeConfig = computed<GlobalThemeOverrides>(() => {
      const globalTheme = playerStore.theme;
      return {
        Input: {
          borderHoverWarning: globalTheme,
          borderFocus: globalTheme,
          borderHover: globalTheme
        },
        Radio: {
          buttonBorderColorActive: globalTheme,
          buttonBorderColorHover: globalTheme,
          buttonTextColorActive: globalTheme,
          buttonTextColorHover: globalTheme,
          buttonBoxShadowFocus: 'none',
          fontSizeSmall: '12px',
        }
      }
    })

    return () => {
      return (
        <section class="theme-layer" style={themeLayerStyle.value}>
          <NConfigProvider themeOverrides={NaiveThemeConfig.value}>
            <NMessageProvider>
              <NLoadingBarProvider>
                <RouterView></RouterView>
                <Player></Player>
                <NBackTop
                  listenTo=".player-container"
                  visibilityHeight={100}
                  bottom={90}
                  themeOverrides={{
                    width: "38px",
                    height: "38px",
                    iconSize: "20px",
                  }}
                ></NBackTop>


              </NLoadingBarProvider>
            </NMessageProvider>
          </NConfigProvider>
        </section>
      );
    };
  },
});
