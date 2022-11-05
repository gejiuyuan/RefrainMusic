/** @format */

import {
	defineComponent,
	inject,
	watch,
	reactive,
	watchEffect,
	onActivated,
	WatchStopHandle,
} from '@vue/runtime-core';
import { SearchCloundData } from '../index';
import './index.scss';
import AlbumList from '@widgets/album-list';
import { COMPONENT_NAME, PAGE_SIZE } from '@/utils/preference';
import { ref } from 'vue';

const defaultSearchAlbumLimit = PAGE_SIZE[COMPONENT_NAME.SEARCH_ALBUM];

export default defineComponent({
	name: COMPONENT_NAME.SEARCH_ALBUM,
	setup(props, context) {
		const searchData = inject<SearchCloundData>('searchCloundData')!;
		const total = ref(0);
		watchEffect(() => {
			total.value = searchData.album.albumCount;
		});
		return () => {
			const {
				album: { albums },
			} = searchData;
			return (
				<>
					<section class="search-album">
						<AlbumList
							albumList={albums}
							defaultLimit={defaultSearchAlbumLimit}
						></AlbumList>
					</section>
				</>
			);
		};
	},
});
