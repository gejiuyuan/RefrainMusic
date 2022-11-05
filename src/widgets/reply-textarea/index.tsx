/** @format */

import { UNICODE_CHAR } from '@/utils';
import { computed, defineComponent, ref, shallowReactive } from 'vue';
import './index.scss';

/**
 * 评论等内容回复的公共组件
 */
export default defineComponent({
	name: 'ReplyTextarea',
	setup() {
		const isFocus = ref(false);
		const focusHandler = () => (isFocus.value = true);
		const blurHandler = () => (isFocus.value = false);

		const excludeClasses: string[] = [];

		const pointerDownHandler = ({ target }: PointerEvent) => {
			if (
				excludeClasses.some((className) =>
					(target as HTMLElement).closest(`.${className}`),
				)
			) {
				return;
			}
			focusHandler();
		};

		return () => {
			return (
				<section class="reply-container" onPointerdown={pointerDownHandler}>
					<div class="reply-textarea">
						<custom-textarea
							focus={isFocus.value}
							placeholder={`赶快输入⑧${UNICODE_CHAR.pensive}`}
							onBlur={blurHandler}
							onFocus={focusHandler}
						></custom-textarea>
					</div>
					<div class="reply-operation"></div>
				</section>
			);
		};
	},
});
