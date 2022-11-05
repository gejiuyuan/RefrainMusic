/** @format */

import { computed, defineComponent, ref, shallowReactive, Suspense, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderSetting from '@/widgets/header-setting';
import Battery from '@/widgets/battery';
import UserLogin from '@widgets/user-login';
import { NMention, NInput, NGrid, NGridItem } from 'naive-ui';
import { useBetterFullscreen } from '@/hooks';
import './index.scss';

export default defineComponent({
	name: 'HomeHeader',
	setup(props, context) {
		const searchWord = ref('');
		const route = useRoute();
		const router = useRouter();
		const routeBack = () => router.back();
		const routeNext = () => router.forward();

		const updateSearchValue = (keywords: string) => {
			searchWord.value = keywords;
		};
		const searchChange = () => {
			router.push({
				path: '/search',
				query: {
					keywords: searchWord.value,
				},
			});
		};

		const { isSupported, toggle, isFullscreen } = useBetterFullscreen();
		if (!isSupported) {
			return;
		}
		const renderFullScreen = () => (
			<section class="header-fullscreen" onClick={toggle}>
				<i
					class="iconfont icon-fullscreen"
					title="进入全屏"
					hidden={isFullscreen.value}
				></i>
				<i
					class="iconfont icon-cancelfullscreen"
					title="取消全屏"
					hidden={!isFullscreen.value}
				></i>
			</section>
		);

		return () => {
			return (
				<>
					<section className="header-left">
						<div class="page-turn" title="后退" onClick={routeBack}>
							<i class="iconfont icon-arrowleft"></i>
						</div>

						<div class="page-turn" title="前进" onClick={routeNext}>
							<i class="iconfont icon-arrowright"></i>
						</div>

						<NInput
							class="music-search-input"
							size="small"
							onChange={searchChange}
							onUpdateValue={updateSearchValue}
							placeholder="搜索音乐、视频、歌词、电台"
							clearable={true}
							round={true}
						></NInput>
					</section>

					<section class="header-right">
						<UserLogin></UserLogin>
						<Battery></Battery>
						<HeaderSetting></HeaderSetting>
						{renderFullScreen()}
					</section>
				</>
			);
		};
	},
});
