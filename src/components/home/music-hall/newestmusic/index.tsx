import {
  getCurrentInstance,
  ref,
  computed,
  shallowReactive,
  markRaw,
  defineComponent,
  ComponentInternalInstance,
} from "vue";
import { NGrid, NGridItem } from "naive-ui";
import MusicList from "@widgets/music-list";
import { musicRecommend, getNewExpressMusic } from "@api/music";
import InfinityScrolling, {
  InfinityScrollingDefaultSlotArg,
} from "@/widgets/infiity-scrolling";
import "./index.scss";
import { padPicCrop } from "@/utils";
import { getModifiedNewestSongInfo } from "@/utils/apiSpecial";
import music from "../../songlist/music";
import { NewestSongInfo } from "@/types/song";

export default defineComponent({
  name: "MusicHallNewestmusic",
  setup(props, context) {
    const vm = getCurrentInstance()!;
    const musicList = markRaw<NewestSongInfo[]>([]);

    const sliceInterval = ref(12); //切片间隔
    const baseCount = ref(24); //基础显示数量

    const getNewestMusic = async () => {
      const { data } = await getNewExpressMusic({ type: 0 });
      data.forEach((item: any) => {
        item.singer = item.artists.map((_: any) => _.name).join(" / ");
      });
      musicList.length = 0;
      musicList.push(...data);
      vm.proxy!.$forceUpdate();
    };
    getNewestMusic();

    const renderInfinityScrollDefaultSlot = (
      infinityScrollProps: InfinityScrollingDefaultSlotArg
    ) => {
      if (!musicList.length) return;
      const { currentCount } = infinityScrollProps;

      return (
        <MusicList
          musiclists={musicList.slice(0, currentCount)}
          category="newest"
        ></MusicList> 
      );
    };

    return () => (
      <div class="music-hall-newestmusic">
        <InfinityScrolling
          sliceInterval={sliceInterval.value}
          total={musicList.length}
          baseCount={baseCount.value}
          v-slots={{
            default: renderInfinityScrollDefaultSlot,
          }}
        ></InfinityScrolling>
      </div>
    );
  },
});
