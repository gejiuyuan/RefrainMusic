/** @format */

import { musicCommentLike } from '@/api/music';
import { CommentType } from '@/dependency/enum';
import { SongComment, SongCommentItem } from '@/types/song';
import { getLocaleDate, padPicCrop, spliceTime2Second, UNICODE_CHAR } from '@/utils';
import { messageBus } from '@/utils/event/register';
import { defineComponent, inject, PropType, Ref } from 'vue';
import { useRouter } from 'vue-router';
import './index.scss';

const CommentItemComp = defineComponent({
	name: 'CommentItemComp',
	props: {
		commentItem: {
			type: Object as PropType<SongCommentItem>,
			required: true,
		},
		sourceId: {
			type: [Number, String] as PropType<number | string>,
			required: true,
		},
		commentType: {
			type: Number as PropType<CommentType>,
			required: true,
		},
	},
	setup(props) {
		const commentLikeHandler = async () => {
			const {
				commentItem: { commentId, liked },
				sourceId,
				commentType,
			} = props;
			const unOrLike = liked ? 0 : 1;
			const isSuccess = await musicCommentLike({
				cid: commentId,
				id: sourceId,
				type: commentType as CommentType,
				t: unOrLike,
			});
			if (isSuccess) {
				props.commentItem.liked = !!unOrLike;
				props.commentItem.likedCount += !!unOrLike ? 1 : -1;
				messageBus.dispatch(
					'successMessage',
					`${unOrLike ? '点赞成功!!' : '取消点赞成功~~'}${UNICODE_CHAR.smile}`,
				);
			}
		};

		const renderCommentLike = () => {
			const { liked, likedCount } = props.commentItem;
			const likedClass = liked ? 'liked' : '';
			return (
				<span
					class={`span-item comment-like-span ${likedClass}`}
					onClick={commentLikeHandler}
				>
					<i class="iconfont icon-dianzan comment-like"></i>
					<em>{likedCount}</em>
				</span>
			);
		};

		return () => {
			const {
				commentItem: { user, time, content },
			} = props;
			const userImgUrl = padPicCrop(user.avatarUrl, {
				x: 44,
				y: 44,
			});
			return (
				<div class="song-comment-item">
					<div class="user-icon">
						<i aspectratio={1}>
							<img src={userImgUrl} alt={userImgUrl} title={user.nickname} />
						</i>
					</div>
					<div class="comment-main">
						<div class="comment-header">
							<em>{user.nickname}</em>
							<div>{getLocaleDate(time)}</div>
						</div>
						<div class="comment-content">{content}</div>
						<div class="comment-operation">
							{renderCommentLike()}
							<span class="span-item reply-span">
								<em>回复</em>
							</span>
							<span class="span-item report-span">
								<em>举报</em>
							</span>
						</div>
					</div>
				</div>
			);
		};
	},
});

export default defineComponent({
	name: 'SongComment',
	setup() {
		const router = useRouter();
		const commentData = inject<Ref<SongComment>>('commentData')!;

		return () => {
			const { hotComments, comments } = commentData.value;
			const musicId = router.currentRoute.value.params.id as string;

			return (
				<div class="song-comment-container">
					<div class="comment-category-layer">
						<h4 class="category-headline">精彩评论</h4>
						{hotComments.map((data) => {
							return (
								<CommentItemComp
									commentItem={data}
									sourceId={musicId}
									commentType={CommentType.music}
								></CommentItemComp>
							);
						})}
					</div>
					<div class="comment-category-layer">
						<h4 class="category-headline">全部评论</h4>
						{comments.map((data) => {
							return (
								<CommentItemComp
									commentItem={data}
									sourceId={musicId}
									commentType={CommentType.music}
								></CommentItemComp>
							);
						})}
					</div>
				</div>
			);
		};
	},
});
