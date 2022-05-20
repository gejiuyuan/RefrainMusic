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

    const renderSpecialList = () => {
      const columnCount = 3;
      const gap = 36;
      return (
        <section class="toplist-layer toplist-hot">
          <h5>云音乐特色榜</h5>
          <section class="toplist-wrap toplist-wrap-hot">
            <NGrid xGap={gap} yGap={gap} cols={columnCount}>
              {
                toplistData.hotList.map((item) =>
                  <NGridItem class="toplist-item toplist-hot-item" key={item.name}>
                    <div class="list-wrapper" onClick={() => toSongListDetailPage(item)}>
                      <div class="list-cover hot-cover" aspectratio="1">
                        <img
                          loading="lazy"
                          src={padPicCrop(item.coverImgUrl, { x: 340, y: 340 })}
                          alt=""
                        />
                      </div>
                      <div class="list-body">
                        <h6>{item.name}</h6>
                        {item.tracks.map((track: any, i: number) => (
                          <p key={track.first} singallinedot>
                            {++i}&nbsp;{Object.values(track).join(" - ")}
                          </p>
                        ))}
                      </div>
                    </div>
                  </NGridItem>
                )
              }
            </NGrid>
          </section>
        </section>
      )
    }
    const renderGlobalList = () => {
      const columnCount = 7;
      const gap = 30;
      return (
        <section class="toplist-layer toplist-global">
          <h5>全球媒体榜</h5>
          <section class="toplist-wrap">
            <NGrid xGap={gap} yGap={gap} cols={columnCount}>
              {
                toplistData.commonList.map((item) =>
                  <NGridItem class="toplist-item toplist-global-item" key={item.name}>
                    <div class="list-wrapper" onClick={() => toSongListDetailPage(item)} >
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
      )
    }

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
