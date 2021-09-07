import { getQrCodeImgInfo, getQrCodeKey, getQrCodeScanStatus, loginStatus, loginWithEmail, loginWithPhone } from "@/api/auth";
import { userAccount, userDetail, userLikeList, userPlaylist, userSubcount } from "@/api/user";
import { NaiveFormValidateError } from "@/shim";
import useUserStore from "@/stores/user";
import { emailVerifyPatt, is, phoneVerifyPatt } from "@/utils";
import { messageBus } from "@/utils/event/register";
import md5 from 'crypto-js/md5'
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
  onUnmounted,
  onBeforeUnmount,
} from "vue";
import { routerViewLocationKey, useRouter } from "vue-router";
import './index.scss';
 
const loginTypes = [
  {key: 'phone', text: '手机号登录'},
  {key: 'qrCode', text: '二维码登录'},
  {key: 'email', text: '邮箱登录'},
]

export enum QrCodeStatus {
  '二维码已失效，请重新刷新扫码登录喔~~' = 800,
  '请打开网易云音乐APP进行扫码唷~~' = 801,
  '正在登录啦，赶快确认吧！' = 802,
  '授权登录成功啦~~~' = 803,
}


/**
* 电话和密码登录规则
*/
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

/**
* 网易云邮箱和密码登录规则
*/
const emailRules: Record<'email' | 'password', FormItemRule | FormItemRule[]> = {
  email: [
    {
      required: true,
      message: "阿娜哒~要输入正确的邮箱号噢~~",
      validator(rule, value) {
        return !!value.match(emailVerifyPatt)
      },
      trigger: ['blur'],
    }
  ],
  password: {
    required: true,
    message: '请输入密码',
  }
}

