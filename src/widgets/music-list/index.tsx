/** @format */

import { computed, defineComponent, PropType, reactive, ref, shallowReactive } from 'vue';

import { NGrid, NGridItem, NIcon } from 'naive-ui';
import './index.scss';
import { NewestSongInfo, SongInfo } from '@/types/song';
import {
	closest,
	freeze,
	getPointerOffsetElm,
	hasOwnProperty,
	is,
	padPicCrop,
} from '@/utils';
import {
	CurrentSongInfo,
	getModifiedNewestSongInfo,
	getModifiedSongInfo,
} from '@/utils/apiSpecial';
import { MusicLoveIcon, MusicSinger } from '../music-tiny-comp';
import usePlayerStore from '@/stores/player';
import { PAGE_SIZE } from '@/utils/preference';
import YuanInfinityScroll from '@widgets/infinity-scroll/infinity-scroll';

export const MusicItem = defineComponent({
	name: 'MusicItem',
	props: {
		musicInfo: {
			type: Object as PropType<CurrentSongInfo>,
			required: true,
		},
	},
	setup(props, { slots, emit }) {
		const musicItemRef = ref<HTMLDivElement>();
		const playerStore = usePlayerStore();

		const playBtnClickHandler = () => {
			playerStore.handlePlaySoundNeededData(props.musicInfo.id);
		};

		return () => {
			const {
				album: { picUrl },
				musicName,
				albumName,
				singers,
				localedDuration,
				localedMark,
				localedPublishTime,
			} = props.musicInfo;

			return (
				<div class="music-item" ref={musicItemRef}>
					<div className="playbill">
						<div aspectratio="1">
							<img loading="lazy" src={padPicCrop(picUrl, { x: 120, y: 120 })} alt="" />
							<i
								className="iconfont icon-bofan-radius"
								onClick={() => playBtnClickHandler()}
							></i>
						</div>
					</div>
					<div class="info">
						<h6 singallinedot title={musicName}>
							{musicName}
						</h6>
						<div singallinedot>
							<MusicSinger singers={singers}></MusicSinger>
						</div>
					</div>
					<div class="tools">
						<div class="tool-item" title="添加到" singallinedot>
							<i class="iconfont icon-plus"></i>
						</div>
						{<MusicLoveIcon songInfo={props.musicInfo}></MusicLoveIcon>}
						<div class="tool-item" title="下载" onClick={() => {}}>
							<i class="iconfont icon-download"></i>
						</div>
					</div>
				</div>
			);
		};
	},
});

export default defineComponent({
	name: 'MusicList',
	props: {
		category: {
			type: String as PropType<'common' | 'newest'>,
			required: false,
			default: 'common',
		},
		musiclists: {
			type: Array as PropType<(SongInfo | NewestSongInfo)[]>,
			required: false,
			default: () => [],
		},
		defaultLimit: {
			type: Number as PropType<number>,
			required: false,
			default: PAGE_SIZE.DEFAULT,
		},
		total: {
			type: Number as PropType<number>,
			required: false,
			default: 0,
		},
		gaps: {
			type: Object as PropType<Partial<Record<'x' | 'y', number>>>,
			required: false,
			default: () => ({ x: 20, y: 20 }),
		},
		cols: {
			type: Number as PropType<number>,
			required: false,
			default: 3,
		},
	},
	setup(props, { slots, emit }) {
		const category = props.category;

		const musicListRef = ref<HTMLElement>();

		const songData = computed(() => {
			const dataList = [...props.musiclists] || [];
			let realSongInfo: CurrentSongInfo[];
			if (category === 'newest') {
				realSongInfo = dataList.map((info) => {
					const realSongInfo = getModifiedNewestSongInfo(info as NewestSongInfo);
					return realSongInfo;
				});
			} else {
				realSongInfo = dataList.map((info) => {
					const realSongInfo = getModifiedSongInfo(info as SongInfo);
					return realSongInfo;
				});
			}
			return reactive(realSongInfo);
		});
		const suspensionInfo = shallowReactive({
			x: 0,
			y: 0,
			show: false,
		});

		const currentHoverMusicInfo = ref({} as (typeof songData.value)[number]);

		const judgeModifySuspension = (ev: MouseEvent) => {
			const tarMusicItemElm = closest(ev.target as Element, '.index-layer');
			if (!tarMusicItemElm) {
				suspensionInfo.show = false;
				return;
			}
			currentHoverMusicInfo.value =
				songData.value[+tarMusicItemElm.getAttribute('index')!];
			const { offsetX, offsetY } = getPointerOffsetElm(ev, musicListRef.value!);
			suspensionInfo.show = true;
			suspensionInfo.x = offsetX + 10;
			suspensionInfo.y = offsetY + 10;
		};
		const itemMouseEnter = (ev: MouseEvent) => {
			judgeModifySuspension(ev);
		};

		const itemMouseMove = (ev: MouseEvent) => {
			judgeModifySuspension(ev);
		};

		const itemMouseLeave = (ev: MouseEvent) => {
			suspensionInfo.show = false;
		};

		// const renderCurrentHoverItemSuspension = () => {
		//   const { musicName, localedDuration, localedMark, localedPublishTime, albumName } = currentHoverMusicInfo.value;
		//   return (
		//     <aside
		//       className="suspension"
		//       style={{
		//         visibility: suspensionInfo.show ? "visible" : "hidden",
		//         transform: `translate(${suspensionInfo.x}px, ${suspensionInfo.y}px)`,
		//       }
		//       }
		//     >
		//       <h6 singallinedot title={musicName}>
		//         {musicName}
		//       </h6>
		//       <div className="desc">
		//         <p><em>时长：</em>{localedDuration}</p>
		//         {localedMark && <p><em>评论数：</em>{localedMark}</p>}
		//         <p><em>发布时间：</em>{localedPublishTime}</p>
		//         <p><em>专辑：</em>《{albumName}》</p>
		//       </div>
		//     </aside >
		//   )
		// }

		return () => {
			const {
				gaps: { x, y },
				cols,
			} = props;
			return (
				<section
					class="music-list"
					ref={musicListRef}
					onMouseenter={itemMouseEnter}
					onMousemove={itemMouseMove}
					onMouseleave={itemMouseLeave}
				>
					<YuanInfinityScroll total={songData.value.length} sliceInterval={36}>
						{{
							default(currentCount: number) {
								return (
									<NGrid xGap={x} yGap={y} cols={cols}>
										{songData.value.slice(0, currentCount).map((item, index) => {
											return (
												<NGridItem>
													<div className="index-layer" index={index}>
														<MusicItem musicInfo={item}></MusicItem>
													</div>
												</NGridItem>
											);
										})}
									</NGrid>
								);
							},
						}}
					</YuanInfinityScroll>
					{/* {
            renderCurrentHoverItemSuspension()
          } */}
				</section>
			);
		};
	},
});
