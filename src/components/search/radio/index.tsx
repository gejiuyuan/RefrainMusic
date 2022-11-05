/** @format */

import { defineComponent, markRaw, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import './index.scss';

export default defineComponent({
	name: 'SearchRadio',
	setup(props, context) {
		return () => {
			return <section class="search-radio"></section>;
		};
	},
});
