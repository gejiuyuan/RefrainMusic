import { computed, defineComponent, PropType } from "vue";

import { NGrid, NGridItem } from "naive-ui";
import "./index.scss";
import { SongInfo } from "@/types/song";
import { freeze, padPicCrop } from "@/utils";
import { getModifiedSongInfo, RealSongInfo } from "@/utils/apiSpecial";
import { MusicSinger } from "../music-tiny-comp";

export const MusicItem = defineComponent({
  name: "MusicItem",
  props: {
    musicInfo: {
      type: Object as PropType<RealSongInfo>,
      required: true,
    },
  },
  setup(props, { slots, emit }) {
    return () => {
      const {
        al: { picUrl },
        musicName,
        singers,
        localedDuration,
        localedMark,
        localedPublishTime,
      } = props.musicInfo;
      return (
        <div class="music-item">
          <div className="playbill" aspectratio="1">
            <img src={padPicCrop(picUrl, { x: 200, y: 200 })} alt="" />
          </div>
          <div class="info">
            <h6 singallinedot>{musicName}</h6>
            <div singallinedot>
              <MusicSinger singers={singers}></MusicSinger>
            </div>
          </div>
          <div className="desc">
            <span>{localedDuration}</span>
            <span>{localedMark}</span>
            <span>{localedPublishTime}</span>
          </div>
        </div>
      );
    };
  },
});

export default defineComponent({
  name: "MusicList",
  props: {
    musiclists: {
      type: Array as PropType<SongInfo[]>,
      required: false,
      default: () => [],
    },
    defaultLimit: {
      type: Number as PropType<number>,
      required: false,
      default: 30,
    },
    total: {
      type: Number as PropType<number>,
      required: false,
      default: 0,
    },
    gaps: {
      type: Object as PropType<Partial<Record<"x" | "y", number>>>,
      required: false,
      default: { x: 30, y: 30 },
    },
    cols: {
      type: Number as PropType<number>,
      required: false,
      default: 3,
    },
  },
  setup(props, { slots, emit }) {
    const songData = computed(() => {
      const dataList = freeze([...props.musiclists] || []);
      return dataList.map((songInfo) => {
        const realSongInfo = getModifiedSongInfo(songInfo);
        return realSongInfo;
      });
    });

    return () => {
      const {
        gaps: { x, y },
        cols,
      } = props;
      return (
        <section class="music-list">
          <NGrid xGap={x} yGap={y} cols={cols}>
            {songData.value.map((item) => {
              return (
                <NGridItem>
                  <MusicItem musicInfo={item}></MusicItem>
                </NGridItem>
              );
            })}
          </NGrid>
        </section>
      );
    };
  },
});
