import { nextTick } from "vue";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecord,
  RouterScrollBehavior,
} from "vue-router";

import routes from "./routes";

const routerObj = createRouter({
  // scrollBehavior(to, from, savedPosition) {
  //     if (savedPosition == null) {
  //         savedPosition = { left: 0, top: 0 }
  //     }
  //     const realPosition: ReturnType<RouterScrollBehavior> = {
  //         ...savedPosition,
  //         el: document.querySelector('.yplayer-home-main') as Element,
  //         behavior: 'smooth',
  //     }
  //     return realPosition;
  // },
  // history: createWebHashHistory(),
  history: createWebHistory(),
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
  routes,
});

routerObj.beforeEach((to, from, next) => {
  nextTick(() => {
    const homeMainElm = document.querySelector(".player-container");
    homeMainElm && (homeMainElm.scrollTop = 0);
  });
  next();
});

export default routerObj;
