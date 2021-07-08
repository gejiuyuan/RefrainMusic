
import {
    onKeyDown,
    onKeyUp,
    useFullscreen,
    useMagicKeys
} from '@vueuse/core';
import { onMounted, ref } from "@vue/runtime-core";
import { onUnmounted, shallowReactive } from "vue";

export function useBetterFullscreen() {

    //默认监听document
    const { isSupported, enter, exit, toggle, isFullscreen } = useFullscreen();
    const F11 = 'F11';

    //清除F11默认进入全屏行为，因为js无法监听其变化
    onKeyDown(F11, (ev: KeyboardEvent) => {
        ev.preventDefault();
    });

    //按F11时，切换全屏
    onKeyUp(F11, (ev: KeyboardEvent) => {
        toggle();
    });

    return {
        isSupported,
        toggle,
        isFullscreen,
        enter,
        exit,
    }

}

export function useTimeSlice(upperLimit = 10) {
    const showPriority = ref(0);
    const runShowPriority = () => {
        const step = () => {
            requestAnimationFrame(() => {
                showPriority.value++;
                if (showPriority.value < upperLimit) {
                    step();
                }
            });
        };
        step();
    };
    onMounted(() => {
        runShowPriority();
    });

    return (priority: number) => {
        showPriority.value >= priority;
    };
}
