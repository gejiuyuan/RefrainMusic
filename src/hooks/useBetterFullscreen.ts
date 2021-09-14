import {
  onKeyDown,
  onKeyUp,
  useFullscreen,
  useMagicKeys,
  MaybeElementRef,
} from "@vueuse/core";
import { onMounted, ref, watchEffect, watch } from "@vue/runtime-core";
import { EMPTY_OBJ } from "@/utils";

/**
 * 使用全屏方法（基于vueuse的useFullscreen，额外做了F11优化）
 * @param target 进入全屏的目标对象，useFullscreen中默认为document
 * @param options 执行选项
 * @returns
 */
export function useBetterFullscreen(
  target?: MaybeElementRef,
  options?: {
    F11Interval?: number; //F11节流间隔
  }
) {
  const { F11Interval = 500 } = options || EMPTY_OBJ;
  //默认监听document
  const { isSupported, enter, exit, toggle, isFullscreen } =
    useFullscreen(target);
  const F11 = "F11";

  //清除F11默认进入全屏行为，因为js无法监听其变化
  onKeyDown(F11, (ev: KeyboardEvent) => {
    ev.preventDefault();
  });

  let prev = 0;
  //按F11时，切换全屏
  onKeyUp(
    F11,
    (ev: KeyboardEvent) => {
      const now = performance.now();
      //之所以这里设置F11触发间隔，是为了解决连续快速按F11出现的无法执行进入全屏方法的报错信息
      if (now - prev >= F11Interval) {
        toggle();
        prev = now;
      }
    },
    {
      //设置F11的keyup事件触发对象为html（默认为window），以解决如下报错：
      // Failed to execute 'requestFullScreen' on 'Element': API can only be initiated by a user gesture.
      target: document.documentElement,
    }
  );

  return {
    isSupported,
    toggle,
    isFullscreen,
    enter,
    exit,
  };
}
