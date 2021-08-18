import { loginStatus, loginWithPhone } from "@/api/auth";
import { userAccount, userDetail, userLikeList, userPlaylist, userSubcount } from "@/api/user";
import { NaiveFormValidateError } from "@/shim";
import useUserStore from "@/stores/user";
import { phoneVerifyPatt } from "@/utils";
import { FormItemRule, NButton, NCol, NForm, NFormItem, NGrid, NGridItem, NInput, NRow, NxButton } from "naive-ui";
import {
  getCurrentInstance,
  markRaw,
  defineComponent,
  shallowRef,
  ref,
  Teleport,
  shallowReactive,
  PropType,
  ComponentInternalInstance,
  computed,
  watch,
} from "vue";
import { routerViewLocationKey, useRouter } from "vue-router";
import './index.scss';

export default defineComponent({
  name: "UserLogin",
  setup(props, context) {
    // const vm = getCurrentInstance()!;
    const loginWithPhoneFormRef = ref();
    const loginDialogShow = ref(false);
    const userStore = useUserStore();
    const router = useRouter();

    watch(() => userStore.isLogin, async (isLogin) => {
      if (isLogin) {
        userAccount().then(({ account: { id } }) => {

          //我的详细信息
          userDetail(id).then(detail => {
            userStore.detail = detail
          });

          //我喜欢的音乐ids
          userLikeList({ uid: id }).then(({ ids }) => userStore.myLoveListIds = ids);

          //我的歌单
          userPlaylist({ uid: id }).then(({ playlist }) => {
            userStore.playlist = playlist.reduce(
              (categoryItem: any, list: any) => {
                categoryItem[list.userId === +id ? 'myCreated' : 'myCollection'].push(list);
                return categoryItem;
              },
              {
                myCreated: [],
                myCollection: []
              }
            );
          });

        });

        //订阅数量等相关信息
        userSubcount().then((subCount) => {
          userStore.subCount = subCount;
        });

      }

    }, {
      immediate: true
    })

    const loginBtnClick = () => {
      if (userStore.isLogin) {
        router.push({
          path: '/myPage',
          query: { id: userStore.detail.profile.userId }
        })
        return
      }
      loginDialogShow.value = true;
    }

    const closeLoginDialog = () => {
      loginDialogShow.value = false;
    }

    const phoneInfo = shallowReactive({
      number: '',
      password: '',
    })

    const phoneRules: Record<'number' | 'password', FormItemRule | FormItemRule[]> = {
      number: [
        {
          required: true,
          message: "阿娜哒~要输入正确的手机号噢~~",
          validator(rule, value) {
            return !!value.match(phoneVerifyPatt)
          },
          trigger: ['blur'],
        }
      ],
      password: {
        required: true,
        message: '请输入密码',
      }
    }

    const loginByPhoneClick = () => {
      loginWithPhoneFormRef.value!.validate(async (error: NaiveFormValidateError) => {
        if (error) {
          return
        }
        const result = await loginWithPhone({
          phone: phoneInfo.number,
          password: phoneInfo.password
        })
        result && userStore.setUserInfo(result)
      })
    }

    const userLoginInfo = computed(() => {
      const isLogin = userStore.isLogin;
      const style = {
        backgroundImage: isLogin ? `url(${userStore.detail.profile.avatarUrl})` : ''
      }
      const name = isLogin ? userStore.detail.profile.nickname : '点击登录'
      return {
        style, name
      }
    })

    return () => {

      const loginBaseInfo = userLoginInfo.value;

      return (
        <>
          <div class="user-login" onClick={loginBtnClick}>
            <i class="user-avatar" style={loginBaseInfo.style} singallinedot></i>
            <em class="user-text">{loginBaseInfo.name}</em>
          </div>
          <Teleport to=".theme-layer">

            <aside class="login-dialog" visibility={!userStore.isLogin && loginDialogShow.value}>
              <header class="login-dialog-head">
                <i class="iconfont icon-guanbi" onClick={closeLoginDialog}></i>
              </header>

              <section class="login-dialog-body">

                <div className="login-by-phone">
                  <NForm
                    ref={loginWithPhoneFormRef}
                    model={phoneInfo}
                    rules={phoneRules}
                  >
                    <NFormItem path="number" label="电话">
                      <NInput value={phoneInfo.number} placeholder="赶紧输入⑧!" onUpdateValue={(value) => phoneInfo.number = value}></NInput>
                    </NFormItem>
                    <NFormItem path="password" label="密码">
                      <NInput value={phoneInfo.password} placeholder="赶紧输入⑧!" type={"password" as any} onUpdateValue={(value) => phoneInfo.password = value}></NInput>
                    </NFormItem>

                    <div class="login-button">
                      <NxButton type="error" attrType="submit" onClick={loginByPhoneClick}>登录</NxButton>
                    </div>

                  </NForm>
                </div>

              </section>

            </aside>

          </Teleport>

        </>
      )
    }
  },
});
