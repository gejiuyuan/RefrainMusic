import usePlayerStore from "@/stores/player";
import { onClickOutside } from "@vueuse/core";
import { defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";
import { MusicLoveIcon, PlayStatusSwitch, } from "@widgets/music-tiny-comp";
import useAudioStore from "@/stores/audio";


export default defineComponent({
  name: "PlayerQueue",
  setup(props, { slots, emit }) {
    const router = useRouter();
    const route = useRoute();
    const playerStore = usePlayerStore();
    const playerQueue = playerStore.playerQueue;
    const playerQueueRef = ref<HTMLElement>();

    const hidePlayerQueueHandler = () => (playerQueue.show = false);
    const songItemDblClickHandler = (id: number) =>
      playerStore.handlePlaySoundNeededData(id);

    onClickOutside(playerQueueRef, () => {
      hidePlayerQueueHandler();
    });

    return () => {
      const {
        currentSongInfo: { id: curSongId },
      } = playerStore;
      const { show, songList } = playerQueue;
      return (
        <aside class="player-queue" slideShow={show} ref={playerQueueRef}>
          <header class="queue-header">
            <h3>播放列表</h3>
            <div class="header-layer">
              <em className="total-songs">
                {songList.length}
                首音乐
              </em>
            </div>
          </header>
          <section class="queue-body" scrollbar="overlay">
            <ul>
              {songList.map((songInfo) => {
                const { name, artists, id } = songInfo;
                return (
                  <li
                    class="song-item"
                    active={curSongId === id}
                    onDblclick={() => songItemDblClickHandler(id)}
                  >
                    <h6>{name}</h6>
                    <div className="item-layer">
                      <em>{artists[0].name}</em>
                    </div>
                    <div class="tools">
                      <div className="tool-item">
                        <PlayStatusSwitch id={id}></PlayStatusSwitch>
                      </div>
                      <MusicLoveIcon songInfo={songInfo}></MusicLoveIcon>
                      <div
                        class="tool-item"
                        title="添加到"
                        singallinedot
                      >
                        <i class="iconfont icon-plus"></i>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
          <footer class="queue-foot">
            <em onClick={hidePlayerQueueHandler} title="收起">
              <i className="iconfont icon-icon-1"></i>
              <span>收起</span>
            </em>
          </footer>
        </aside>
      );
    };
  },
});
