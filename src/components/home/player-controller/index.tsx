import { computed, defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";
import ProgressBar, { ProgressInfo } from "@/widgets/progress-bar";
import {
  PlayStatusSwitch,
  Volume,
  MusicLoveIcon,
  CurrentPlayTime,
  MusicSinger,
  PlayOrder,
} from "@/widgets/music-tiny-comp";
import usePlayerStore, { playerQueueShow } from "@/stores/player";
import useAudioStore, { currentTime, playing } from "@/stores/audio";
import { padPicCrop } from "@/utils";
import usePlaySwitch from "@/use/usePlaySwitch";


export default defineComponent({
  name: "PlayerController",
  setup(props, { slots, emit }) {
    const router = useRouter();
    const route = useRoute();
    const playerStore = usePlayerStore();
    const audioStore = useAudioStore();

    const { toNext, toPrevious } = usePlaySwitch();

    const showPlayerDetailPage = () => {
      const { query, path } = route;
      router.push({
        path,
        query: {
          ...query!,
          playerStatus: 1,
        },
      });
    };

    const showPlayerQueueHandler = () => {
      playerQueueShow.value = true;
    };

    const progressUp = ({ decimal }: ProgressInfo) => {
      audioStore.nextSeekTime = audioStore.duration * decimal;
      playing.value = true;
    };

    return () => {
      const currentTimeValue = currentTime.value;
      const { duration } = audioStore;
      const {
        currentSongInfo: { id, musicName, singers, album },
        playerQueue,
      } = playerStore;

      return (
        <section class="player-controller">
          <div className="controller-progressbar">
            <ProgressBar
              currentRatio={(currentTimeValue * 100) / duration}
              onDown={() => { }}
              onMove={() => { }}
              onChange={() => { }}
              onUp={progressUp}
            ></ProgressBar>
          </div>

          <section class="controller-main">
            <section class="main-block main-left">
              <div class="music-playbill" onClick={showPlayerDetailPage}>
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
              <CurrentPlayTime></CurrentPlayTime>

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
