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
  watchEffect,
} from "vue";
import "./index.scss";
import Songlist from '@widgets/song-list';
import { getImageMainColorString, is, padPicCrop } from "@/utils";
import { NGrid, NGridItem } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import { musicRecommend } from "@/api/music";
import MusicList from "@/widgets/music-list";
import { getPersonalFm } from "@/api/other";
import { MusicLoveIcon, MusicSinger } from '@widgets/music-tiny-comp';
import usePlayerStore , { currentSongRefGlobal, toNext } from "@stores/player";
import { getModifiedNewestSongInfo } from "@/utils/apiSpecial"; 
import { PlayStatusSwitch } from '@widgets/music-tiny-comp'; 

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
      return personalFM.isFM ? currentSongRefGlobal : personalFM.songList[0];
    });

    const picMainColor = ref('');
    watchEffect(async () => {
      picMainColor.value = await getImageMainColorString(currentVisibleFM.value?.album?.picUrl);
    });

    const toNextHandler = () => {
     toNext();
    }
 
    return () => {
      const currentVisibleFMValue = currentVisibleFM.value;
      if (is.undefined(currentVisibleFMValue)) {
        return;
      }
      const { detail } = userStore;
      const { musicName, singers, album, id } = currentVisibleFMValue;
      const picUrl = padPicCrop(album.picUrl, { x: 120, y: 120 });

      return (
        <section class="personal-recommend-layer personal-fm">

          <h5 singallinedot>??????????????????????????????????????? {detail.profile.nickname} ???????????????</h5>

          <NGrid>
            <NGridItem span={9}>
              <div className="fm-box" style={{ backgroundColor: picMainColor.value }}>
                <i class="bubble" aspectratio="1"></i>
                <em class="tip">
                  For
                  <br></br>
                  You
                </em>
                <div className="fm-main" aspectratio="3">
                  <img class="fm-pic" src={picUrl} alt="" />
                  <div className="play-toggle" aspectratio="1">
                    <PlayStatusSwitch id={id}></PlayStatusSwitch>
                  </div>
                  <div className="fm-content">
                    <h6 class="fm-name" singallinedot>
                      {
                        musicName
                      }
                    </h6>
                    <MusicSinger class="fm-singers" singers={singers}></MusicSinger>
                    <div className="fm-tools">
                      <div className="tool-item next-music" title="????????? Ctrl+Right" onClick={toNextHandler}>
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
    const router = useRouter();

    const recommendData = reactive({
      songlist: [] as any[],
      music: {
        dailySongs: [] as any[],
        recommendReasons: [] as string[],
        orderSongs: [] as any[],
      }
    })

    //????????????????????????
    const getPersonalRecommendSonglist = async () => {
      const { recommend } = await playlistRecommend();
      recommendData.songlist = recommend;
    }

    //????????????????????????
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
              <h5>??????????????????</h5>
              <MusicList musiclists={dailySongs} category='common'></MusicList>
            </section>
          }
          {
            !is.emptyArray(songlist) &&
            <section class="personal-recommend-layer">
              <h5>??????????????????</h5>
              <Songlist playlists={songlist} showPagination={false} gaps={{ x: 50, y: 40 }} cols={6}></Songlist>
            </section>
          }

        </section>
      );
    };
  },
});