export default defineComponent({
  name: "UserLogin",
  setup(props, context) {
    const userStore = useUserStore();
    const router = useRouter();
    /**
     * 电话登录表单的Ref
     */
    const loginWithPhoneFormRef = ref();
    /**
     * 网易云邮箱表单的Ref
     */
    const loginWithEmailFormRef = ref();
    /**
     * 登录框是否显示
     */
    const loginDialogShow = ref(false);  
    /**
     * 当前登录的方式：电话、二维码、邮箱，默认：电话
     */
    const currentLoginType = ref(loginTypes[0].key);
    /**
     * 电话登录的表单数据
     */
    const phoneInfo = shallowReactive({
      number: '',
      password: '',
    });
    /**
     * 二维码登录的表单数据
     */
    const emailInfo = shallowReactive({
      email: '',
      password: '',
    });
    /**
     * 二维码登录的相关数据
     */
    const qrCodeInfo = reactive({
      img: '',
      key: '',
      scanStatusMsg: QrCodeStatus[801],
      user: {
        nickname: '',
        avatarUrl: '',
      }
    });

    //页面刷新后判断一次是否登录
    userStore.judgeAndUpdateLoginStatus({
      isFirstRefresh:true
    });

    /**
     * 登录区域内容信息
     */
    const userLoginInfo = computed(() => {
      const isLogin = userStore.isLogin;
      const style = {
        backgroundImage: isLogin ? `url(${userStore.detail.profile.avatarUrl})` : ''
      }
      const name = isLogin ? userStore.detail.profile.nickname : '点击登录'
      return {
        style, name
      }
    });

    /**
     * 监听登录状态变化
     */
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
    });

    /**
     * header处的登录按钮点击
     * @returns 
     */
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

    /**
     * 关闭登录框
     */
    const closeLoginDialog = () => {
      loginDialogShow.value = false; 
    }
    
    /**
     * 切换登录类型
     * @param key 
     */
     const switchLoginType = (key: string) => {
      currentLoginType.value = key;
    }  

    /**
     * 电话表单登录处理
     */
    const loginByPhoneClick = () => {
      loginWithPhoneFormRef.value!.validate(async (error: NaiveFormValidateError) => {
        if (error) {
          return;
        }
        await loginWithPhone({
          phone: phoneInfo.number,
          password: 'invalidPassword',
          md5_password: String(md5(phoneInfo.password)),
        });
        userStore.judgeAndUpdateLoginStatus();
      });
    }

    /**
     * 网易云邮箱登录处理
     */
    const loginByEmailClick = () => {
      loginWithEmailFormRef.value!.validate(async(error: NaiveFormValidateError) => {
        if(error) {
          return;
        }
        await loginWithEmail({
          email:emailInfo.email,
          password: 'invalidPassword',
          md5_password: String(md5(emailInfo.password)),
        });
        userStore.judgeAndUpdateLoginStatus();
      });
    }
     
    /**
     * 刷新二维码、开始二维码登录的请求通道
     */
    let rotationQrCodeTimer:ReturnType<typeof setInterval>; 
    const refrechOrBeginQrCode = (isRefresh=false) => {
      clearInterval(rotationQrCodeTimer);
      //重置让二维码登录提示
      qrCodeInfo.scanStatusMsg = QrCodeStatus[801];
      //重置用户待确认状态下的信息
      qrCodeInfo.user.avatarUrl = '';
      qrCodeInfo.user.nickname = '';
      getQrCodeKey().then(async ({data: {unikey}}) => { 
        qrCodeInfo.key = unikey; 
        const { data: {qrimg,qrurl}} = await getQrCodeImgInfo({
          key:unikey
        })
        qrCodeInfo.img = qrimg;
        isRefresh && (
          messageBus.dispatch('warnMessage', '二维码刷新成功啦！赶紧登录吧', {
            duration: 3000,
          })
        )
        rotationQrCodeTimer = setInterval(async () => {
          const { code , message , cookie, avatarUrl, nickname } = await getQrCodeScanStatus({ key:unikey });
          qrCodeInfo.scanStatusMsg = QrCodeStatus[code];
          //已过期
          if(code === 800) {
            clearInterval(rotationQrCodeTimer);
          }
          //待确认中
          else if(code === 802) {
            qrCodeInfo.user.avatarUrl = avatarUrl;
            qrCodeInfo.user.nickname = nickname;
          }
          else if(code === 803) {
            clearInterval(rotationQrCodeTimer);
            await userStore.judgeAndUpdateLoginStatus();
          }
        }, 3000);
      });
    }

    /**
     * 组件将要卸载时也要清除下轮训定时器，以防未知情况
     */
    onBeforeUnmount(() => {
      clearInterval(rotationQrCodeTimer);
    });

    watchEffect(() => {
      if(currentLoginType.value === 'qrCode') {
        refrechOrBeginQrCode();
        return;
      }
      //切换到其它登录方式下也要清除轮训定时器
      clearInterval(rotationQrCodeTimer);
    });

    watchEffect(() => {
      //关闭登录框按钮后，重置登录模式为手机号登录
      if(!loginDialogShow.value) {
        switchLoginType(loginTypes[0].key);
      }
    });

    const renderLoginBody = () => {
      const currentLoginTypeValue = currentLoginType.value;
      //电话登录
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
      } 
      //网易云邮箱登录
      else if(currentLoginTypeValue === 'email') {
        return (
          <div className="login-by-email">
            <NForm
              ref={loginWithEmailFormRef}
              model={emailInfo}
              showFeedback={true}
              showRequireMark={true}
              rules={emailRules}
            >
              <NFormItem path="email" label="网易云邮箱">
                <NInput value={emailInfo.email} placeholder="赶紧输入⑧!" onUpdateValue={(value) => emailInfo.email = value}></NInput>
              </NFormItem>
              <NFormItem path="password" label="密码">
                <NInput value={emailInfo.password} placeholder="赶紧输入⑧!" type={"password" as any} onUpdateValue={(value) => emailInfo.password = value}></NInput>
              </NFormItem>
              <div class="login-button">
                <NxButton type="warning" attrType="submit" onClick={loginByEmailClick}>登录</NxButton>
              </div> 
            </NForm>
          </div>
        )
      } 
      //二维码登录
      else if(currentLoginTypeValue === 'qrCode') {
        return (
          <div className="login-by-qrCode">
            <div className="qrCode-img">
              <img src={qrCodeInfo.img} alt="" />
              {
                qrCodeInfo.user.avatarUrl && (
                  <div className="qrCode-user-mask">
                    <div className="qrCode-user-avatar">
                      <img src={qrCodeInfo.user.avatarUrl} alt="" title={qrCodeInfo.user.nickname}/> 
                      <i className="iconfont icon-chenggong"></i>
                    </div>
                  </div>
                )
              }
            </div>
            <p class="qrCode-scan-status">
              {
                qrCodeInfo.scanStatusMsg
              }
            </p>
            <p class="qrCode-refresh">
              <em onClick={() => refrechOrBeginQrCode(true)} title="刷新二维码登录">
                <i className="iconfont icon-refresh"></i>
                <span>刷新二维码</span>
              </em>
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
                <i class="iconfont icon-guanbi" onClick={closeLoginDialog} title="关闭登录框"></i>
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
