import { defineComponent, watch, ref } from "@vue/runtime-core";
import {
  routerViewLocationKey,
  useRoute,
  useRouter
} from 'vue-router';
import './index.scss';
import {
  ChevronDown20Regular
} from '@vicons/fluent';
import {
  NIcon
} from 'naive-ui';
import { onKeyUp, onKeyDown, onKeyPressed, onKeyStroke } from "@vueuse/core";

export default defineComponent({
  name: "Player",
  setup(props, context) {

    const route = useRoute();
    const router = useRouter();
    const playerDetailRef = ref();
    const isShow = ref(false);

    watch(() => route.query.playerStatus, (playerStatus) => {
      isShow.value = !!+playerStatus!;
    }, {
      immediate: true
    })

    const playbill = {
      src: 'https://p1.music.126.net/uSCBlYEiFPDgBvzmQGUe7A==/109951166096775188.jpg',
      size: [400, 400,],

    }

    const currentSongInfo = {
      title: '哈哈哈',
      author: '果小右'
    }

    const exitPlayerDetailPage = () => {
      const newQuery = { ...route.query };
      if (!!newQuery.playerStatus) {
        delete newQuery.playerStatus;
        router.push({
          path: route.path,
          query: newQuery
        });
      }
    }

    onKeyStroke('Escape', () => {
      exitPlayerDetailPage();
    }, {
      eventName: 'keyup',
      target: playerDetailRef.value,
      passive: true,
    })

    return () => {

      return (
        <div class="player-detail" ref={playerDetailRef} show={isShow.value} style="background-color: rgb(20, 26, 26)">

          <div
            class="player-bgcover-mask"
            style={{ backgroundImage: `url(${playbill.src})` }}
          ></div>

          <div class="player-back" onClick={exitPlayerDetailPage} title={"收一下：ESC"}>
            <NIcon size="28" color={'#eee'}>
              <ChevronDown20Regular></ChevronDown20Regular>
            </NIcon>
          </div>

          <div class="player-content">
            <div class="player-body">

              <div class="player-cover">
                <img
                  class="player-playbill"
                  src={playbill.src}
                  width={playbill.size[0]}
                  height={playbill.size[1]}
                  alt={playbill.src}
                />
              </div>

              <div class="player-info">

                <div class="player-song">
                  <h4 class="player-title">
                    {currentSongInfo && currentSongInfo.title}
                  </h4>

                  <p class="player-author">
                    <span>歌手&nbsp;:&nbsp;</span>
                    <em class="player-author-text">
                      {currentSongInfo && currentSongInfo.author}
                    </em>
                  </p>

                  {/* <Lyric></Lyric> */}
                </div>
              </div>
            </div>

            {/* <Controller></Controller> */}
          </div>

          {/* <Playlist></Playlist>
          <Audio></Audio> */}
        </div >
      )

    }

  },
});
