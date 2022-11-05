/** @format */

import {
	markRaw,
	onMounted,
	readonly,
	ref,
	defineComponent,
	shallowReactive,
	reactive,
	WatchStopHandle,
	onActivated,
	watch,
} from 'vue';
import './index.scss';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { newAlbumPutOn } from '@/api/playlist';
import { NRadioButton, NRadioGroup } from 'naive-ui';
import { EMPTY_OBJ } from '@/utils';
import AlbumList from '@/widgets/album-list';
import { onFilteredBeforeRouteUpdate, RouteHookNames } from '@/hooks/onRouteHook';

export const areaKeyList = [
	{ key: 'ALL', area: '全部' },
	{ key: 'ZH', area: '华语' },
	{ key: 'EA', area: '欧美' },
	{ key: 'KR', area: '韩国' },
	{ key: 'JP', area: '日本' },
];

const typeKeyList = [
	{ key: 'new', type: '最新' },
	{ key: 'hot', type: '热门' },
];

const timeRangeList = [
	{ key: 'week', type: '本周新碟', dataKey: 'weekData' },
	{ key: 'month', type: '本月新碟', dataKey: 'monthData' },
];

const defaultDiscInfos = {
	area: areaKeyList[0].key,
	type: typeKeyList[0].key,
	timerange: timeRangeList[0].key,
};

export type ListMap = PlainObject<
	| {
			weekData: any[];
			monthData: any[];
	  }
	| undefined
>;

export default defineComponent({
	name: 'MusicHallNewdisc',
	setup(props, context) {
		const route = useRoute();
		const router = useRouter();

		const {
			area: defaultAreaKey,
			type: defaultTypeKey,
			timerange: defaultTimerangeKey,
		} = defaultDiscInfos;

		const listMap = areaKeyList.reduce<ListMap>((map, { key }) => {
			map[key] = void 0;
			return map;
		}, {});

		const newDiscInfos = reactive({
			listMap,
			hasMore: false,
		});

		const routeUpdateHandler = async (toQuery: PlainObject, fromQuery?: PlainObject) => {
			const {
				area = defaultAreaKey,
				type = defaultTypeKey,
				limit,
				year,
				month,
				offset,
			} = toQuery;
			const { type: oldType = defaultTypeKey } = fromQuery || EMPTY_OBJ;

			if (type !== oldType || !newDiscInfos.listMap[area]) {
				const { hasMore, weekData, monthData } = await newAlbumPutOn({
					area,
					limit,
					type,
					year,
					month,
					offset,
				});
				newDiscInfos.hasMore = hasMore;
				newDiscInfos.listMap[area] = {
					weekData,
					monthData,
				};
			}
		};
		routeUpdateHandler(route.query);
		onFilteredBeforeRouteUpdate((to, from) => {
			routeUpdateHandler(to.query, from.query);
		});

		const areaChange = (areaKey: string | number) => {
			router.push({
				path: route.path,
				query: {
					...route.query,
					area: areaKey,
				},
			});
		};

		const typeChange = (typeKey: string | number) => {
			router.push({
				path: route.path,
				query: {
					...route.query,
					type: typeKey,
				},
			});
		};

		const timerangeChange = (timerangeKey: string) => {
			router.push({
				path: route.path,
				query: {
					...route.query,
					timerange: timerangeKey,
				},
			});
		};

		return () => {
			const {
				area = defaultAreaKey,
				type = defaultTypeKey,
				timerange = defaultTimerangeKey,
			} = route.query as any;

			const { listMap, hasMore } = newDiscInfos;
			const targetList =
				timeRangeList.find(({ key }) => timerange === key) ||
				({} as typeof timeRangeList[number]);
			const { dataKey, type: targetType } = targetList;
			const targetData = dataKey
				? (listMap[area]! || EMPTY_OBJ)[dataKey as keyof typeof listMap[string]] || []
				: [];

			return (
				<section class="newestdisc">
					<section class="newestdisc-layer">
						<NRadioGroup value={type} onUpdateValue={typeChange} size="small">
							{typeKeyList.map((item) => (
								<NRadioButton key={item.key} value={item.key}>
									{item.type}
								</NRadioButton>
							))}
						</NRadioGroup>
					</section>

					<section class="newestdisc-layer">
						<NRadioGroup value={area} onUpdateValue={areaChange} size="small">
							{areaKeyList.map((item) => (
								<NRadioButton key={item.key} value={item.key}>
									{item.area}
								</NRadioButton>
							))}
						</NRadioGroup>
					</section>

					<section class="newestdisc-layer">
						<NRadioGroup value={timerange} onUpdateValue={timerangeChange} size="small">
							{timeRangeList.map((item) => (
								<NRadioButton key={item.key} value={item.key}>
									{item.type}
								</NRadioButton>
							))}
						</NRadioGroup>
					</section>

					<section class="newestdisc-layer">
						<h4 class="disc-title">{targetType}</h4>
						<AlbumList
							isNew={true}
							showPagination={false}
							albumList={targetData}
							gaps={{ x: 60, y: 50 }}
							needInfinityScroll={true}
						></AlbumList>
					</section>
				</section>
			);
		};
	},
});
