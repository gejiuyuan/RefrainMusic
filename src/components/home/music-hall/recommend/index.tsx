import {
  markRaw,
  getCurrentInstance,
  shallowReactive,
  reactive,
  defineComponent,
  ComponentInternalInstance,
} from "vue";
import { recommendAlbum } from "@api/playlist";
import { bannerInfo } from "@api/other";
import "./index.scss";
import { padPicCrop } from "@/utils";
import RecommendBanner from "./banner";
import { NGrid, NGridItem } from "naive-ui";

export type RecommendItem = {
  copywriter: string;
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  trackCount: number;
  trackNumberUpdateTime: number;
};

export default defineComponent({
  name: "MusicHallRecommend",
  setup(props, { slots, emit }) {
    const bannerlist = reactive<any[]>([]);
    const recommendSonglist = markRaw<RecommendItem[]>([]);
    const limit = 10;
    const vm = getCurrentInstance()!;

    const getBanner = async () => {
      const { banners = [] } = await bannerInfo({ type: 0 });
      bannerlist.push(...banners);
    };

    const getRecommendSonglist = async () => {
      const { result = [] } = await recommendAlbum({ limit });
      recommendSonglist.push(...result);
    };

    Promise.allSettled([getBanner(), getRecommendSonglist()]).then(() => {
      vm.proxy!.$forceUpdate();
    });

    return () => {
      return (
        <section class="music-hall-recommend">
          <RecommendBanner bannerList={bannerlist}></RecommendBanner>
          <section class="layer">
            <h6>推荐歌单</h6>
            <section class="item-wrap">
              <NGrid xGap={34} yGap={34} cols={6}>
                {
                  recommendSonglist.map((item) => (
                    <NGridItem class="item" key={item.id}>
                      <div class="item-playbill" equalAspectRatio>
                        <img
                          loading="lazy"
                          src={padPicCrop(item.picUrl, { x: 680, y: 680 })}
                        />
                        <div class="item-desc">
                          <p>{item.copywriter}</p>
                        </div>
                      </div>
                      <p class="item-name">{item.name}</p>
                    </NGridItem>
                  ))
                }
              </NGrid>
            </section>
          </section>
        </section>
      );
    };
  },
});
