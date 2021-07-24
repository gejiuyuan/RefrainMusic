import { defineComponent, watch, ref, computed } from "@vue/runtime-core";
import { routerViewLocationKey, useRoute, useRouter } from "vue-router";
import "./index.scss";
import { ChevronDown20Regular } from "@vicons/fluent";
import { NIcon } from "naive-ui";
import { onKeyUp, onKeyDown, onKeyPressed, onKeyStroke } from "@vueuse/core";
import usePlayerStore from "@/stores/player";
import { getImageMainColor, padPicCrop } from "@/utils";
import PlayerLyric from "@components/player/lyric";
import { useAudioHandler } from "@use/index";
import { MusicSinger } from "@/widgets/music-tiny-comp";

export default defineComponent({
  name: "Player",
  setup(props, context) {
    //处理音频等交互行为
    useAudioHandler();

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
        src: playerStore.currentSongInfo.al.picUrl,
        size: [400, 400],
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
      let { size, src } = playbillRef.value;
      src = padPicCrop(src, { x: 700, y: 700 });
      return (
        <div class="player-detail" ref={playerDetailRef} show={isShow.value}>
          <div
            class="player-bgcover-mask"
            style={{
              backgroundImage: `url(${src})`,
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
                <img
                  class="player-playbill"
                  src={src}
                  width={size[0]}
                  height={size[1]}
                  alt={src}
                />
              </div>

              <div class="player-info">
                <div class="player-song">
                  <h4 class="player-title">{musicName}</h4>

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

            {/* <Controller></Controller> */}
          </div>
        </div>
      );
    };
  },
});
