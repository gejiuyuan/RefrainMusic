
import {
  PlayStatusSwitch,
  Volume,
  MusicLoveIcon, 
  MusicSinger,
  PlayOrder,
} from "@/widgets/music-tiny-comp";
import "./index.scss";
import { padPicCrop } from "@/utils";
import { useRoute, useRouter } from "vue-router";
import usePlayerStore, { playerQueueShow } from "@/stores/player";
import ProgressBar, { ProgressInfo } from "@/widgets/progress-bar";
import { renderCurrentPlayTime } from "@/widgets/common-renderer";
import usePlaySwitch from "@/use/usePlaySwitch";import { computed, defineComponent, PropType, ref } from "vue";
import { currentTimeRefGlobal, durationRefGlobal, nextSeekTimeRefGlobal, playingRefGlobal } from "@/stores/audio";

export default defineComponent({
  name: "PlayerController",
  props: {
    displayInLyricPage: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },
  setup(props, { slots, emit }) {
    const router = useRouter();
    const route = useRoute();
    const playerStore = usePlayerStore(); 

    const { toNext, toPrevious } = usePlaySwitch();

    const showOrHidePlayerDetailPage = () => {
      const { query, path } = route;
      router.push({
        path,
        query: {
          ...query!,
          playerStatus: Number(!props.displayInLyricPage),
        },
      });
    };

    const showPlayerQueueHandler = () => {
      playerQueueShow.value = true;
    };

    const progressUp = ({ decimal }: ProgressInfo) => { 
      nextSeekTimeRefGlobal.value = durationRefGlobal.value * decimal;
      playingRefGlobal.value = true;
    };

    return () => {
      const currentTimeValue = currentTimeRefGlobal.value;
      const duration= durationRefGlobal.value;
      const {
        currentSongInfo: { id, musicName, singers, album },
        playerQueue,
      } = playerStore; 

      return ( 
        <section class="player-controller" lyricPageShow={props.displayInLyricPage}>
          <div className="controller-progressbar">
            <ProgressBar
              currentRatio={(currentTimeValue * 100) / duration}
              onDown={() => {}}
              onMove={ () => {}}
              onChange={() => {}}
              onUp={progressUp}
            ></ProgressBar>
          </div>

          <section class="controller-main">
            <section class="main-block main-left" visibility={!props.displayInLyricPage}>
              <div class="music-playbill" onClick={showOrHidePlayerDetailPage}>
                <img
                  src={padPicCrop(album.picUrl, { x: 180, y: 180 })}
                  alt=""
                />
                <div class="playbill-mask">
                  <i class="iconfont icon-shanghua"></i>
                </div>
              </div>

              <div className="music-info">
                <div class="name" title={musicName} singallinedot>{musicName}</div>
                <MusicSinger singers={singers}></MusicSinger>
              </div>
            </section>

            <section class="main-block main-center">
              <Volume></Volume>
              <div className="prev-music" title="上一首 Ctrl+Left" onClick={toPrevious}>
                <i class="iconfont icon-prevmusic"></i>
              </div>
              <div class="controller-play-switch">
                <PlayStatusSwitch></PlayStatusSwitch>
              </div>
              <div className="next-music" title="下一首 Ctrl+Right" onClick={toNext}>
                <i class="iconfont icon-nextmusic"></i>
              </div>
              <PlayOrder></PlayOrder>
            </section>

            <section class="main-block main-right">
              {
                renderCurrentPlayTime()
              }
              <MusicLoveIcon songInfo={playerStore.currentSongInfo}></MusicLoveIcon>
              <div className="play-queue-icon" onClick={showPlayerQueueHandler} title="播放队列">
                <i className="iconfont icon-yinleliebiao"></i>
                <span>{playerQueue.length}</span>
              </div>
            </section>
          </section>
        </section> 
      );
    };
  },
});
