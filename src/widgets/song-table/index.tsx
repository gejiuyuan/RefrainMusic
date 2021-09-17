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
import usePlayerStore, { currentSongRefGlobal } from "@/stores/player";
import YuanTable, { YuanTableColumn } from "./yuan-table";
import { NGrid, NGridItem } from "naive-ui";
import { MusicLoveIcon, PlayStatusSwitch } from "../music-tiny-comp";
import { playingRefGlobal } from "@/stores/audio";
import { useRoute } from "vue-router";

export const getRealTabelSerial = (index: number) => {
  const { offset = 0, limit = 30 } = useRoute().query;
  const accumulate = Number(offset) * Number(limit);
  return ++index + accumulate;
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
    const route = useRoute();
    const songData = computed(() => {
      const dataList = freeze([...props.dataList] || []);
      return dataList.map((songInfo) => {
        const realSongInfo = getModifiedSongInfo(songInfo);
        return realSongInfo;
      });
    });
    const playerStore = usePlayerStore(); 

    const isRenderPublishTime = computed(() => {
      return props.dataList.some(({ publishTime }) => publishTime != null);
    });

    const handleDownload = (songItem: CurrentSongInfo) => {
      console.info(songItem);
    };

    return () => {
      if (!songData.value.length) return; 
      const playing = playingRefGlobal.value;

      return (
        <section class="song-table">

          <YuanTable
            class="song-table"
            rowClass="song-list-item"
            data={songData.value}
            showSerial
            serialDefiner={getRealTabelSerial}
          >

            <YuanTableColumn
              label="歌曲"
              span={4}
              v-slots={{
                default(curSongInfo: any) {
                  const { musicName, id } = curSongInfo;
                  const isPlaying = playing && (id === currentSongRefGlobal.value.id)
                  return (
                    <NGrid
                      class="song-item-body"
                    >
                      <NGridItem class="song-body-left" span={18}>
                        <MusicLoveIcon songInfo={curSongInfo}></MusicLoveIcon>
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
                          >
                            <PlayStatusSwitch id={id}></PlayStatusSwitch>
                          </div>
                          <div
                            class="tool-item"
                            title="下载"
                            onClick={() => handleDownload(curSongInfo)}
                          >
                            <i class="iconfont icon-download"></i>
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
