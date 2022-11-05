/** @format */

import { defineComponent, inject, onActivated, toRefs } from 'vue';
import './index.scss';
import MusicList from '@/widgets/music-list';

export default defineComponent({
	name: 'songlistComment',
	setup(props, context) {
		const songlistInfo = inject('songlistInfo') as any;
		return () => {
			const { playlist, showIndex } = songlistInfo;
			return <MusicList musiclists={playlist.tracks} cols={4}></MusicList>;
		};
	},
});
