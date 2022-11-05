/** @format */

import { inject, computed, Ref, defineComponent, provide } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import Songlist from '@widgets/song-list';
import './index.scss';
import { COMPONENT_NAME, PAGE_SIZE } from '@/utils/preference';

const defaultLimit = PAGE_SIZE[COMPONENT_NAME.USER_SONGLIST];

export default defineComponent({
	name: COMPONENT_NAME.USER_SONGLIST,
	components: {
		Songlist,
	},
	setup(props, context) {
		const router = useRouter();
		const id = Number(router.currentRoute.value.query.id);
		const songlists = inject('songlists') as any;

		return () => {
			const {
				created: { data, hasMore },
			} = songlists;
			return (
				<section class="user-songlist">
					<section class="songlist-layer songlist-created">
						<h5 class="songlist-title">
							创建的
							<span>{data.length}</span>
						</h5>
						<Songlist
							playlists={data}
							hasMore={hasMore}
							defaultLimit={defaultLimit}
						></Songlist>
					</section>
				</section>
			);
		};
	},
});
