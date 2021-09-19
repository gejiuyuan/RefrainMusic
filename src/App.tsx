import { computed, defineComponent } from "vue";
import { RouterView, useRoute } from "vue-router";
import { 
  GlobalThemeOverrides, useMessage, NBackTop, 
  NConfigProvider, NLoadingBarProvider, NMessageProvider, 
  NThemeEditor, useLoadingBar 
} from "naive-ui";
import LyricPage from '@views/lyric-page'; 
import { theme } from "./stores/player"; 
import "./App.scss";
import { messageBus } from "./utils/event/register"; 

export const LogicLayer = defineComponent({
  name: 'LogicLayer',
  setup() {
    
    const message = useMessage();
    const loading = useLoadingBar();
    messageBus.on('startLoading', () => loading.start());
    messageBus.on('finishLoading', () => loading.finish());
    messageBus.on('errorLoading', () => loading.error());
    messageBus.on('destroyAllMessage', () => message.destroyAll());
    messageBus.on('successMessage', (...args:FuncParamsType<typeof message.success>) => message.success(...args));
    messageBus.on('warnMessage', (...args:FuncParamsType<typeof message.warning>) => message.warning(...args));
    messageBus.on('errorMessage', (...args:FuncParamsType<typeof message.error>) => message.error(...args));

    return () => (
      <>
        <RouterView></RouterView>
        <LyricPage></LyricPage>
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
      </>
    )
  }
})

export default defineComponent({
  name: "YuanPlayer",
  setup(props, context) {
     
    const themeLayerStyle = computed(() => {
      return `--theme:${theme.value};`
    });

    const NaiveThemeConfig = computed<GlobalThemeOverrides>(() => {
      const globalTheme = theme.value;
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
    });

    return () => {
      return (
        <section class="theme-layer" style={themeLayerStyle.value}>
          <NConfigProvider themeOverrides={NaiveThemeConfig.value}>
            <NMessageProvider>
              <NLoadingBarProvider> 
                <LogicLayer></LogicLayer>
              </NLoadingBarProvider>
            </NMessageProvider>
          </NConfigProvider>
        </section>      
      );
    };
  },
});
