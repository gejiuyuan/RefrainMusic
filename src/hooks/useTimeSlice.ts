/** @format */

import {
	onKeyDown,
	onKeyUp,
	useFullscreen,
	useMagicKeys,
	MaybeElementRef,
} from '@vueuse/core';
import { onMounted, ref, watchEffect, watch } from '@vue/runtime-core';
import { EMPTY_OBJ } from '@/utils';

/**
 * 时间切片（分块渲染）
 * @param upperLimit 分块次数
 * @returns (p: number) => void
 */
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
