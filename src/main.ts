import { createApp } from "vue";
import { createPinia } from 'pinia';
import routerObj from "@router/index";
import YuanPlayer from "./App";
import '@stores/initStore';
import "@scss/main.scss";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import SwiperCore, {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
  Lazy,
  Mousewheel,
} from "swiper";

SwiperCore.use([
  Pagination,
  EffectCoverflow,
  Navigation,
  Autoplay,
  Lazy,
  Mousewheel,
]);

//创建app根实例
const vueApp = createApp(YuanPlayer);
vueApp.use(createPinia());
vueApp.use(routerObj);

//挂在实例
vueApp.mount("#Yuan-Player");
