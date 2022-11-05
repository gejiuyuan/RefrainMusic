/** @format */

import {
	shallowReactive,
	toRefs,
	onActivated,
	defineComponent,
	watch,
	WatchStopHandle,
	onDeactivated,
} from 'vue';
import {
	useRouter,
	useRoute,
	onBeforeRouteUpdate,
	RouteLocationNormalized,
	LocationQuery,
	onBeforeRouteLeave,
} from 'vue-router';

import SongTable from '@/widgets/song-table';
import RoutePagination from '@widgets/route-pagination';
import { EMPTY_OBJ, freeze } from '@/utils';
import { SongInfo } from '@/types/song';
import { artistSongs } from '@api/singer';
import './index.scss';
import { NRadioGroup, NSpace, NRadio } from 'naive-ui';
import { COMPONENT_NAME, PAGE_SIZE } from '@/utils/preference';
import { onFilteredBeforeRouteUpdate } from '@/hooks/onRouteHook';

const orders = [
	{ text: '最新', key: 'time' },
	{ text: '热门', key: 'hot' },
];

const defaultAllSongs = {
	order: orders[0].key,
	limit: PAGE_SIZE[COMPONENT_NAME.ARTIST_ALLSONGS],
	offset: 0,
};

export default defineComponent({
	name: COMPONENT_NAME.ARTIST_ALLSONGS,
	setup(props, context) {
		const router = useRouter();
		const route = useRoute();

		const { order: dftOrder, limit: dftLimit, offset: dftOffset } = defaultAllSongs;

		const songPagiInfo = shallowReactive({
			limit: dftLimit,
			offset: dftOffset,
			order: dftOrder,
			total: 0,
			sizeArr: Array(3)
				.fill(0)
				.map((v, i) => dftLimit * (i + 1)),
		});

		const songsData = shallowReactive({
			songList: [] as SongInfo[],
		});

		const getAllSongs = async (query: LocationQuery) => {
			const { id, limit = dftLimit, offset = dftOffset, order = dftOrder } = query as any;
			const { songs = [], total } = await artistSongs({
				id,
				limit,
				offset,
				order,
			});
			songPagiInfo.order = order;
			songPagiInfo.limit = limit;
			songPagiInfo.offset = offset;
			songPagiInfo.total = total;
			songsData.songList = freeze(songs);
		};

		onActivated(() => {
			getAllSongs(route.query);
		});

		onFilteredBeforeRouteUpdate((to) => {
			getAllSongs(to.query);
		});

		const handleOrderChange = (order: string | number) => {
			router.push({
				path: route.path,
				query: {
					...route.query,
					order,
				},
			});
		};

		return () => {
			const { songList } = toRefs(songsData);
			return (
				<section class="yplayer-artist-allSongs">
					<section class="allSongs-header">
						<section class="allSong-order">
							<NRadioGroup value={songPagiInfo.order} onUpdateValue={handleOrderChange}>
								<NSpace>
									{orders.map((item, i) => (
										<NRadio value={item.key} key={item.key}>
											{item.text}
										</NRadio>
									))}
								</NSpace>
							</NRadioGroup>
						</section>
					</section>
					<section class="allSongs-wrap">
						<SongTable dataList={songList.value}></SongTable>
					</section>
					<section class="allSongs-pagination">
						<RoutePagination pagiInfo={songPagiInfo}></RoutePagination>
					</section>
				</section>
			);
		};
	},
});
