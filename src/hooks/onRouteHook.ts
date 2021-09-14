import { is, NOOP } from "@/utils";
import { NavigationGuard, onBeforeRouteLeave, onBeforeRouteUpdate, RouteLocationNormalized } from "vue-router";

export enum RouteHookNames {
  beforeLeave = 'beforeLeave',
  beforeUpdate = 'beforeUpdate',
}

const ROUTE_HOOK_MAP = new Map<RouteHookNames, (guard: NavigationGuard) => void>();
ROUTE_HOOK_MAP.set(RouteHookNames.beforeLeave, onBeforeRouteLeave);
ROUTE_HOOK_MAP.set(RouteHookNames.beforeUpdate, onBeforeRouteUpdate);

export type OnRouteHookGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized) => void;
export type OnRouteHookFilter = (to: RouteLocationNormalized, from: RouteLocationNormalized) => boolean;

/**
 * 带过滤验证的路由Composition钩子
 * @param hookName 
 * @param guard 
 * @param filter 
 * @returns 
 */
export const onRouteHook = (
  hookName: RouteHookNames,
  guard: OnRouteHookGuard,
  filter: OnRouteHookFilter = NOOP,
) => {
  if (!RouteHookNames[hookName]) {
    if (import.meta.env.DEV) {
      console.error(`The 'hookName' parameter of 'onRouteHook' function is invalid!`);
    }
    return;
  }
  const hookFn = ROUTE_HOOK_MAP.get(RouteHookNames[hookName])!;
  hookFn((to, from, next) => {
    filter(to, from) && guard(to, from);
    next();
  });
}

export const onFilteredBeforeRouteUpdate: (guard: OnRouteHookGuard) => void = (updateGuard) => {
  onRouteHook(
    RouteHookNames.beforeUpdate,
    updateGuard,
    ((to, from) => {
      const newTo = { ...to };
      const newFrom = { ...from };
      Reflect.deleteProperty(newTo, 'playerStatus');
      Reflect.deleteProperty(newFrom, 'playerStatus');
      return JSON.stringify(newTo) !== JSON.stringify(newFrom);
    })
  )
}