/** @format */

import { defineComponent, unref } from '@vue/runtime-core';
import { PropType } from 'vue';
import { RouteLocationRaw, RouterLink, useLink } from 'vue-router';
import './index.scss';

export type RouteListProp = {
	text: string;
	to: RouteLocationRaw;
}[];

export default defineComponent({
	name: 'CommonRouterList',
	props: {
		routelist: {
			type: Array as PropType<RouteListProp>,
			required: true,
		},
	},
	setup(props, { emit, slots }) {
		const getRouteLinkClasses = (isActive: boolean) =>
			[isActive && 'active-online-link', 'common-list-item'].filter(Boolean).join(' ');

		return () => {
			const { routelist } = props;
			return (
				<ul class="common-router-list">
					{routelist.map((item: any) => (
						<li key={item.text}>
							<RouterLink
								custom
								to={item.to}
								v-slots={{
									default(data: ReturnType<typeof useLink>) {
										const { navigate, isActive } = data;
										return (
											<div
												onClick={navigate}
												class={getRouteLinkClasses(unref(isActive))}
											>
												{item.text}
											</div>
										);
									},
								}}
							></RouterLink>
						</li>
					))}
				</ul>
			);
		};
	},
});
