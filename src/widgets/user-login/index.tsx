import { getQrCodeImgInfo, getQrCodeKey, getQrCodeScanStatus, loginStatus, loginWithPhone } from "@/api/auth";
import { userAccount, userDetail, userLikeList, userPlaylist, userSubcount } from "@/api/user";
import { NaiveFormValidateError } from "@/shim";
import useUserStore from "@/stores/user";
import { is, phoneVerifyPatt } from "@/utils";
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
  watchEffect,
  reactive,
} from "vue";
import { routerViewLocationKey, useRouter } from "vue-router";
import './index.scss';
 
const loginTypes = [
  {key: 'phone', text: '手机号登录'},
  {key: 'qrCode', text: '二维码登录'},
  {key: 'email', text: '邮箱登录'},
]

export enum QrCodeStatus {
  '二维码已失效，请重新扫码登录' = 800,
  '请打开网易云音乐APP进行扫码~~' = 801,
  '正在登录，等待确认中...' = 802,
  '授权登录成功~~~' = 803,
}

export default defineComponent({
  name: "UserLogin",
  setup(props, context) {
    // const vm = getCurrentInstance()!;
    const loginWithPhoneFormRef = ref();
    const loginDialogShow = ref(false);
    const userStore = useUserStore();
    const router = useRouter();

    //页面刷新后判断一次是否登录
    userStore.judgeLoginStatus();

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
        });
        userStore.updateLoginStatus(!!result)
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

    const currentLoginType = ref(loginTypes[0].key);

    const switchLoginType = (key: string) => {
      currentLoginType.value = key;
    } 

    const qrCodeInfo = reactive({
      img: '',
      key: '',
      scanStatusMsg: QrCodeStatus[801],
    });
     
    let rotationQrCodeTimer:ReturnType<typeof setInterval>;
    const rotationQrCodeScanStatus = (key: string) => {
      rotationQrCodeTimer = setInterval(async () => {
        const { code , message , cookie } = await getQrCodeScanStatus({ key });
        qrCodeInfo.scanStatusMsg = QrCodeStatus[code];
        //已过期
        if(code === 800) {
          clearInterval(rotationQrCodeTimer);
        }else if(code === 803) {
          clearInterval(rotationQrCodeTimer);
          await userStore.judgeLoginStatus();
        }
      }, 3000);
    } 

    watchEffect(() => {
      if(currentLoginType.value === 'qrCode') {
        getQrCodeKey().then(async ({data: {unikey}}) => { 
          qrCodeInfo.key = unikey; 
          const { data: {qrimg,qrurl}} = await getQrCodeImgInfo({
            key:unikey
          })
          qrCodeInfo.img = qrimg;
          rotationQrCodeScanStatus(unikey);
        });
        return;
      }
      clearInterval(rotationQrCodeTimer);
    })

    const renderLoginBody = () => {
      const currentLoginTypeValue = currentLoginType.value;
      if(currentLoginTypeValue === 'phone') {
        return (
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
        )
      } else if(currentLoginTypeValue === 'email') {
        return (
          <div>email</div>
        )
      } else if(currentLoginTypeValue === 'qrCode') {
        return (
          <div className="login-by-qrCode">
            <div className="qrCode-img">
              <img src={qrCodeInfo.img} alt="" />
            </div>
            <p class="qrCode-scan-status">
              {
                qrCodeInfo.scanStatusMsg
              }
            </p>
          </div>
        )
      }
    }

    return () => {

      const loginBaseInfo = userLoginInfo.value;
      const currentLoginTypeValue = currentLoginType.value;
      const otherLoginTypes = loginTypes.filter(({key}) => key !== currentLoginTypeValue);
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
                {renderLoginBody()}
              </section>
              <footer class="login-dialog-foot">
                {
                  otherLoginTypes.map(({key, text}) => {
                    return <em key={key} onClick={() => switchLoginType(key)}>{text}</em>
                  })
                } 
              </footer>

            </aside>

          </Teleport>

        </>
      )
    }
  },
});
