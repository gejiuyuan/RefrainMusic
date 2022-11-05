/** @format */

import { defineComponent, markRaw, onMounted, readonly, ref } from 'vue';
import './index.scss';

export default defineComponent({
	name: 'musicRadio',
	setup(props, context) {
		return () => {
			return <section class="music-radio">音乐电台</section>;
		};
	},
});
