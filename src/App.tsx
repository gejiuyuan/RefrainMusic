import { computed, defineComponent, h, watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import {
  GlobalThemeOverrides, useMessage, NxButton,
  NConfigProvider, NLoadingBarProvider, NMessageProvider, NAvatar,
  useLoadingBar, NNotificationProvider, useNotification, NDialogProvider,
} from "naive-ui";
import LyricPage from '@views/lyric-page';
import { theme } from "./stores/player";
import { messageBus } from "./utils/event/register";
import refrainPic from '../public/refrain.png';
import onBeforeInstallPrompt from "./hooks/onBeforeInstallPrompt";
import { UNICODE_CHAR } from "./utils";
import useUserStore from "./stores/user";
import "./App.scss";

export const LogicLayer = defineComponent({
  name: 'LogicLayer',
  setup() {

    const message = useMessage();
    const loading = useLoadingBar();
    messageBus.on('startLoading', () => loading.start());
    messageBus.on('finishLoading', () => loading.finish());
    messageBus.on('errorLoading', () => loading.error());
    messageBus.on('destroyAllMessage', () => message.destroyAll());
    messageBus.on('successMessage', (...args: FuncParamsType<typeof message.success>) => message.success(...args));
    messageBus.on('warnMessage', (...args: FuncParamsType<typeof message.warning>) => message.warning(...args));
    messageBus.on('errorMessage', (...args: FuncParamsType<typeof message.error>) => message.error(...args));

    const notification = useNotification();

    onBeforeInstallPrompt((addToHomeScreen) => {
      setTimeout(() => {
        const n = notification.create({
          title: '添加RefrainMusic到主屏幕',
          content: '添加后，便可从桌面图标、开始菜单等处打开应用',
          meta: `${UNICODE_CHAR.smile.repeat(3)}`,
          duration: 30000,
          avatar: () =>
            h(NAvatar, {
              size: 'small',
              round: true,
              src: refrainPic
            }),
          action: () =>
            h(
              NxButton,
              {
                text: true,
                type: 'success',
                onClick: () => {
                  addToHomeScreen();
                  n.destroy();
                }
              },
              {
                default: () => '好滴~~'
              }
            ),
        })
      }, 5000);
    });

    const userStore = useUserStore();
    const router = useRouter();

    watch(() => userStore.isLogin, (isLogin) => {
      if (!isLogin) {
        router.replace({
          path: '/musichall/featrued'
        })
      }
    });

    return () => (
      <>
        <RouterView></RouterView>
        <LyricPage></LyricPage>
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
        },
        LoadingBar: {
          colorLoading: globalTheme,
        },
        BackTop: {
          iconColorHover: globalTheme,
        },
        Button: {

          textColorFocusPrimary: globalTheme,
          textColorDisabledPrimary: globalTheme,

          textColorGhostPrimary: globalTheme,
          textColorGhostHoverPrimary: globalTheme,
          textColorGhostPressedPrimary: globalTheme,
          textColorGhostFocusPrimary: globalTheme,
          textColorGhostDisabledPrimary: globalTheme,
          borderHoverPrimary: globalTheme,

          borderPrimary: globalTheme,
          borderDisabledPrimary: globalTheme,

        },
        Pagination: {

          itemTextColorHover: globalTheme,
          itemTextColorPressed: globalTheme,
          itemTextColorActive: globalTheme,
          itemBorder: globalTheme,
          itemBorderHover: globalTheme,
          itemBorderActive: globalTheme,
          itemBorderDisabled: globalTheme,
          itemBorderPressed: globalTheme,

        },
        InternalSelection: {
          borderActive: globalTheme,
          borderHover: globalTheme,
          borderFocus: globalTheme,
        },
        InternalSelectMenu: {
          optionTextColorActive: globalTheme,
        },
        Select: {

        },
        Dropdown: {

        }
      }
    });

    return () => {
      return (
        <section class="theme-layer" style={themeLayerStyle.value}>
          <NConfigProvider themeOverrides={NaiveThemeConfig.value}>
            <NMessageProvider>
              <NNotificationProvider>
                <NDialogProvider>
                  <NLoadingBarProvider>
                    <LogicLayer></LogicLayer>
                  </NLoadingBarProvider>
                </NDialogProvider>
              </NNotificationProvider>
            </NMessageProvider>
          </NConfigProvider>
        </section>
      );
    };
  },
});
