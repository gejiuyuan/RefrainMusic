import { createApp } from "vue";
import { globalProperties } from "./vueGlobalConfig";

import "@assets/js/yuan-ui-svg";
import "@assets/js/svg";
import "@scss/main.scss";

import './swiper';
import YuanPlayer from "./App";

import {
  plugins as elPlugins,
  components as elComponents
} from './element';
import "element-plus/packages/theme-chalk/src/base.scss";
import "@scss/el-theme.scss";


//创建app根实例
const vueApp = createApp(YuanPlayer);

// element-plus plugin registry
elComponents.forEach(component => {
  vueApp.component(component.name, component)
});
elPlugins.forEach(plugin => {
  vueApp.use(plugin)
});

//传入全局配置
vueApp.config.globalProperties = globalProperties;

import store from "@stores/index";
vueApp.use(store);

import routerObj from "@router/index";
vueApp.use(routerObj);

//挂在实例
vueApp.mount("#app");
