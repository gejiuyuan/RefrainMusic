import useUserStore from "@/stores/user";
import { phoneVerifyPatt, UNICODE_CHAR } from "@/utils";
import { FormItemRule, NButton, NCol, NEmpty, useMessage } from "naive-ui";
import {
  defineComponent,
  watch,
} from "vue";
import './index.scss';

export default defineComponent({
  name: "MyPage",
  setup(props, context) {
    const message = useMessage();
    const userStore = useUserStore();

    watch(() => userStore.isLogin, (isLogin) => {
      if (isLogin) {

      }
      else {
        message.warning(`亲~~还没有登录噢~~${UNICODE_CHAR.smile}`, {
          duration: 4000
        })
      }
    })

    return () => {

      if (!userStore.isLogin) {
        return <NEmpty description="亲~~还没有登录噢~~" showDescription={true}></NEmpty>
      }

      return (
        <>
          <img src={userStore.detail.profile.avatarUrl} alt="" />

        </>
      )
    }
  },
});
