import { computed, defineComponent, reactive, toRef, watch } from "vue";
import { GlobalThemeOverrides, NBackTop, NConfigProvider, NLoadingBarProvider, NMessageProvider, NThemeEditor, useLoadingBar } from "naive-ui";
import usePlayerStore from "./stores/player";
import App from './App';

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
                <App></App>
              </NLoadingBarProvider>
            </NMessageProvider>
          </NConfigProvider>
        </section>
      );
    };
  },
});
