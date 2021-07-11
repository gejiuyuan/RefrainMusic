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

import { musicRecommend, getNewExpressMusic } from "@api/music";
import InfinityScrolling, {
  InfinityScrollingDefaultSlotArg,
} from "@/widgets/infiity-scrolling";
import "./index.scss";
import { padPicCrop } from "@/utils";

export default defineComponent({
  name: "MusicHallNewestmusic",
  setup(props, context) {
    const vm = getCurrentInstance()!;
    const musicList = markRaw<any[]>([]);

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
        <section class="music-wrap">
          <NGrid xGap={35} yGap={35} cols={7}>
            {
              musicList
                .slice(0, currentCount)
                .map(
                  (list) => (
                    <NGridItem key={list.name}>
                      <div class="music-item">
                        <div class="music-cover" equalAspectRatio>
                          <img
                            loading="lazy"
                            src={padPicCrop(list.album.blurPicUrl, { x: 340, y: 340 })}
                            alt=""
                          />
                        </div>
                        <div class="music-body">
                          <h6 title={list.name}>{list.name}</h6>
                          <p title={list.singer}>{list.singer}</p>
                        </div>
                      </div>
                    </NGridItem>
                  )
                )
            }
          </NGrid>
        </section>
      );
    }

    return () => (
      <div class="music-hall-newestmusic">
        <InfinityScrolling
          sliceInterval={sliceInterval.value}
          total={musicList.length}
          baseCount={baseCount.value}
          v-slots={{
            default: renderInfinityScrollDefaultSlot
          }}
        ></InfinityScrolling>
      </div>
    );
  },
});
