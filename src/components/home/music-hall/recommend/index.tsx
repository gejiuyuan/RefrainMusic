import {
  markRaw,
  getCurrentInstance,
  shallowReactive,
  reactive,
  defineComponent,
  ComponentInternalInstance,
  ref,
} from "vue";
import {
  useRouter
} from 'vue-router';
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
    const router = useRouter();
    const recommendData = reactive({
      bannerlist: [] as any[],
      songlist: [] as any[]
    })

    const limit = 10;
    const vm = getCurrentInstance()!;

    const getBanner = async () => {
      const { banners = [] } = await bannerInfo({ type: 0 });
      recommendData.bannerlist = banners;
    };
    getBanner();
    const getRecommendSonglist = async () => {
      const { result = [] } = await recommendAlbum({ limit });
      recommendData.songlist = result;
    };
    getRecommendSonglist();

    const toSonglistDetailPage = (id: number | string) => {
      router.push({
        path: "/songlist",
        query: {
          id
        }
      })
    }

    return () => {
      const { bannerlist, songlist } = recommendData
      return (
        <section class="music-hall-recommend">
          <RecommendBanner bannerList={bannerlist}></RecommendBanner>
          <section class="layer">
            <h6>推荐歌单</h6>
            <section class="item-wrap">
              <NGrid xGap={35} yGap={35} cols={6}>
                {
                  songlist.map((item) => (
                    <NGridItem class="item" key={item.id}>
                      <div class="item-playbill" aspectratio="1" onClick={() => toSonglistDetailPage(item.id)}>
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
