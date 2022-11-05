/** @format */

import { currentTimeRefGlobal, durationRefGlobal } from '@/stores';
import { second2TimeStr } from '@/utils';
import { defineComponent, KeepAlive } from 'vue';
import { RouterView } from 'vue-router';
import './index.scss';

/**
 * 渲染KeepAliveRouterView
 * @returns
 */
export const renderKeepAliveRouterView = () => (
	<RouterView
		v-slots={{
			default(data: any) {
				const { Component } = data;
				return (
					<KeepAlive>
						<Component />
					</KeepAlive>
				);
			},
		}}
	></RouterView>
);

/**
 * 渲染歌曲播放时间
 * @returns
 */
export const renderCurrentPlayTime = () => (
	<div className="current-playtime">
		<span class="current">{second2TimeStr(currentTimeRefGlobal.value)}</span>
		<span> / </span>
		<span class="total">{second2TimeStr(durationRefGlobal.value)}</span>
	</div>
);
