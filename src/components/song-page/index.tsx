/** @format */

import { getMusicComment, getMusicDetail } from '@/api/music';
import { OriginCoverType, SongFee } from '@/dependency/enum';
import { onFilteredBeforeRouteUpdate } from '@/hooks/onRouteHook';
import { SongComment, SongInfo } from '@/types/song';
import { objToPathname, padPicCrop } from '@/utils';
import { renderKeepAliveRouterView } from '@/widgets/common-renderer';
import CommonRouterList from '@/widgets/common-router-list';
import { defineComponent, provide, reactive, ref, shallowReactive } from 'vue';
import { RouteParams, useRouter } from 'vue-router';
import './index.scss';
import { getSongDetailList } from './util';

import ReplyTextarea from '@widgets/reply-textarea';

const songPageTemplateRouteList = [
	{
		to: '/song/:id/comment',
		text: '评论',
	},
	{
		to: '/song/:id/detail',
		text: '详情',
	},
];

export default defineComponent({
	name: 'SongPage',
	setup() {
		const router = useRouter();
		const songPageRouteList = shallowReactive<typeof songPageTemplateRouteList>([]);

		const songCommentDataRef = ref<SongComment>({
			total: 0,
			moreHot: false,
			more: false,
			userId: 0,
			isMusician: false,
			commentBanner: null,
			comments: [],
			hotComments: [],
			topComments: [],
		});
		provide('commentData', songCommentDataRef);

		const songDetailDataRef = ref<SongInfo>({
			id: 0,
			name: '',
			alia: [],
			dt: 0,
			pop: 0,
			ar: [],
			al: {
				id: 0,
				name: '',
				picUrl: '',
			},
			publishTime: 0,
			fee: SongFee.freeOrNoCopyright,
			h: Object.create(null),
			m: Object.create(null),
			l: Object.create(null),
			mark: 0,
			originCoverType: OriginCoverType.unkown,
			privilege: {
				id: 0,
				chargeInfoList: [],
			},
		});
		provide('songDetail', songDetailDataRef);

		const syncRelativeData = () => {
			updatePageRouteList();
			getCommentDate();
			getSongDetail();
		};

		const getSongDetail = async () => {
			const detailData = await getMusicDetail({
				ids: router.currentRoute.value.params.id,
			});
			songDetailDataRef.value = {
				...detailData.songs[0],
				privilege: detailData.privileges[0],
			};
		};

		const getCommentDate = async () => {
			const { params } = router.currentRoute.value;
			const data = await getMusicComment({
				id: params.id as string,
			});
			songCommentDataRef.value = data;
		};

		/**
		 * 更新RouteList路由导航数据
		 */
		const updatePageRouteList = () => {
			const { params } = router.currentRoute.value;
			songPageTemplateRouteList.forEach(({ text, to }, i) => {
				songPageRouteList[i] = {
					text,
					to: to.replace(':id', objToPathname(params, false)),
				};
			});
		};

		syncRelativeData();
		onFilteredBeforeRouteUpdate((to, from) => {
			const { id: toId } = to.params;
			const { id: fromId } = from.params;
			if (toId != fromId) {
				syncRelativeData();
			}
		});

		return () => {
			const {
				al: { picUrl },
				name,
			} = songDetailDataRef.value;
			const songInfoList = getSongDetailList(songDetailDataRef.value).slice(0, 2);

			return (
				<section id="song-detail-page">
					<header class="song-detail-header">
						<div class="song-pic">
							<div aspectratio={1}>
								<img src={padPicCrop(picUrl, { x: 200, y: 200 })} />
							</div>
						</div>
						<div class="song-info">
							<h2>{name}</h2>
							<ul>
								{songInfoList.map(({ attr, value }) => {
									return (
										<li>
											<em>{attr}: </em>
											<em>{value}</em>
										</li>
									);
								})}
							</ul>
						</div>
					</header>
					<section class="song-reply-textarea">
						<ReplyTextarea></ReplyTextarea>
					</section>
					<CommonRouterList routelist={songPageRouteList}></CommonRouterList>
					{renderKeepAliveRouterView()}
				</section>
			);
		};
	},
});
