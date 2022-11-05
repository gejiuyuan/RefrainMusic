/** @format */

import { is } from '@/utils';
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import './index.scss';

export type YuanButtonData = {
	text: string;
	value: any;
};

export default defineComponent({
	name: 'YuanButton',
	props: {
		value: {
			type: null,
			required: false,
			default: void 0,
		},
		text: {
			type: String as PropType<string>,
			required: false,
			default: '',
		},
		onClick: {
			type: Function as PropType<(data: YuanButtonData) => void>,
			required: false,
			default: () => () => {},
		},
		disabled: {
			type: Boolean as PropType<boolean>,
			required: false,
			default: false,
		},
		isActive: {
			type: Boolean as PropType<boolean>,
			required: false,
			default: false,
		},
		onUpdateIsActive: {
			type: [Function] as PropType<(isActive: boolean) => void>,
			requred: false,
			default: () => () => {},
		},
	},
	emits: ['updateIsActive'],
	setup(props, { slots, emit }) {
		const isActive = ref(false);
		watch(
			() => props.isActive,
			(value) => {
				isActive.value = value;
			},
			{
				immediate: true,
			},
		);
		const clickHandler = (data: { value: string; text: string }) => {
			isActive.value = !isActive.value;
			emit('updateIsActive', isActive.value);
			props.onClick(data);
		};
		const classNameRef = computed(() => {
			return {
				'yuan-button': true,
				'yuan-button-disabled': props.disabled,
				'yuan-button-isActive': isActive.value,
			};
		});
		return () => {
			const { text, value } = props;
			return (
				<button class={classNameRef.value} onClick={() => clickHandler({ value, text })}>
					{slots.default?.() || text}
				</button>
			);
		};
	},
});
