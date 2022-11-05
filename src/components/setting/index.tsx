/** @format */

import {
	defineComponent,
	markRaw,
	onMounted,
	reactive,
	readonly,
	ref,
	shallowReactive,
} from 'vue';
import './index.scss';
import { renderKeepAliveRouterView } from '@/widgets/common-renderer';
import CommonRouterList from '@/widgets/common-router-list';
import { deepCopy } from '@/utils';

export const settingRoutes = [{ text: '常规设置', to: '/setting/general' }];

export default defineComponent({
	name: 'Setting',
	setup(props, context) {
		const settingRouteData = shallowReactive(deepCopy(settingRoutes));

		return () => {
			return (
				<section class="yplayer-setting-page">
					<header class="setting-header">
						<h2 class="setting-title">设置</h2>
						<CommonRouterList routelist={settingRouteData}></CommonRouterList>
					</header>
					{renderKeepAliveRouterView()}
				</section>
			);
		};
	},
});
