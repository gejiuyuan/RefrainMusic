import { getMyLevelInfo } from "@/api/auth";
import { userPlaylist, userRecord } from "@/api/user";
import useUserStore from "@/stores/user";
import { getDate, getLocaleDate, phoneVerifyPatt, UNICODE_CHAR } from "@/utils";
import MusicList from "@/widgets/music-list";
import SongList from "@/widgets/song-list";
import { FormItemRule, NButton, NCol, NEmpty, useMessage } from "naive-ui";
import {
  computed,
  defineComponent,
  nextTick,
  reactive,
  watch,
  watchEffect,
} from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import './index.scss';

export default defineComponent({
  name: "MyPage",
  setup(props, context) {
    const message = useMessage();
    const userStore = useUserStore();
    const route = useRoute();

    const myData = reactive({
      playRecord: [],
    });

    const relativeInfos = computed(() => {
      const profile = userStore.detail.profile;
      const infos = [];
      infos.push({ name: `村龄${UNICODE_CHAR.smile}`, content: `${new Date().getFullYear() - getDate(profile.createTime).year}年（${getLocaleDate(profile.createTime)}）` });
      infos.push({ name: '个人签名', content: profile.signature });
      return infos;
    });

    watch(() => userStore.isLogin, (isLogin) => {
      if (isLogin) {

      }
      else {
        message.warning(`亲~~还没有登录噢~~${UNICODE_CHAR.smile}`, {
          duration: 4000
        });
      }
    }, {
      immediate: true
    });

    const idWatcher = watch(() => route.query.id as string, (id) => {
      if (!id) return;
      userRecord({ uid: id }).then(({ weekData }) => {
        myData.playRecord = weekData.map(({ song }: any) => song);
      })
    }, {
      immediate: true
    });

    onBeforeRouteLeave(() => {
      idWatcher();
    });

    const renderRegisterSign = () => <i>{UNICODE_CHAR.registed}</i>

    return () => {

      if (!userStore.isLogin) {
        return <NEmpty description="亲~~还没有登录噢~~" showDescription={true}></NEmpty>
      }
      const { playRecord } = myData;
      const { playlist: { myCreated, myCollection } } = userStore;

      return (
        <section class="my-page">

          <section className="my-header" aspectratio="7">

            <div class="my-header-left">
              <div aspectratio="1">
                <img class="my-avatar" src={userStore.detail.profile.avatarUrl} alt="" />
              </div>
            </div>
            <div className="my-header-right">
              <h3 class="my-nickname">
                {userStore.detail.profile.nickname}
              </h3>

              {
                relativeInfos.value.map(({ name, content }) => {
                  return (
                    <p class="header-layer">
                      <span>{name}：</span>
                      <em>{content}</em>
                    </p>
                  )
                })
              }

            </div>

          </section>

          <section class="my-layer my-record">
            <h4 class="title">
              我的播放记录{renderRegisterSign()}（{playRecord.length}）
            </h4>
            <MusicList musiclists={playRecord} cols={4}></MusicList>
          </section>

          <section class="my-layer my-created">
            <h4 class="title">
              我创建的{renderRegisterSign()}（{myCreated.length}）
            </h4>
            <SongList playlists={myCreated} showPagination={false}></SongList>
          </section>

          <section class="my-layer my-collection">
            <h4 class="title">
              我收藏的{renderRegisterSign()}（{myCollection.length}）
            </h4>
            <SongList playlists={myCollection} showPagination={false}></SongList>
          </section>
        </section>
      )
    }
  },
});
