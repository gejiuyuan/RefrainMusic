/** @format */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import routerObj from '@router/index';
import YuanPlayer from './App';
import '@stores/initStore';
import '@scss/main.scss';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import SwiperCore, {
	EffectCoverflow,
	Pagination,
	Navigation,
	Autoplay,
	Lazy,
	Mousewheel,
} from 'swiper';
import { registerSW } from 'virtual:pwa-register';
import '@/webComponents/index';

//自动更新间隔：3小时
const intervalMS = 3 * 60 * 60 * 1000;
const updateSW = registerSW({
	onRegistered(r) {
		r &&
			setInterval(() => {
				r.update();
			}, intervalMS);
	},
	onNeedRefresh() {},
	onOfflineReady() {},
	onRegisterError(error) {},
});

SwiperCore.use([Pagination, EffectCoverflow, Navigation, Autoplay, Lazy, Mousewheel]);

//创建app根实例
const vueApp = createApp(YuanPlayer);
vueApp.use(createPinia());
vueApp.use(routerObj);

//挂在实例
vueApp.mount('#Yuan-Player');
