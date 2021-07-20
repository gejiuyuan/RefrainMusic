import usePlayerStore from "@/stores/player";
import { onClickOutside } from "@vueuse/core";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";

export const PlayerQueueSongItem = defineComponent({
  name: "PlayerQueueSongItem",
  setup(props, { emit, slots }) {
    return () => {
      return <li class="song-item"></li>;
    };
  },
});

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
        currentSongModifiedInfo: { id: curSongId },
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
          <section class="queue-body">
            <ul>
              {songList.map(({ name, ar, id }) => {
                return (
                  <li
                    class="song-item"
                    active={curSongId === id}
                    onDblclick={() => songItemDblClickHandler(id)}
                  >
                    <h6>{name}</h6>
                    <div className="item-layer">
                      <em>{ar[0].name}</em>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      );
    };
  },
});
