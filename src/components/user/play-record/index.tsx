/** @format */

import { toRefs, watch, ref, Ref, computed, inject, defineComponent } from 'vue';
import {
	useRouter,
	useRoute,
	onBeforeRouteLeave,
	RouteLocationRaw,
	RouteLocationNormalized,
} from 'vue-router';
import MusicList from '@/widgets/music-list';

import { PlayRecord } from '@/types/song';
import { defaultPlayRecordType, playRecordTimeRange } from '../config';
import './index.scss';
import { NRadio, NRadioButton, NRadioGroup, NSpace, NIcon } from 'naive-ui';
import { onFilteredBeforeRouteUpdate } from '@/hooks/onRouteHook';

export default defineComponent({
	name: 'PlayRecord',
	setup(props, context) {
		const route = useRoute();
		const router = useRouter();

		const playlist = inject<PlayRecord>('playRecordData')!;
		const userInfo = inject<Ref<any>>('userInfo')!;

		const musiclist = computed(() => playlist.map(({ song }) => song));

		const curPlayRecordRange = ref(1);

		const playRecordRangeChange = (typeVal: number | string) => {
			router.push({
				path: route.path,
				query: { ...route.query, type: typeVal },
			});
		};

		const routeUpdateHandler = async ({ query: { type } }: RouteLocationNormalized) => {
			const curType = Number(type);
			const isExsit = playRecordTimeRange.some(({ type }) => curType === type);
			curPlayRecordRange.value = isExsit ? curType : defaultPlayRecordType;
		};
		routeUpdateHandler(route);

		onFilteredBeforeRouteUpdate((to) => {
			routeUpdateHandler(to);
		});

		return () => {
			const { listenSongs, peopleCanSeeMyPlayRecord, profile } = userInfo.value;
			return (
				<section class="user-play-record">
					<section class="play-record-header">
						<div class="record-desc">
							<i className="record-icon-info"></i>
							最近累计听歌
							<span>{listenSongs}</span>首
						</div>
						{peopleCanSeeMyPlayRecord && (
							<div class="record-type">
								<NRadioGroup
									value={curPlayRecordRange.value}
									onUpdateValue={playRecordRangeChange}
								>
									<NSpace>
										{playRecordTimeRange.map((item, i) => (
											<NRadio value={item.type} key={item.text}>
												{item.text}
											</NRadio>
										))}
									</NSpace>
								</NRadioGroup>
							</div>
						)}
					</section>

					{peopleCanSeeMyPlayRecord ? (
						<MusicList musiclists={musiclist.value} cols={4}></MusicList>
					) : (
						<p class="canNotSee">
							<span>{profile?.nickname}</span>
							没有开放播放记录查看权限喔~~
						</p>
					)}
				</section>
			);
		};
	},
});
