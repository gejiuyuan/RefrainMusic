import {
  markRaw,
  getCurrentInstance,
  toRefs,
  defineComponent,
  ComponentInternalInstance,
} from "vue";
import { useRouter } from "vue-router";
import { allTopList, allTopListDetail } from "@api/other";
import { getLocaleCount, is, padPicCrop } from "@utils/index";
import { NGrid, NGridItem, NIcon } from "naive-ui"; 
import "./index.scss";

const subDivideTopList = (topList: any[]) => {
  const hotList: any[] = [],
    commonList: any[] = [];
  for (const item of topList) {
    (is.emptyArray(item.tracks) ? commonList : hotList).push(item);
  }
  commonList.forEach((_) => (_.playCount = getLocaleCount(_.playCount)));
  return {
    hotList,
    commonList,
  };
};

export default defineComponent({
  name: "MusicHallTop",
  setup(props, { slots, emit }) {
    const router = useRouter();
    const vm = getCurrentInstance()!;

    const toplistData = markRaw({
      hotList: [] as any[],
      commonList: [] as any[],
    });

    const getAllTopListDetail = async () => {
      const { list } = await allTopListDetail();
      const { hotList: hots, commonList: commons } = subDivideTopList(list);
      toplistData.hotList = hots;
      toplistData.commonList = commons;
      vm.proxy!.$forceUpdate();
    };
    getAllTopListDetail();

    const toSongListDetailPage = (list: any) => {
      router.push({
        path: "/songlist/:id",
        name: 'songlist',
        params: { id: list.id }
      });
    };

    const renderSpecialList = () => (
      <section class="toplist-layer toplist-hot">
        <h5>云音乐特色榜</h5>
        <ul class="toplist-wrap">
          <NGrid xGap={36} yGap={36} cols={3}>
            {
              toplistData.hotList.map((item) =>
                <NGridItem class="toplist-item toplist-hot-item" key={item.name}>
                  <div onClick={() => toSongListDetailPage(item)}>
                    <NGrid cols={8}>
                      <NGridItem span={3}>
                        <div class="list-cover hot-cover" aspectratio="1">
                          <img
                            loading="lazy"
                            src={padPicCrop(item.coverImgUrl, { x: 340, y: 340 })}
                            alt=""
                          />
                        </div>
                      </NGridItem>
                      <NGridItem span={5}>
                        <div class="list-body">
                          <h6>{item.name}</h6>
                          {item.tracks.map((track: any, i: number) => (
                            <p key={track.first}>
                              {++i}&nbsp;{Object.values(track).join(" - ")}
                            </p>
                          ))}
                        </div>
                      </NGridItem>
                    </NGrid>
                  </div>
                </NGridItem>
              )
            }
          </NGrid>

        </ul>
      </section>
    );

    const renderGlobalList = () => (
      <section class="toplist-layer toplist-global">
        <h5>全球媒体榜</h5>
        <section class="toplist-wrap">
          <NGrid xGap={30} yGap={30} cols={6}>
            {
              toplistData.commonList.map((item) =>
                <NGridItem class="toplist-item toplist-global-item" key={item.name}>
                  <div onClick={() => toSongListDetailPage(item)} >
                    <div class="list-cover global-cover" aspectratio="1">
                      <img
                        loading="lazy"
                        src={padPicCrop(item.coverImgUrl, { x: 440, y: 440 })}
                      />
                      <div class="play-count">{item.playCount}</div>
                      <div class="play-icon">
                        <i className="iconfont icon-bofan"></i>
                      </div> 
                    </div>
                    <h6>{item.name}</h6>
                    <p>{item.updateFrequency}</p>
                  </div>
                </NGridItem>
              )
            }
          </NGrid>
        </section>
      </section>
    );

    return () => {
      return (
        <section class="music-hall-top">
          {renderSpecialList()}
          {renderGlobalList()}
        </section>
      );
    };
  },
});
