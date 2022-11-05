/** @format */

import { getAllVideoList, getVideoCategoryList, getVideoTagList } from '@/api/video';
import { allVideoDatasItem, VideoTagItem } from '@/types/video';
import { defineComponent, reactive, readonly, ref, watch } from 'vue';
import VideoList from '@widgets/video-list';
import './index.scss';
import YuanButton from '@/widgets/yuan-button';
import { messageBus } from '@/utils/event/register';
import { UNICODE_CHAR } from '@/utils';
import useUserStore from '@/stores/user';
import { NEmpty } from 'naive-ui';

export interface AllVideosInfoType {
	list: allVideoDatasItem[];
	hasMore: boolean;
	msg: string;
}

export default defineComponent({
	name: 'OnlineVideoAll',
	setup(props, context) {
		const allVideosInfo = reactive<AllVideosInfoType>({
			list: [],
			hasMore: true,
			msg: '',
		});

		const userStore = useUserStore();

		const loadCount = ref(0);

		const updateAllVideoList = () => {
			getAllVideoList({
				offset: loadCount.value,
			}).then(({ code, datas, hasmore, msg }) => {
				if (code !== 200) {
					messageBus.dispatch('errorMessage', msg);
					return;
				}
				allVideosInfo.list.push(...datas.map(({ data }: allVideoDatasItem) => data));
				allVideosInfo.hasMore = hasmore;
				allVideosInfo.msg = msg;
			});
		};

		watch(
			() => userStore.isLogin,
			(isLogin) => {
				if (isLogin) {
					updateAllVideoList();
				}
			},
			{
				immediate: true,
			},
		);

		const loadMoreHandler = () => {
			if (!allVideosInfo.hasMore) {
				return;
			}
			loadCount.value++;
			updateAllVideoList();
		};

		return () => {
			if (!userStore.isLogin) {
				return (
					<NEmpty
						showDescription
						size="large"
						description="需要登录才能查看视频哦~~"
					></NEmpty>
				);
			}
			const { hasMore } = allVideosInfo;
			return (
				<section class="online-video-all">
					<section className="video-layer">
						<VideoList videoList={allVideosInfo.list}></VideoList>
					</section>
					<div className="video-all-foot">
						<YuanButton
							text={'加载更多'}
							onClick={() => loadMoreHandler()}
							disabled={!hasMore}
						></YuanButton>
					</div>
				</section>
			);
		};
	},
});
