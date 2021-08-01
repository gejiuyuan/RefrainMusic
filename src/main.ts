import { createApp } from "vue";
import { createPinia } from 'pinia';
import { globalProperties } from "./vueGlobalConfig";
import routerObj from "@router/index";
import "@scss/main.scss";
import YuanPlayer from "./App";
import './swiper';   
 
//创建app根实例
const vueApp = createApp(YuanPlayer);
 
vueApp.config.globalProperties = globalProperties;
vueApp.use(createPinia());
vueApp.use(routerObj);

//挂在实例
vueApp.mount("#Yuan-Player");
