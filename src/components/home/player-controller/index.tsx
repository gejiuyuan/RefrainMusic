import { computed, defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";
import ProgressBar, { ProgressInfo } from "@/widgets/progress-bar";
import {
  PlaySwitch,
  PrevMusic,
  NextMusic,
  Volume,
  MusicLoveIcon,
  CurrentPlayTime,
} from "@/widgets/music-ctrl-icons";
import usePlayerStore from "@/stores/player";
import useAudioStore from "@/stores/audio";
import { getFullName, getFullNames } from "@/utils/apiSpecial";
import { padPicCrop } from "@/utils";

export default defineComponent({
  name: "PlayerController",
  setup(props, { slots, emit }) {
    const router = useRouter();
    const route = useRoute();
    const playerStore = usePlayerStore();
    const audioStore = useAudioStore();

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
      playerStore.playerQueue.show = true;
    };

    const progressUp = ({ decimal }: ProgressInfo) => {
      audioStore.nextSeekTime = audioStore.duration * decimal;
      audioStore.playing = true;
    };

    const toSingerDetailPage = (id: number) => {
      router.push({
        path: "/artist",
        query: { id },
      });
    };

    return () => {
      const { currentTime, duration } = audioStore;
      const {
        currentSongModifiedInfo: { id, musicName, singer, al: album },
        playerQueue: { songList },
      } = playerStore;

      return (
        <section class="player-controller">
          <div className="controller-progressbar">
            <ProgressBar
              currentRatio={(currentTime * 100) / duration}
              onDown={() => {}}
              onMove={() => {}}
              onChange={() => {}}
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
                <div class="name">{musicName}</div>
                <div class="singer">
                  {singer.map(({ id, name }, i) => {
                    return (
                      <>
                        <span onClick={() => toSingerDetailPage(id)}>
                          {name}
                        </span>
                        {i !== singer.length - 1 && <em> / </em>}
                      </>
                    );
                  })}
                </div>
              </div>
            </section>

            <section class="main-block main-center">
              <Volume></Volume>
              <PrevMusic></PrevMusic>
              <PlaySwitch></PlaySwitch>
              <NextMusic></NextMusic>
            </section>

            <section class="main-block main-right">
              <CurrentPlayTime></CurrentPlayTime>

              <MusicLoveIcon></MusicLoveIcon>

              <div className="play-queue-icon" onClick={showPlayerQueueHandler}>
                <i className="iconfont icon-yinleliebiao"></i>
                <span>{songList.length}</span>
              </div>
            </section>
          </section>
        </section>
      );
    };
  },
});
