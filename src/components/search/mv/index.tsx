/** @format */

import {
	computed,
	defineComponent,
	markRaw,
	onActivated,
	onDeactivated,
	onMounted,
	onUnmounted,
	reactive,
	ref,
	shallowReactive,
	toRefs,
	watch,
	WatchStopHandle,
	inject,
	watchEffect,
} from 'vue';
import {
	useRoute,
	useRouter,
	LocationQuery,
	onBeforeRouteUpdate,
	onBeforeRouteLeave,
} from 'vue-router';
import './index.scss';
import RoutePagination, { PagiInfo } from '@widgets/route-pagination';
import { SearchCloundData } from '../index';
import VideoList from '@widgets/video-list';
import { COMPONENT_NAME, PAGE_SIZE } from '@/utils/preference';
import MvList from '@/widgets/mv-list';

const defaultLimit = PAGE_SIZE[COMPONENT_NAME.SEARCH_MV];

export default defineComponent({
	name: COMPONENT_NAME.SEARCH_MV,
	setup(props, context) {
		const searchData = inject<SearchCloundData>('searchCloundData')!;

		return () => {
			const {
				mv: { mvs, mvCount },
			} = searchData;
			return (
				<section class="search-video">
					<MvList
						mvlists={mvs}
						showPagination={true}
						defaultLimit={defaultLimit}
						total={mvCount}
					></MvList>
				</section>
			);
		};
	},
});
