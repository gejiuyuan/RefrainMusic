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
import { is, padPicCrop } from "@/utils";
import { NGrid, NGridItem, useMessage } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { musicRecommend } from "@/api/music";
import MusicList from "@/widgets/music-list";
import { getPersonalFm } from "@/api/other";
import { MusicLoveIcon, MusicSinger } from '@widgets/music-tiny-comp';
import usePlayerStore from "@/stores/player";
import { getModifiedNewestSongInfo, getModifiedSongInfo } from "@/utils/apiSpecial";

export const PersonalFm = defineComponent({
  name: 'PersonalFm',
  setup(props, { slots, emit }) {

    const userStore = useUserStore();
    const playerStore = usePlayerStore();

    const getPersonalRecommendFm = async () => {
      const { data } = await getPersonalFm();
      const personalFMList = playerStore.personalFM.songList;
      data.forEach((songItem: any) => {
        if (personalFMList.some((fmItem) => fmItem.id === songItem.id)) {
          return;
        }
        personalFMList.push(getModifiedNewestSongInfo(songItem));
      });
    }
    getPersonalRecommendFm();

    const currentVisibleFM = computed(() => {
      const personalFM = playerStore.personalFM;
      return personalFM.isFM ? playerStore.currentSongInfo : personalFM.songList[0];
    });

    return () => {

      const { detail } = userStore;
      const currentVisibleFMValue = currentVisibleFM.value;
      if (is.undefined(currentVisibleFMValue)) {
        return;
      }
      const { musicName, singers, album } = currentVisibleFMValue;

      return (
        <section class="personal-recommend-layer personal-fm">

          <h5>哈喽！阿哪哒！今天为你推荐 {detail.profile.nickname} 的音乐电台</h5>

          <NGrid>
            <NGridItem span={9}>
              <div className="fm-box">
                <i class="bubble" aspectratio="1"></i>
                <em class="tip">
                  For
                  <br></br>
                  You
                </em>
                <div className="fm-main" aspectratio="3">
                  <img class="fm-pic" src={padPicCrop(album.picUrl, { x: 120, y: 120 })} alt="" />
                  <div className="fm-content">
                    <h6 class="fm-name" singallinedot>
                      {
                        musicName
                      }
                    </h6>
                    <MusicSinger class="fm-singers" singers={singers}></MusicSinger>
                    <div className="fm-tools">
                      <div className="tool-item next-music" title="下一首 Ctrl+Right">
                        <i class="iconfont icon-nextmusic"></i>
                      </div>
                      <div className="tool-item love-music" title="piupiupiu~~">
                        <MusicLoveIcon songInfo={currentVisibleFMValue}></MusicLoveIcon>
                      </div>
                    </div>
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


    watch(() => userStore.isLogin, (isLogin) => {
      if (!isLogin) {
        router.replace({
          path: '/musichall/featrued'
        })
      }
      getPersonalRecommendSonglist();
      getPersonalRecommendMusics();
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
          <PersonalFm></PersonalFm>
          {
            !is.emptyArray(dailySongs) &&
            <section class="personal-recommend-layer">
              <h5>每日推荐歌曲</h5>
              <MusicList musiclists={dailySongs} category='common'></MusicList>
            </section>
          }
          {
            !is.emptyArray(songlist) &&
            <section class="personal-recommend-layer">
              <h5>我的私荐歌单</h5>
              <Songlist playlists={songlist} showPagination={false} gaps={{ x: 50, y: 40 }} cols={6}></Songlist>
            </section>
          }

        </section>
      );
    };
  },
});
