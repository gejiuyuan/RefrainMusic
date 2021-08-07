import { userPlaylist, userRecord } from "@/api/user";
import useUserStore from "@/stores/user";
import { phoneVerifyPatt, UNICODE_CHAR } from "@/utils";
import MusicList from "@/widgets/music-list";
import SongList from "@/widgets/song-list";
import { FormItemRule, NButton, NCol, NEmpty, useMessage } from "naive-ui";
import {
  defineComponent,
  nextTick,
  reactive,
  watch,
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
      playlist: {
        myCreated: [],
        myCollection: []
      },
      playRecord: [],
    })

    watch(() => userStore.isLogin, (isLogin) => {
      if (isLogin) {

      }
      else {
        message.warning(`亲~~还没有登录噢~~${UNICODE_CHAR.smile}`, {
          duration: 4000
        })
      }
    }, {
      immediate: true
    })

    const idWatcher = watch(() => route.query.id as string, (id) => {
      if (!id) return;
      userPlaylist({ uid: id }).then(({ playlist }) => {

        myData.playlist = playlist.reduce(
          (categoryItem: any, list: any) => {
            categoryItem[list.userId === +id ? 'myCreated' : 'myCollection'].push(list);
            return categoryItem
          },
          {
            myCreated: [],
            myCollection: []
          }
        );
      });

      userRecord({ uid: id }).then(({ weekData }) => {
        myData.playRecord = weekData.map(({ song }: any) => song);
      })
    }, {
      immediate: true
    })

    onBeforeRouteLeave(() => {
      idWatcher();
    })

    const renderRegisterSign = () => <i>{UNICODE_CHAR.registed}</i>

    return () => {

      if (!userStore.isLogin) {
        return <NEmpty description="亲~~还没有登录噢~~" showDescription={true}></NEmpty>
      }
      const { playlist: { myCreated, myCollection }, playRecord } = myData

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
