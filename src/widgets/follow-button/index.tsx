import { artistSub } from "@/api/singer";
import { unOrFocusUser } from "@/api/user";
import useUserStore from "@/stores/user";
import { NOOP, UNICODE_CHAR } from "@/utils";
import { messageBus } from "@/utils/event/register";
import { NxButton } from "naive-ui";
import Vue, { defineComponent, PropType } from "vue";
import "./index.scss";

export enum FollowType {
  user = 'user',
  artist = 'artist',
}

export default defineComponent({
  name: "FollowButton",
  props: {
    followed: {
      type: Boolean,
      required: false,
      default: false,
    },
    onUpdateFollow: {
      type: Function,
      required: false,
      default: NOOP,
    },
    userId: {
      type: [Number, String] as PropType<string | number>,
      required: true,
    },
    followType: {
      type: String as PropType<keyof typeof FollowType>,
      required: false,
      default: FollowType.user,
    }
  },
  setup(props, { emit, slots }) {
    const userStore = useUserStore();
    const targetRequestMethod = 
      props.followType === FollowType.artist 
        ? artistSub 
        : unOrFocusUser;

    const toggleHandler = async (isFollow: boolean) => {
      if(!userStore.isLogin) {
        messageBus.dispatch('warnMessage', '阿娜达~要先登录账号噢~~');
        return;
      }  
      const { code } = await targetRequestMethod({
        id: props.userId,
        sure: isFollow
      }); 
      const isSuccess = code === 200;
      let messageType = 'warnMessage';
      let msg = '关注失败！';
      if(isSuccess) {
        props.onUpdateFollow(isFollow);
        messageType = 'successMessage';
        msg = isFollow ? `关注成功~~${UNICODE_CHAR.smile}` : `取消关注成功~~${UNICODE_CHAR.hugface}`;
      }
      messageBus.dispatch(messageType, msg);
    }

    return () => {
      const { followed } = props;
      return (
        <NxButton type="primary" dashed={!followed} size="small" onClick={() => toggleHandler(!followed) }>
          <div className="follow-button">
            <i class={`iconfont ${followed ? 'icon-gou' : 'icon-plus'}`}></i>
            <em>{ followed ? '已关注' : '关注' }</em>
          </div>
        </NxButton> 
      );
    };
  },
});
