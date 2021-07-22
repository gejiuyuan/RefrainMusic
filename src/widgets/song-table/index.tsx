import { ref, computed, defineComponent, PropType } from "vue";
import { SongInfo } from "@/types/song";
import {
  second2TimeStr,
  getLocaleDate,
  NOOP,
  EMPTY_OBJ,
  freeze,
} from "@utils/index";
import InfinityScrolling from "@/widgets/infiity-scrolling";
import "./index.scss";
import useAudioStore from "@/stores/audio";
import { getLyric, getMusic, getMusicDetail } from "@/api/music";
import {
  getFullName,
  getFullNames,
  getModifiedSongInfo,
} from "@/utils/apiSpecial";
import usePlayerStore from "@/stores/player";
import player from "@/views/player";

export interface realSongInfo extends SongInfo {
  fullName: string;
  localedTime: string;
  localedPublishTime: string;
}

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

    const indexDefiner = (idx: number) => idx + 1;
    const baseCount = ref(14);
    const sliceInterval = ref(14);

    const handleDownload = (songItem: realSongInfo) => {
      console.info(songItem);
    };

    const playerStore = usePlayerStore();
    const audioStore = useAudioStore();
    const playBtnClickHandler = async (songItem: realSongInfo) => {
      playerStore.handlePlaySoundNeededData(songItem.id);
    };

    const renderMainSongTable = (infinityScrollProps: any) => {
      if (!songData.value.length) return;
      const { showIndex } = props;
      return (
        <elTable
          class="song-table"
          data={songData.value.slice(0, infinityScrollProps.currentCount)}
          rowClassName="song-list-item"
          cellClassName="song-list-cell"
          defaultSort={{ prop: "index", order: "ascending" }}
        >
          {showIndex && (
            <elTableColumn
              prop="index"
              type="index"
              index={indexDefiner}
            ></elTableColumn>
          )}

          <elTableColumn
            label="歌曲"
            prop="song"
            sortable
            width="540"
            v-slots={{
              default(scope: any) {
                const { row } = scope;
                const { musicName } = row;
                return (
                  <el-row
                    class="song-item-body"
                    type="flex"
                    justify="space-between"
                  >
                    <el-col class="song-body-left" span={18}>
                      <div class="song-love" title="添加至我喜欢">
                        <i class="iconfont icon-xihuan"></i>
                      </div>
                      <div class="song-name" title={musicName} singallinedot>
                        {musicName}
                      </div>
                    </el-col>

                    <el-col span={5}>
                      <div class="song-tools">
                        <div
                          class="song-tool-item"
                          title="添加到"
                          singallinedot
                        >
                          <i class="iconfont icon-plus"></i>
                        </div>
                        <div
                          class="song-tool-item"
                          title="播放"
                          onClick={() => playBtnClickHandler(row)}
                        >
                          <i class="iconfont icon-play"></i>
                        </div>
                        <div
                          class="song-tool-item"
                          title="下载"
                          onClick={() => handleDownload(row)}
                        >
                          <i class="iconfont icon-download"></i>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                );
              },
            }}
          ></elTableColumn>

          <elTableColumn
            label="专辑"
            prop="ablum"
            sortable
            width="400"
            v-slots={{
              default(scope: any) {
                const {
                  row: {
                    al: { name },
                  },
                } = scope;
                return (
                  <div title={name} singallinedot>
                    {name}
                  </div>
                );
              },
            }}
          ></elTableColumn>

          <elTableColumn
            label="时长"
            prop="duration"
            sortable
            v-slots={{
              default(scope: any) {
                const { localedTime } = scope.row;
                return (
                  <div title={localedTime} singallinedot>
                    {localedTime}
                  </div>
                );
              },
            }}
          ></elTableColumn>

          {isRenderPublishTime.value && (
            <elTableColumn
              label="发行时间"
              prop="publishTime"
              sortable
              v-slots={{
                default(scope: any) {
                  const { localedPublishTime } = scope.row;
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
              }}
            ></elTableColumn>
          )}
        </elTable>
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
