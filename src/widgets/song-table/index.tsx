import {
  ref,
  computed,
  onUnmounted,
  onDeactivated,
  onActivated,
  defineProps,
  defineComponent,
  HTMLAttributes,
} from "vue";
import { SongInfo } from "@/types/song";
import { second2TimeStr, getLocaleDate, noop } from "@utils/index";
import InfinityScrolling from "@/widgets/infiity-scrolling";
import "./index.scss";
import { EMPTY_OBJ, freeze } from "@/utils/constant";

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
      type: Array,
      required: true,
    },
  },
  setup(props, ctx) {
    const isRenderPublishTime = ref(false);

    const songData = computed(() => {
      const dataList = freeze(([...props.dataList] as realSongInfo[]) || []);
      dataList.forEach((song) => {
        const { alia = [], name, dt, publishTime } = song;
        song.fullName = name + (alia.length ? " - " + alia.join("、") : "");
        song.localedTime = second2TimeStr(dt / 1000);
        //如果没有publishTime属性，就不显示对应列
        if (publishTime != null) {
          isRenderPublishTime.value = true;
          song.localedPublishTime = publishTime
            ? getLocaleDate(publishTime, {
                delimiter: "-",
                divide: "day",
              })
            : "未知";
        }
      });
      return dataList;
    });

    const indexDefiner = (idx: number) => idx + 1;
    const baseCount = ref(14);
    const sliceInterval = ref(14);

    const handleDownlaod = (songItem: realSongInfo) => {
      console.info(songItem);
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
                return (
                  <el-row
                    class="song-item-body"
                    type="flex"
                    justify="space-between"
                  >
                    <el-col class="song-body-left" span={18}>
                      <div class="song-love" title="添加至我喜欢">
                        <svg class="icon icon-xihuan" aria-hidden="true">
                          <use xlinkHref="#icon-xihuan"></use>
                        </svg>
                      </div>
                      <div
                        class="song-name"
                        title={scope.row.fullName}
                        singalLineDot
                      >
                        {scope.row.fullName}
                      </div>
                    </el-col>

                    <el-col span={5}>
                      <div class="song-tools">
                        <div
                          class="song-tool-item"
                          title="添加到"
                          singalLineDot
                        >
                          <svg class="icon icon-plus" aria-hidden="true">
                            <use xlinkHref="#icon-plus"></use>
                          </svg>
                        </div>
                        <div class="song-tool-item" title="播放">
                          <svg class="icon icon-play" aria-hidden="true">
                            <use xlinkHref="#icon-bofang"></use>
                          </svg>
                        </div>
                        <div
                          class="song-tool-item"
                          title="下载"
                          onClick={() => handleDownlaod(scope.row)}
                        >
                          <svg class="icon icon-downlaod" aria-hidden="true">
                            <use xlinkHref="#icon-download"></use>
                          </svg>
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
                return (
                  <div title={scope.row.al.name} singalLineDot>
                    {scope.row.al.name}
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
                return (
                  <div title={scope.row.localedTime} singalLineDot>
                    {scope.row.localedTime}
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
                  return (
                    <div
                      class="song-publish-time"
                      title={scope.row.localedPublishTime}
                      singalLineDot
                    >
                      {scope.row.localedPublishTime}
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
