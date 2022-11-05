/** @format */

import { onActivated, defineComponent, ref, reactive } from 'vue';
import {
	useRouter,
	useRoute,
	RouteLocationNormalized,
	onBeforeRouteUpdate,
} from 'vue-router';

import { freeze } from '@utils/index';
import { artistMv } from '@api/singer';
import { Mv } from '@/types/mv';
import './index.scss';
import { COMPONENT_NAME, PAGE_SIZE } from '@/utils/preference';
import MvList from '@widgets/mv-list';
import { onFilteredBeforeRouteUpdate } from '@/hooks/onRouteHook';

const defaultMvslimit = PAGE_SIZE[COMPONENT_NAME.ARTIST_MV];
export interface RealMvInfo {
	mvList: Mv[];
}

export default defineComponent({
	name: COMPONENT_NAME.ARTIST_MV,
	setup(props, context) {
		const router = useRouter();
		const route = useRoute();
		const mvInfo = reactive<RealMvInfo>({
			mvList: [],
		});
		const hasMoreRef = ref(true);

		const getArtistMvs = async (route: RouteLocationNormalized) => {
			const { id, limit = defaultMvslimit, offset } = route.query as PlainObject;
			const { mvs = [], hasMore } = await artistMv({
				id,
				limit,
				offset,
			});
			hasMoreRef.value = hasMore;
			mvInfo.mvList = freeze(mvs);
		};

		onActivated(() => {
			getArtistMvs(route);
		});

		onFilteredBeforeRouteUpdate((to) => {
			getArtistMvs(to);
		});

		return () => {
			const { mvList } = mvInfo as any;
			return (
				<MvList
					cols={5}
					mvlists={mvList}
					showPagination={true}
					defaultLimit={defaultMvslimit}
					hasMore={hasMoreRef.value}
				></MvList>
			);
		};
	},
});
