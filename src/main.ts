import { createApp } from "vue";
import { createPinia } from 'pinia';

import { globalProperties } from "./vueGlobalConfig";
import routerObj from "@router/index";
import "@assets/js/yuan-ui-svg";
import "@assets/js/svg";
import "@scss/main.scss";
import YuanPlayer from "./App";

import './swiper';

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
vueApp.config.globalProperties = globalProperties;
vueApp.use(createPinia());
vueApp.use(routerObj);

//挂在实例
vueApp.mount("#app");
