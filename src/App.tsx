import { computed, defineComponent, reactive, toRef, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import "./App.scss";
import Player from '@views/player';
import { NBackTop, useLoadingBar, useMessage } from "naive-ui";
import { messageBus } from "./utils/event/register";

export default defineComponent({
  name: "YuanPlayer",
  setup(props, context) {
    const message = useMessage();
    const loading = useLoadingBar();
    messageBus.on('startLoading', () => loading.start());
    messageBus.on('finishLoading', () => loading.finish());
    messageBus.on('errorLoading', () => loading.error());
    messageBus.on('destroyAllMessage', () => message.destroyAll());
    messageBus.on('successMessage', (...args:FuncParamsType<typeof message.success>) => message.success(...args));
    messageBus.on('warnMessage', (...args:FuncParamsType<typeof message.warning>) => message.warning(...args));
    messageBus.on('errorMessage', (...args:FuncParamsType<typeof message.error>) => message.error(...args));
    return () => {
      return (
        <>
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
        </>
      );
    };
  },
});
