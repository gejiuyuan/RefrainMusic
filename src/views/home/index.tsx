/** @format */

import { defineComponent, onMounted, PropType, ref } from 'vue';
import HomeLeft from '@/components/home-left';
import HomeHeader from '@components/home-header';
import HomeController from '@/components/player-controller';
import './index.scss';

import PlayerQueue from '@/components/player-queue';
import { NBackTop, NGrid, NGridItem } from 'naive-ui';
import { RouterView } from 'vue-router';

export default defineComponent({
	name: 'Home',
	setup(props, context) {
		return () => {
			return (
				<>
					<NGrid class="yplayer-homepage" cols={16}>
						<NGridItem span={2}>
							<HomeLeft></HomeLeft>
						</NGridItem>

						<NGridItem span={14}>
							<section class="home-main">
								<header class="main-header">
									<HomeHeader></HomeHeader>
								</header>

								<section class="main-content">
									<div class="player-container" scrollbar="overlay">
										<RouterView></RouterView>
									</div>
									<NBackTop
										listenTo=".player-container"
										visibilityHeight={100}
										right={80}
										bottom={120}
										themeOverrides={{
											width: '38px',
											height: '38px',
											iconSize: '20px',
										}}
									></NBackTop>
								</section>

								<footer class="main-footer">
									<HomeController></HomeController>
								</footer>
							</section>
						</NGridItem>
					</NGrid>

					<PlayerQueue></PlayerQueue>
				</>
			);
		};
	},
});
