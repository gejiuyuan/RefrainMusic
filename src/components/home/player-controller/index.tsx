import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";
import ProgressBar from "@/widgets/progress-bar";
import {
  PlaySwitch,
  PrevMusic,
  NextMusic,
  Volume,
  MusicLoveIcon,
  CurrentPlayTime
} from "@/widgets/music-ctrl-icons";

export default defineComponent({
  name: "PlayerController",
  setup(props, { slots, emit }) {
    const router = useRouter();
    const route = useRoute();
    const showPlayerDetailPage = () => {
      const { query, path } = route;
      router.push({
        path,
        query: {
          ...query!,
          playerStatus: 1
        }
      })
    }

    return () => {
      return (
        <section class="player-controller">
          <div className="controller-progressbar">
            <ProgressBar
              onDown={() => console.info('down')}
              onMove={() => console.info('move')}
              onChange={() => console.info('change')}
              onUp={() => console.info('up')}
            ></ProgressBar>
          </div>

          <section class="controller-main">

            <section class="main-block main-left">

              <div class="music-playbill" onClick={showPlayerDetailPage}>
                <img src="https://p2.music.126.net/G4_5qI_QWcGMTyCJoRggHw==/109951163139102894.jpg?param=160y160" alt="" />
                <div class="playbill-mask">
                  <i class="iconfont icon-shanghua"></i>
                </div>
              </div>

              <div className="music-info">
                <div class="name">
                  Latin Girl
                </div>
                <div class="singer">
                  Justin Bieber
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

              <div className="play-queue">
                <i className="iconfont icon-yinleliebiao"></i>
                <span>
                  80
                </span>
              </div>


            </section>

          </section>

        </section>
      );
    };
  },
});
