/** @format */

import {
	toRefs,
	inject,
	shallowReactive,
	watch,
	getCurrentInstance,
	ref,
	defineComponent,
	onActivated,
} from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import SubscriberListComp from '@widgets/subscriber-list';
import RoutePagination, { PagiInfo } from '@widgets/route-pagination';
import { PlaylistSubscribe } from '@api/playlist';
import { Subscriber, SubscriberList } from '@/types/songlist';
import { is, override } from '@/utils';
import './index.scss';
import { COMPONENT_NAME, PAGE_SIZE } from '@/utils/preference';
import { NEmpty } from 'naive-ui';
import { onFilteredBeforeRouteUpdate } from '@/hooks/onRouteHook';

const defaultLimit = PAGE_SIZE[COMPONENT_NAME.SONGLIST_SUBSCRIBER];

export default defineComponent({
	name: COMPONENT_NAME.SONGLIST_SUBSCRIBER,
	setup(props, context) {
		const route = useRoute();
		const router = useRouter();
		const vm = getCurrentInstance()!;
		const subscribers = shallowReactive<Subscriber[]>([]);

		const isShowPagi = ref<boolean>();
		const subscriberPagiInfo = shallowReactive({
			total: 0,
			hasMore: true,
		});
		const getPlaylistSubscribers = async () => {
			const {
				params: { id },
				query: { limit = defaultLimit, offset = 0 },
			} = router.currentRoute.value;
			const {
				more,
				total,
				subscribers: subs,
				reason,
			} = await PlaylistSubscribe({
				id: String(id),
				limit: Number(limit),
				offset: Number(offset),
			});
			subscribers.length = 0;
			subscribers.push(...subs);
			subscriberPagiInfo.total = total;
			subscriberPagiInfo.hasMore = more;
			isShowPagi.value = reason !== 'needLogin';
		};
		onActivated(() => {
			getPlaylistSubscribers();
		});

		onFilteredBeforeRouteUpdate((to, from) => {
			const {
				params: { id },
				query: { limit, offset },
			} = to;
			const {
				params: { id: oldId },
				query: { limit: oldLimit, offset: oldOffset },
			} = from;
			if (id !== oldId || limit !== oldLimit || offset !== oldOffset) {
				getPlaylistSubscribers();
			}
		});

		const renderNotLogin = () => {
			if (is.emptyArray(subscribers) && isShowPagi.value === false) {
				return (
					<NEmpty description="阿娜达~还没有登录噢~~" showDescription={true}></NEmpty>
				);
			}
		};

		return () => {
			const { hasMore, total } = subscriberPagiInfo;
			return (
				<section class="songlist-comment">
					{renderNotLogin()}
					<SubscriberListComp
						defaultLimit={defaultLimit}
						userLists={subscribers}
						hasMore={hasMore}
						total={total}
					></SubscriberListComp>
				</section>
			);
		};
	},
});
