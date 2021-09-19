import { createApp } from "vue";
import { createPinia } from 'pinia';
import routerObj from "@router/index";
import YuanPlayer from "./App";
import '@stores/initStore';
import "@scss/main.scss";

import "swiper/components/effect-coverflow/effect-coverflow.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/swiper.scss";

import SwiperCore, {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
  Lazy,
  Mousewheel,
} from "swiper/core";

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
