/** @format */

import { watch, shallowReactive, toRefs, computed, defineComponent, PropType } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { SingerInfo } from '@/types/singer';
import './index.scss';
import { padPicCrop } from '@/utils';

import { NGrid, NGridItem } from 'naive-ui';

export default defineComponent({
	name: 'ArtistList',
	props: {
		singerList: {
			type: Array as PropType<any[]>,
			required: true,
		},
		gaps: {
			type: Object as PropType<Record<'x' | 'y', number>>,
			required: false,
			default: () => ({ x: 45, y: 45 }),
		},
		cols: {
			type: Number as PropType<number>,
			required: false,
			default: 7,
		},
	},
	setup(props, context) {
		const router = useRouter();

		const singers = computed(() => {
			const list = props.singerList as SingerInfo[];
			[...list].forEach((item) => {
				const { alias, name } = item;
				const aliasStr = alias.join('、');
				item.fullName = name + (aliasStr && `（${aliasStr}）`);
			});
			return list;
		});

		const singerItemClick = (item: SingerInfo) => {
			router.push({ path: '/artist', query: { id: item.id } });
		};

		return () => {
			const {
				cols,
				gaps: { x, y },
			} = props;
			return (
				<section class="singer-list">
					<NGrid xGap={x} yGap={y} cols={cols}>
						{singers.value.map((item) => (
							<NGridItem key={item.id}>
								<div class="singer-item" onClick={() => singerItemClick(item)}>
									<div aspectratio="1">
										<img
											loading="lazy"
											src={padPicCrop(item.picUrl, { x: 180, y: 180 })}
											title={item.picUrl}
											alt={item.picUrl}
										/>
									</div>
									<div class="singer-name" singallinedot title={item.fullName}>
										{item.fullName}
									</div>
								</div>
							</NGridItem>
						))}
					</NGrid>
				</section>
			);
		};
	},
});
