/** @format */

import {
	markRaw,
	getCurrentInstance,
	shallowReactive,
	reactive,
	defineComponent,
	ComponentInternalInstance,
	ref,
	watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { recommendSonglist } from '@api/playlist';
import { bannerInfo } from '@api/other';
import './index.scss';
import { is, padPicCrop } from '@/utils';
import RecommendBanner from './banner';
import { NGrid, NGridItem } from 'naive-ui';
import useUserStore from '@/stores/user';

export type FeaturedItem = {
	copywriter: string;
	id: number;
	name: string;
	picUrl: string;
	playCount: number;
	trackCount: number;
	trackNumberUpdateTime: number;
};

export default defineComponent({
	name: 'MusicHallFeatured',
	setup(props, { slots, emit }) {
		const userStore = useUserStore();
		const router = useRouter();
		const featuredData = reactive({
			bannerlist: [] as any[],
			songlist: [] as any[],
			personalSonglist: [] as any[],
		});

		const limit = 10;
		const vm = getCurrentInstance()!;

		const getBanner = async () => {
			const { banners = [] } = await bannerInfo({ type: 0 });
			featuredData.bannerlist = banners;
		};
		getBanner();
		const getFeatruedSonglist = async () => {
			const { result = [] } = await recommendSonglist({ limit });
			featuredData.songlist = result;
		};
		getFeatruedSonglist();

		const toSonglistDetailPage = (id: number | string) => {
			router.push({
				path: '/songlist/:id',
				name: 'songlist',
				params: {
					id,
				},
			});
		};

		return () => {
			const { bannerlist, songlist } = featuredData;
			return (
				<section class="music-hall-featured">
					<RecommendBanner bannerList={bannerlist}></RecommendBanner>
					<section class="layer">
						<h6>推荐歌单</h6>
						<section class="item-wrap">
							<NGrid xGap={35} yGap={35} cols={6}>
								{songlist.map((item) => (
									<NGridItem class="item" key={item.id}>
										<div
											class="item-playbill"
											aspectratio="1"
											onClick={() => toSonglistDetailPage(item.id)}
										>
											<img
												loading="lazy"
												src={padPicCrop(item.picUrl, { x: 680, y: 680 })}
											/>
											<div class="item-desc">
												<p>{item.copywriter}</p>
											</div>
										</div>
										<p class="item-name">{item.name}</p>
									</NGridItem>
								))}
							</NGrid>
						</section>
					</section>
				</section>
			);
		};
	},
});
