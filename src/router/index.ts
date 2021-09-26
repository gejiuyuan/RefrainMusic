import { nextTick } from "vue";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecord,
  RouterScrollBehavior,
  RouteLocationNormalized,
} from "vue-router";
import routes from './routes';

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
  history: createWebHashHistory(),
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
  routes,
});

const scrollToTopQueries = ['limit', 'offset'];
function handlerScrollToTop(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  const { query: toQuery } = to;
  const { query: fromQuery } = from;
  if (scrollToTopQueries.some(q => toQuery[q] !== fromQuery[q])) {
    requestAnimationFrame(() => {
      const homeMainElm = document.querySelector(".player-container");
      homeMainElm && (homeMainElm.scrollTop = 0);
    });
  }
}

routerObj.beforeEach((to, from, next) => {
  handlerScrollToTop(to, from);
  next();
});

export default routerObj;
