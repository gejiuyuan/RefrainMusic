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
	routeLocationKey,
	RouteLocationNormalized,
} from 'vue-router';
import { searchCloud } from '@api/search';
import { getLocaleCount, padPicCrop } from '@utils/index';
import './index.scss';
import RoutePagination, { PagiInfo } from '@widgets/route-pagination';
import { SearchCloundData } from '../index';
import VideoList from '@widgets/video-list';
import { COMPONENT_NAME, PAGE_SIZE } from '@/utils/preference';
import { onFilteredBeforeRouteUpdate } from '@/hooks/onRouteHook';

const defaultLimie = PAGE_SIZE[COMPONENT_NAME.SEARCH_VIDEO];

const defaultSearchVideoInfo = {
	offset: 0,
	limit: defaultLimie,
	sizeArr: Array(3)
		.fill(0)
		.map((v, i) => defaultLimie * (i + 1)),
};

export default defineComponent({
	name: COMPONENT_NAME.SEARCH_VIDEO,
	setup(props, context) {
		const route = useRoute();
		const { sizeArr, limit: dftLimit, offset: dftOffset } = defaultSearchVideoInfo;
		const videoPagiConf = reactive<PagiInfo>({
			sizeArr,
			total: 0,
			limit: dftLimit,
			offset: dftOffset,
		});
		const searchData = inject<SearchCloundData>('searchCloundData')!;

		watchEffect(() => {
			videoPagiConf.total = searchData.video.videoCount;
		});

		const routeUpdateHandler = async ({ query }: RouteLocationNormalized) => {
			const { limit, offset } = query as PlainObject<string>;
			videoPagiConf.limit = limit;
			videoPagiConf.offset = offset;
		};
		routeUpdateHandler(route);

		onFilteredBeforeRouteUpdate((to) => {
			routeUpdateHandler(to);
		});

		return () => {
			const {
				video: { videos, videoCount },
			} = searchData;
			return (
				<>
					<section class="search-video">
						<VideoList videoList={videos}></VideoList>
					</section>
					<RoutePagination pagiInfo={videoPagiConf}></RoutePagination>
				</>
			);
		};
	},
});
