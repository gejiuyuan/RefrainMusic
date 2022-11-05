/** @format */

import {
	PlayStatusSwitch,
	Volume,
	MusicLoveIcon,
	MusicSinger,
	PlayOrder,
} from '@/widgets/music-tiny-comp';
import './index.scss';
import { padPicCrop } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import usePlayerStore, {
	currentSongRefGlobal,
	playerQueueShow,
	playerQueue,
	toPrevious,
	toNext,
} from '@/stores/player';
import ProgressBar, { ProgressInfo } from '@/widgets/progress-bar';
import { renderCurrentPlayTime } from '@/widgets/common-renderer';
import { computed, defineComponent, PropType, ref } from 'vue';
import {
	currentTimeRefGlobal,
	durationRefGlobal,
	nextSeekTimeRefGlobal,
	playingRefGlobal,
} from '@/stores/audio';
import { onKeyUp } from '@vueuse/core';

export const isCtrlAndArrowRight = ({ ctrlKey, key }: KeyboardEvent) => {
	return ctrlKey && key === 'ArrowRight';
};

export const isCtrlAndArrowLeft = ({ ctrlKey, key }: KeyboardEvent) => {
	return ctrlKey && key === 'ArrowLeft';
};

export default defineComponent({
	name: 'PlayerController',
	props: {
		displayInLyricPage: {
			type: Boolean as PropType<boolean>,
			required: false,
			default: false,
		},
	},
	setup(props, { slots, emit }) {
		const router = useRouter();
		const route = useRoute();
		const playerStore = usePlayerStore();

		/**
		 * Ctrl+Left切换上一首
		 */
		onKeyUp(isCtrlAndArrowLeft, toPrevious);

		/**
		 * Ctrl+Right切换下一首
		 */
		onKeyUp(isCtrlAndArrowRight, toNext);

		const showOrHidePlayerDetailPage = () => {
			const { query, path } = route;
			router.push({
				path,
				query: {
					...query!,
					playerStatus: Number(!props.displayInLyricPage),
				},
			});
		};

		const showPlayerQueueHandler = () => {
			playerQueueShow.value = true;
		};

		const progressUp = ({ decimal }: ProgressInfo) => {
			nextSeekTimeRefGlobal.value = durationRefGlobal.value * decimal;
			playingRefGlobal.value = true;
		};

		const toCurrentSongPage = () => {
			router.push({
				path: `/song/${currentSongRefGlobal.value.id}`,
			});
		};

		return () => {
			const currentTimeValue = currentTimeRefGlobal.value;
			const duration = durationRefGlobal.value;
			const { id, musicName, singers, album } = currentSongRefGlobal.value;
			const queueSongList = playerQueue.value;
			return (
				<section class="player-controller" lyricPageShow={props.displayInLyricPage}>
					<div className="controller-progressbar">
						<ProgressBar
							currentRatio={(currentTimeValue * 100) / duration}
							onDown={() => {}}
							onMove={() => {}}
							onChange={() => {}}
							onUp={progressUp}
						></ProgressBar>
					</div>

					<section class="controller-main">
						<section class="main-block main-left" visibility={!props.displayInLyricPage}>
							<div class="music-playbill" onClick={showOrHidePlayerDetailPage}>
								<img src={padPicCrop(album.picUrl, { x: 180, y: 180 })} alt="" />
								<div class="playbill-mask">
									<i class="iconfont icon-shanghua"></i>
								</div>
							</div>

							<div className="music-info">
								<div
									class="name"
									title={musicName}
									singallinedot
									onClick={toCurrentSongPage}
								>
									{musicName}
								</div>
								<MusicSinger singers={singers}></MusicSinger>
							</div>
						</section>

						<section class="main-block main-center">
							<Volume></Volume>
							<div className="prev-music" title="上一首 Ctrl+Left" onClick={toPrevious}>
								<i class="iconfont icon-prevmusic"></i>
							</div>
							<div class="controller-play-switch">
								<PlayStatusSwitch></PlayStatusSwitch>
							</div>
							<div className="next-music" title="下一首 Ctrl+Right" onClick={toNext}>
								<i class="iconfont icon-nextmusic"></i>
							</div>
							<PlayOrder></PlayOrder>
						</section>

						<section class="main-block main-right">
							{renderCurrentPlayTime()}
							<MusicLoveIcon songInfo={currentSongRefGlobal.value}></MusicLoveIcon>
							<div
								className="play-queue-icon"
								onClick={showPlayerQueueHandler}
								title="播放队列"
							>
								<i className="iconfont icon-yinleliebiao"></i>
								<span>{queueSongList.length}</span>
							</div>
						</section>
					</section>
				</section>
			);
		};
	},
});
