/** @format */

import { shallowReactive, defineComponent, PropType } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';

import {
	getLocaleCount,
	getLocaleDate,
	msSecondToTimeStr,
	padPicCrop,
	second2TimeStr,
} from '@utils/index';
import { Mv, SearchMv } from '@/types/mv';
import RoutePagination from '@widgets/route-pagination';
import { PAGE_SIZE } from '@/utils/preference';
import { NGrid, NGridItem } from 'naive-ui';
import './index.scss';
import { onFilteredBeforeRouteUpdate } from '@/hooks/onRouteHook';

export type MvListType = Mv & SearchMv;

export default defineComponent({
	name: 'MvList',
	props: {
		mvlists: {
			type: Array as PropType<MvListType[]>,
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
			default: () => ({ x: 30, y: 30 }),
		},
		cols: {
			type: Number as PropType<number>,
			required: false,
			default: 5,
		},
		showPagination: {
			type: Boolean as PropType<boolean>,
			required: false,
			default: false,
		},
		hasMore: {
			type: Boolean as PropType<boolean>,
			required: false,
			default: false,
		},
	},
	setup(props, context) {
		const route = useRoute() as PlainObject;
		const router = useRouter();
		const mvListPagiInfo = shallowReactive({
			limit: 0,
			offset: 0,
			total: 0,
			sizeArr: [] as number[],
		});

		const updateTolListInfo = (query: PlainObject) => {
			const { defaultLimit, total } = props;
			const { limit = defaultLimit, offset = 0 } = query;
			mvListPagiInfo.limit = limit;
			mvListPagiInfo.offset = offset;
			mvListPagiInfo.total = total;
			mvListPagiInfo.sizeArr = Array(2)
				.fill('')
				.map((v, i) => defaultLimit * (i + 1));
		};
		updateTolListInfo(route.query);

		onFilteredBeforeRouteUpdate((to) => {
			updateTolListInfo(to.query);
		});

		const toMvDetailPage = (id: string | number) => {
			router.push({
				path: '/mv',
				query: {
					id,
				},
			});
		};

		const renderMvLists = () => {
			const {
				gaps: { x, y },
				cols,
				mvlists,
			} = props;
			mvlists.forEach((item) => {
				item.playCountStr = getLocaleCount(item.playCount);
			});
			return (
				<NGrid class="mv-list" xGap={x} yGap={y} cols={cols}>
					{mvlists.map(
						({ name, imgurl16v9, cover, duration, id, publishTime, playCountStr }) => (
							<NGridItem key={id}>
								<div class="mv-item" onClick={() => toMvDetailPage(id)}>
									<div aspectratio="1.7">
										<img
											loading="lazy"
											src={padPicCrop(imgurl16v9 || cover, { x: 240, y: 140 })}
											alt={name}
											title={name}
										/>
									</div>
									<h6>{name}</h6>
									<div class="desc">
										<p class="duration">
											<span>时长：</span>
											<em>{msSecondToTimeStr(duration)}</em>
										</p>
										{publishTime && (
											<p class="publishtime">
												<span>发布：</span>
												<em>{publishTime}</em>
											</p>
										)}
									</div>
									<em class="playCount">{playCountStr}</em>
								</div>
							</NGridItem>
						),
					)}
				</NGrid>
			);
		};

		return () => {
			const { mvlists } = props;
			return (
				<>
					{mvlists.length ? (
						<section class="mv-wrap">
							{renderMvLists()}
							{props.showPagination && (
								<section class="songlist-pagination">
									<RoutePagination
										pagiInfo={mvListPagiInfo}
										hasMore={props.hasMore}
									></RoutePagination>
								</section>
							)}
						</section>
					) : (
						<section class="mv-empty">
							<span>这哩啥也没有喔~</span>
						</section>
					)}
				</>
			);
		};
	},
});
