/** @format */

import { SongInfo } from '@/types/song';
import { defineComponent, inject, PropType, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { getSongDetailList } from '../util';
import './index.scss';

export default defineComponent({
	name: 'SongDetail',
	setup() {
		const router = useRouter();
		const songDetail = inject<Ref<SongInfo>>('songDetail')!;

		return () => {
			const list = getSongDetailList(songDetail.value);

			return (
				<div class="song-comment-container">
					{list.map(({ attr, value }) => {
						return (
							<div class="content-layer">
								<h6>{attr}:</h6>
								<mark>{value}</mark>
							</div>
						);
					})}
				</div>
			);
		};
	},
});
