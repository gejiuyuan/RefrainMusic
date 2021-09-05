import { defineComponent, watch, ref, computed } from "@vue/runtime-core";
import { routerViewLocationKey, useRoute, useRouter } from "vue-router";
import "./index.scss";
import { onKeyStroke } from "@vueuse/core";
import usePlayerStore from "@/stores/player";
import { padPicCrop } from "@/utils";
import PlayerLyric from "@components/player/lyric"; 
import { MusicSinger } from "@/widgets/music-tiny-comp";
import HomeController from "@/components/home/player-controller";
import { Transition , withDirectives, vShow } from "vue"; 

export default defineComponent({
  name: "Player",
  setup(props, context) { 
    const route = useRoute();
    const router = useRouter();
    const playerDetailRef = ref();
    const isShow = ref(false);
    const playerStore = usePlayerStore();

    watch(
      () => route.query.playerStatus,
      (playerStatus) => {
        isShow.value = !!+playerStatus!;
      },
      {
        immediate: true,
      }
    );

    const playbillRef = computed(() => {
      return {
        src: playerStore.currentSongInfo.album.picUrl,
        size: [600, 600],
      };
    });

    const exitPlayerDetailPage = () => {
      const newQuery = { ...route.query };
      if (!!newQuery.playerStatus) {
        delete newQuery.playerStatus;
        router.push({
          path: route.path,
          query: newQuery,
        });
      }
    };

    onKeyStroke(
      "Escape",
      () => {
        exitPlayerDetailPage();
      },
      {
        eventName: "keyup",
        target: playerDetailRef.value,
        passive: true,
      }
    );

    return () => {
      const { musicName, singers } = playerStore.currentSongInfo;
      const { size, src } = playbillRef.value;
      const cropedSrc = padPicCrop(src, { x: 700, y: 700 }); 
      return ( 
        <div class="player-detail" ref={playerDetailRef} show={isShow.value}>
          <div
            class="player-bgcover-mask"
            style={{
              backgroundImage: `url(${cropedSrc})`,
            }}
          ></div>

          <div
            class="player-back"
            onClick={exitPlayerDetailPage}
            title={"收一下：ESC"}
          >
            <i className="iconfont icon-xiajiantou"></i>
          </div>

          <div class="player-content">
            <div class="player-body">
              <div class="player-cover">
                <div aspectratio="1.5">
                  <img
                    class="player-playbill"
                    src={src}
                    width={size[0]}
                    height={size[1]}
                    alt={src}
                  />
                </div>
              </div>

              <div class="player-info">
                <div class="player-song">
                  <h4 class="player-title" singallinedot title={musicName}>{musicName}</h4>

                  <div class="player-author">
                    <span>歌手&nbsp;:&nbsp;</span>
                    <MusicSinger
                      class="player-author-text"
                      singers={singers}
                    ></MusicSinger>
                  </div>

                  <PlayerLyric></PlayerLyric>
                </div>
              </div>
            </div>
            <HomeController displayInLyricPage={true}></HomeController>
          </div>
        </div> 
      );
    };
  },
});
