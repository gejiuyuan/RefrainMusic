import { ref, computed, defineComponent, PropType } from "vue";
import { SongInfo } from "@/types/song";
import {
  freeze,
} from "@utils/index";
import "./index.scss";
import {
  CurrentSongInfo,
  getModifiedSongInfo,
} from "@/utils/apiSpecial";
import usePlayerStore from "@/stores/player";
import YuanTable, { YuanTableColumn } from "./yuan-table";
import { NGrid, NGridItem } from "naive-ui";
import { MusicLoveIcon, PlaySwitch } from "../music-tiny-comp";
import useAudioStore from "@/stores/audio";

export default defineComponent({
  name: "SongTable",
  props: {
    showIndex: {
      type: Boolean,
      required: false,
    },
    dataList: {
      type: Array as PropType<SongInfo[]>,
      required: true,
    },
  },
  setup(props, ctx) {
    const songData = computed(() => {
      const dataList = freeze([...props.dataList] || []);
      return dataList.map((songInfo) => {
        const realSongInfo = getModifiedSongInfo(songInfo);
        return realSongInfo;
      });
    });
    const playerStore = usePlayerStore();
    const audioStore = useAudioStore();

    const isRenderPublishTime = computed(() => {
      return props.dataList.some(({ publishTime }) => publishTime != null);
    });

    const handleDownload = (songItem: CurrentSongInfo) => {
      console.info(songItem);
    };

    const playBtnClickHandler = async (songItem: CurrentSongInfo) => {
      if (playerStore.currentSongInfo.id === songItem.id) {
        audioStore.playing = !audioStore.playing;
      }
      else {
        playerStore.handlePlaySoundNeededData(songItem.id);
      }
    };

    return () => {
      if (!songData.value.length) return;
      const { currentSongInfo } = playerStore;
      const { playing } = audioStore;

      return (
        <section class="song-table">

          <YuanTable
            class="song-table"
            rowClass="song-list-item"
            data={songData.value}
            showSerial
            serialDefiner={(idx) => ++idx}
          >

            <YuanTableColumn
              label="歌曲"
              span={4}
              v-slots={{
                default(curSongInfo: any) {
                  const { musicName, id } = curSongInfo;
                  const isPlaying = playing && (id === currentSongInfo.id)
                  return (
                    <NGrid
                      class="song-item-body"
                    >
                      <NGridItem class="song-body-left" span={18}>
                        <div class="song-love" title="添加至我喜欢">
                          <i class="iconfont icon-xihuan"></i>
                        </div>
                        <div class="song-name" title={musicName} singallinedot>
                          {musicName}
                        </div>
                      </NGridItem>

                      <NGridItem span={5}>
                        <div class="tools">
                          <div
                            class="tool-item"
                            title="添加到"
                            singallinedot
                          >
                            <i class="iconfont icon-plus"></i>
                          </div>
                          <div
                            class="tool-item"
                            title="播放"
                            onClick={() => playBtnClickHandler(curSongInfo)}
                          >
                            <i class="iconfont icon-play" hidden={isPlaying}></i>
                            <i className="iconfont icon-pause" hidden={!isPlaying}></i>
                          </div>
                          <div
                            class="tool-item"
                            title="下载"
                            onClick={() => handleDownload(curSongInfo)}
                          >
                            <i class="iconfont icon-download"></i>
                          </div>
                          <div className="tool-item">
                            {
                              <MusicLoveIcon></MusicLoveIcon>
                            }
                          </div>
                        </div>
                      </NGridItem>
                    </NGrid>
                  )
                }
              }}
            ></YuanTableColumn>

            <YuanTableColumn
              label="专辑"
              span={2}
              v-slots={{
                default(curSongInfo: any) {
                  const { album: { name } } = curSongInfo;
                  return (
                    <div title={name} singallinedot>
                      {name}
                    </div>
                  );
                },
              }}
            ></YuanTableColumn>

            <YuanTableColumn
              label="时长"
              span={2}
              v-slots={{
                default(curSongInfo: any) {
                  const { localedDuration } = curSongInfo;
                  return (
                    <div title={localedDuration} singallinedot>
                      {localedDuration}
                    </div>
                  );
                },
              }}
            ></YuanTableColumn>

            {
              isRenderPublishTime.value && (
                <YuanTableColumn
                  span={2}
                  label="发行时间"
                  v-slots={{
                    default(curSongInfo: any) {
                      const { localedPublishTime } = curSongInfo;
                      return (
                        <div
                          class="song-publish-time"
                          title={localedPublishTime}
                          singallinedot
                        >
                          {localedPublishTime}
                        </div>
                      );
                    },
                  }
                  }
                ></YuanTableColumn>
              )
            }
          </YuanTable>

        </section>
      );
    };
  },
});
