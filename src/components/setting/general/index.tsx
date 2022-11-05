/** @format */

import { NColorPicker } from 'naive-ui';
import {
	defineComponent,
	markRaw,
	onMounted,
	reactive,
	readonly,
	ref,
	nextTick,
	h,
	shallowReactive,
} from 'vue';
import './index.scss';
import { defaultPlayerPreferences, theme } from '@stores/player';
import { PreferenceNames } from '@/utils/preference';
import { deepCopy, NOOP } from '@/utils';
import { ColorPickerMode } from 'naive-ui/lib/color-picker/src/utils';
import { useEventListener } from '@vueuse/core';

const themeConfig = {
	value: theme.value,
	modes: ['rgb', 'hex', 'hsl', 'hsv'] as ColorPickerMode[],
	options: [
		defaultPlayerPreferences[PreferenceNames.theme],
		'#18A058',
		'#2080F0',
		'#F0A020',
		'rgba(208, 48, 80, 1)',
	],
};

const ThemeSetting = defineComponent({
	setup(props, context) {
		const themeConf = shallowReactive(deepCopy(themeConfig));

		const updateTheme = (color: string) => {
			themeConf.value = color;
		};
		let isClickFromColorPickerConfirm = false;
		const handleThemePickerConfirm = () => {
			theme.value = themeConf.value;
			isClickFromColorPickerConfirm = true;
		};
		let colorPickClickListenerRemover: CommonFunction = NOOP;

		const themeColorPickShowToggle = (isShow: boolean) => {
			if (!isShow) {
				colorPickClickListenerRemover();
				if (isClickFromColorPickerConfirm) {
					isClickFromColorPickerConfirm = false;
				} else {
					themeConf.value = theme.value;
				}
			} else {
				setTimeout(() => {
					colorPickClickListenerRemover = useEventListener(
						document.querySelector('.n-color-picker-panel .n-color-picker-action button'),
						'mouseup',
						handleThemePickerConfirm,
					);
				});
			}
		};

		return () => {
			return (
				<section id="theme-setting" class="setting-block">
					<header class="block-header">
						<h3 class="setting-title">外观</h3>
					</header>
					<ul class="setting-list">
						<li>
							<em class="setting-name">主题色</em>
							<div class="setting-content">
								<div className="theme-picker">
									<NColorPicker
										showPreview
										size="small"
										actions={['confirm']}
										value={themeConf.value}
										modes={themeConf.modes}
										onUpdateShow={themeColorPickShowToggle}
										onUpdateValue={updateTheme}
										swatches={themeConf.options}
									></NColorPicker>
								</div>
							</div>
						</li>
					</ul>
				</section>
			);
		};
	},
});

export default defineComponent({
	name: 'Setting',
	setup(props, context) {
		return () => {
			return (
				<section class="setting-general">
					<ThemeSetting></ThemeSetting>
				</section>
			);
		};
	},
});
