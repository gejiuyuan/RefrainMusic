/** @format */

import { computed, defineComponent, PropType, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { getLocaleCount, is, padPicCrop } from '@utils/index';
import { NEmpty, NGrid, NGridItem } from 'naive-ui';
import './index.scss';
import usePlayerStore from '@/stores/player';

export const formatVideoList = (videoList: any) => {
	videoList.forEach((v: any) => {
		v.playTimeStr = getLocaleCount(v.playTime);
		const { creator, artists } = v;
		v.userName = is.array(creator)
			? creator.map(({ userName }) => userName).join('、')
			: is.array(artists)
			? artists.map(({ name }) => name).join('、')
			: creator.nickname;
	});
	return videoList;
};

export default defineComponent({
	name: 'VideoList',
	props: {
		videoList: {
			type: Array as PropType<any[]>,
			required: true,
		},
		gaps: {
			type: Object as PropType<Partial<Record<'x' | 'y', number>>>,
			required: false,
			default: () => ({ x: 30, y: 30 }),
		},
		cols: {
			type: Number as PropType<number>,
			required: false,
			default: 5,
		},
	},
	setup(props, context) {
		const router = useRouter();
		const playerStore = usePlayerStore();

		const toVideoDetailPage = (vid: number) => {
			router.push({
				path: '/video',
				query: {
					vid,
				},
			});
			playerStore.setVideoIsPlay(true);
		};

		const renderList = (videoList: any[]) => {
			return videoList.map((video) => (
				<NGridItem>
					<section class="video-card" key={video.vid}>
						<div aspectratio={1.7}>
							<img
								loading="lazy"
								src={padPicCrop(video.coverUrl, { x: 280, y: 150 })}
								onClick={() => toVideoDetailPage(video.vid)}
								alt=""
							/>
						</div>
						<div class="video-main">
							<h5 class="video-title">{video.title}</h5>
							<p class="video-info">
								<span class="video-artist">{video.userName}</span>
								<span class="video-playcount">{video.playTimeStr}</span>
							</p>
						</div>
					</section>
				</NGridItem>
			));
		};

		return () => {
			const {
				gaps: { x, y },
				cols,
			} = props;
			const videoList = formatVideoList(props.videoList);
			return (
				<>
					<section class="video-container">
						{is.emptyArray(videoList) ? (
							<NEmpty description="阿娜达~没有视频噢~~" showDescription={true}></NEmpty>
						) : (
							<NGrid xGap={x} yGap={y} cols={cols}>
								{renderList(videoList)}
							</NGrid>
						)}
					</section>
				</>
			);
		};
	},
});
