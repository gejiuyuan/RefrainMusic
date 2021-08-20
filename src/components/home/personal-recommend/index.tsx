import { playlistRecommend } from "@/api/playlist";
import useUserStore from "@/stores/user";
import {
  computed,
  defineComponent,
  markRaw,
  onMounted,
  reactive,
  readonly,
  ref,
  watch,
} from "vue";
import "./index.scss";
import Songlist from '@widgets/song-list';
import { is } from "@/utils";
import { NGrid, NGridItem, useMessage } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { musicRecommend } from "@/api/music";
import MusicList from "@/widgets/music-list";
import { personalFm } from "@/api/other";
import { MusicSinger } from '@widgets/music-tiny-comp';

export const PersonalFm = defineComponent({
  name: 'PersonalFm',
  setup(props, { slots, emit }) {

    const userStore = useUserStore();

    return () => {

      const { detail } = userStore;

      return (
        <section class="personal-recommend-layer personal-fm">

          <h6>哈喽！阿哪哒！今天为你推荐 {detail.profile.nickname} 的音乐电台</h6>

          <NGrid>
            <NGridItem span={3}>
              <div className="fm-box">
                <img class="fm-pic" src="" alt="" />
                <div className="fm-content">
                  <h6 class="fm-name">
                    {

                    }
                  </h6>
                  <MusicSinger class="fm-singers" singers={[]}></MusicSinger>
                  <div className="fm-tools">

                  </div>
                </div>
              </div>
            </NGridItem>
          </NGrid>

        </section>

      )

    }
  }
});

export default defineComponent({
  name: "PersonalRecommend",
  setup(props, { slots, emit }) {

    const userStore = useUserStore();
    const message = useMessage();
    const router = useRouter();

    const recommendData = reactive({
      songlist: [] as any[],
      music: {
        dailySongs: [] as any[],
        recommendReasons: [] as string[],
        orderSongs: [] as any[],
      }
    })

    //获取每日推荐歌单
    const getPersonalRecommendSonglist = async () => {
      const { recommend } = await playlistRecommend();
      recommendData.songlist = recommend;
    }

    //获取每日推荐音乐
    const getPersonalRecommendMusics = async () => {
      const { data: { orderSongs, recommendReasons, dailySongs } } = await musicRecommend();
      recommendData.music = { orderSongs, recommendReasons, dailySongs }
    }
    const getPersonalRecommendFm = async () => {
      const res = await personalFm();
      console.info(res);
    }

    watch(() => userStore.isLogin, (isLogin) => {
      if (!isLogin) {
        router.replace({
          path: '/musichall/featrued'
        })
      }
      getPersonalRecommendSonglist();
      getPersonalRecommendMusics();
      getPersonalRecommendFm();
    }, {
      immediate: true
    });

    return () => {
      const {
        songlist,
        music: {
          dailySongs
        }
      } = recommendData;

      return (
        <section className="personal-recommend">
          {
            !is.emptyArray(dailySongs) &&
            <section class="personal-recommend-layer">
              <h6>每日推荐歌曲</h6>
              <MusicList musiclists={dailySongs} category='common'></MusicList>
            </section>
          }
          {
            !is.emptyArray(songlist) &&
            <section class="personal-recommend-layer">
              <h6>我的私荐歌单</h6>
              <Songlist playlists={songlist} showPagination={false} gaps={{ x: 50, y: 40 }} cols={6}></Songlist>
            </section>
          }

        </section>
      );
    };
  },
});
