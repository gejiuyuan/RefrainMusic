import usePlayerStore, { currentSongRefGlobal, playerQueue, playerQueueShow } from "@/stores/player";
import { onClickOutside } from "@vueuse/core";
import { defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import "./index.scss";
import { MusicLoveIcon, PlayStatusSwitch, } from "@widgets/music-tiny-comp"; 
import { is } from "@/utils"; 

export default defineComponent({
  name: "PlayerQueue",
  setup(props, { slots, emit }) {
    const router = useRouter();
    const route = useRoute();
    const playerStore = usePlayerStore();
    const playerQueueRef = ref<HTMLElement>();
    const listBodyElm = ref<HTMLElement>();
    const listContentUlRef = ref<HTMLUListElement>();

    const hidePlayerQueueHandler = () => (playerQueueShow.value = false);
    const songItemDblClickHandler = (id: number) =>
      playerStore.handlePlaySoundNeededData(id);

    onClickOutside(playerQueueRef, () => {
      hidePlayerQueueHandler();
    });

    /**
     * 定位到当前歌曲
     * @returns 
     */
    const locatoToCurrentSong = () => { 
      const queueSongList = playerQueue.value;
      if (is.emptyArray(queueSongList)) {
        return;
      }
      const { id: curSongId } = currentSongRefGlobal.value; 
      const targetIndex = queueSongList.findIndex(({ id }) => id === curSongId);

      const targetScrollTop = (listContentUlRef.value!.children[targetIndex] as HTMLLIElement).offsetTop;
      const { scrollTop, offsetHeight } = listBodyElm.value!;
      //如果目标在可视区域内，就return
      if (
        targetScrollTop >= scrollTop &&
        targetScrollTop < scrollTop + offsetHeight
      ) {
        return;
      } 
      listBodyElm.value!.scrollTop = targetScrollTop;
    }

    return () => {
      const { id: curSongId } =currentSongRefGlobal.value;
      const queueSongList = playerQueue.value;

      return (
        <aside class="player-queue" slideShow={playerQueueShow.value} ref={playerQueueRef}>
          <header class="queue-header">
            <h3>播放列表</h3>
            <div class="header-layer">
              <em className="total-songs">
                {queueSongList.length}
                首音乐
              </em>
            </div>
          </header>
          <section class="queue-main">
            <div className="list-body" scrollbar="overlay" ref={listBodyElm}>
              <ul class="list-content" ref={listContentUlRef}>
                {queueSongList.map((songInfo) => {
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
            </div>
            <div class="locate-to-current" title="定位到当前播放歌曲" onClick={locatoToCurrentSong}>
              <i className="iconfont icon-locate"></i>
            </div>
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
