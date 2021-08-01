import { ref, computed, defineComponent, PropType } from "vue";
import { SongInfo } from "@/types/song";
import {
  freeze,
} from "@utils/index";
import InfinityScrolling from "@/widgets/infiity-scrolling";
import "./index.scss";
import {
  CurrentSongInfo,
  getModifiedSongInfo,
} from "@/utils/apiSpecial";
import usePlayerStore from "@/stores/player";
import YuanTable, { YuanTableColumn } from "./yuan-table";
import { NGrid, NGridItem } from "naive-ui";
import { MusicLoveIcon } from "../music-tiny-comp";

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

    const isRenderPublishTime = computed(() => {
      return props.dataList.some(({ publishTime }) => publishTime != null);
    });

    const baseCount = ref(14);
    const sliceInterval = ref(14);

    const handleDownload = (songItem: CurrentSongInfo) => {
      console.info(songItem);
    };

    const playerStore = usePlayerStore();
    const playBtnClickHandler = async (songItem: CurrentSongInfo) => {
      playerStore.handlePlaySoundNeededData(songItem.id);
    };

    const renderMainSongTable = (infinityScrollProps: any) => {
      if (!songData.value.length) return;
      return (

        <YuanTable
          class="song-table"
          rowClass="song-list-item"
          data={songData.value.slice(0, infinityScrollProps.currentCount)}
          showSerial
          serialDefiner={(idx) => ++idx}
        >

          <YuanTableColumn
            label="歌曲"
            span={4}
            v-slots={{
              default(curSongInfo: any) {
                const { musicName } = curSongInfo;
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
                          <i class="iconfont icon-play"></i>
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

      );
    };

    return () => {
      return (
        <section class="song-table">
          <InfinityScrolling
            sliceInterval={sliceInterval.value}
            total={songData.value.length}
            baseCount={baseCount.value}
            v-slots={{
              default: renderMainSongTable,
            }}
          ></InfinityScrolling>
        </section>
      );
    };
  },
});
