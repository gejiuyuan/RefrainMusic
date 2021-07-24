import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  shallowReactive,
} from "vue";

import { NGrid, NGridItem } from "naive-ui";
import "./index.scss";
import { NewestSongInfo, SongInfo } from "@/types/song";
import { freeze, getPointerOffsetElm, padPicCrop } from "@/utils";
import {
  CurrentSongInfo,
  getModifiedNewestSongInfo,
  getModifiedSongInfo,
} from "@/utils/apiSpecial";
import { MusicSinger } from "../music-tiny-comp";

export const MusicItem = defineComponent({
  name: "MusicItem",
  props: {
    musicInfo: {
      type: Object as PropType<CurrentSongInfo>,
      required: true,
    },
  },
  setup(props, { slots, emit }) {
    const musicItemRef = ref<HTMLDivElement>();

    const suspensionInfo = shallowReactive({
      x: 0,
      y: 0,
      show: false,
    });
    const setSuspensionXY = (ev: MouseEvent) => {
      const { offsetX, offsetY } = getPointerOffsetElm(ev, musicItemRef.value!);
      suspensionInfo.x = offsetX + 10;
      suspensionInfo.y = offsetY + 10;
    };
    const itemMouseEnter = (ev: MouseEvent) => {
      setSuspensionXY(ev);
      suspensionInfo.show = true;
    };

    const itemMouseMove = (ev: MouseEvent) => {
      setSuspensionXY(ev);
    };

    const itemMouseLeave = (ev: MouseEvent) => {
      suspensionInfo.show = false;
    };

    return () => {
      const {
        album: { picUrl },
        musicName,
        albumName,
        singers,
        localedDuration,
        localedMark,
        localedPublishTime,
      } = props.musicInfo;

      return (
        <div
          class="music-item"
          ref={musicItemRef}
          onMouseenter={itemMouseEnter}
          onMousemove={itemMouseMove}
          onMouseleave={itemMouseLeave}
        >
          <div className="playbill" aspectratio="1">
            <img src={padPicCrop(picUrl, { x: 200, y: 200 })} alt="" />
          </div>
          <div class="info">
            <h6 singallinedot title={musicName}>
              {musicName}
            </h6>
            <div singallinedot>
              <MusicSinger singers={singers}></MusicSinger>
            </div>
          </div>
          <aside
            className="suspension"
            style={{
              visibility: suspensionInfo.show ? "visible" : "hidden",
              transform: `translate(${suspensionInfo.x}px, ${suspensionInfo.y}px)`,
            }}
          >
            <h6 singallinedot title={musicName}>
              {musicName}
            </h6>
            <div className="desc">
              <p>时长：{localedDuration}</p>
              <p>专辑：《{albumName}》</p>
              {localedMark && <p>评论数：{localedMark}</p>}
              <p>发布时间：{localedPublishTime}</p>
            </div>
          </aside>
        </div>
      );
    };
  },
});

export default defineComponent({
  name: "MusicList",
  props: {
    category: {
      type: String as PropType<"common" | "newest">,
      required: false,
      default: "common",
    },
    musiclists: {
      type: Array as PropType<(SongInfo | NewestSongInfo)[]>,
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
      default: { x: 20, y: 20 },
    },
    cols: {
      type: Number as PropType<number>,
      required: false,
      default: 3,
    },
  },
  setup(props, { slots, emit }) {
    const category = props.category;
    const songData = computed(() => {
      const dataList = freeze([...props.musiclists] || []);
      if (category === "newest") {
        return dataList.map((info) => {
          const realSongInfo = getModifiedNewestSongInfo(
            info as NewestSongInfo
          );
          return realSongInfo;
        });
      } else {
        return dataList.map((info) => {
          const realSongInfo = getModifiedSongInfo(info as SongInfo);
          return realSongInfo;
        });
      }
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
