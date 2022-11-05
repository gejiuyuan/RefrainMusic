/** @format */

import { defineComponent, markRaw, inject, onMounted, ref, PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SearchCloundData } from '../index';
import './index.scss';
import { SearchUserProfileItem } from '@/types/user';
import { getLocaleCount, padPicCrop } from '@/utils';

export const SearchUserItem = defineComponent({
	name: 'SearchUserItem',
	props: {
		userInfo: {
			type: Object as PropType<SearchUserProfileItem>,
			required: true,
		},
	},
	setup({ userInfo }, context) {
		const router = useRouter();
		const route = useRoute();
		const toUserDetailPage = (subPath?: string) => {
			router.push({
				path: `/user${subPath ? '/' + subPath : ''}`,
				query: {
					id: userInfo.userId,
				},
			});
		};

		return () => {
			const { nickname, avatarUrl, followed, followeds, follows, playlistCount, mutual } =
				userInfo;
			return (
				<div class="search-user-item" onClick={(ev) => toUserDetailPage()}>
					<img loading="lazy" src={padPicCrop(avatarUrl, { x: 100, y: 100 })} alt="" />
					<em class="user-name">{nickname}</em>
					<em
						class="user-playlist-count"
						onClick={(ev) => {
							ev.stopPropagation();
							toUserDetailPage('songlist');
						}}
					>
						歌单：
						{getLocaleCount(playlistCount)}
					</em>
					<em class="user-fans">
						粉丝：
						{getLocaleCount(followeds)}
					</em>
				</div>
			);
		};
	},
});

export default defineComponent({
	name: 'SearchUser',
	setup(props, context) {
		const searchData = inject('searchCloundData') as SearchCloundData;

		return () => {
			const {
				user: { userprofiles, userprofilesCount },
			} = searchData;
			return (
				<section class="search-user">
					{userprofiles.map((item) => {
						return <SearchUserItem userInfo={item}></SearchUserItem>;
					})}
				</section>
			);
		};
	},
});
