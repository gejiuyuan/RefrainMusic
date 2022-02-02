import {
  defineComponent,
} from "vue";
import CommonRouterList from "@widgets/common-router-list";
import { renderKeepAliveRouterView } from "@/widgets/common-renderer";
import "./index.scss";

export default defineComponent({
  name: "MusicHall",
  setup(props, context) {
    const musichallCate = [
      { text: "精选", to: { path: "/musichall/featrued" } },
      { text: "排行榜", to: { path: "/musichall/top" } },
      { text: "新歌速递", to: { path: "/musichall/newestmusic" } },
      { text: "新碟上架", to: { path: "/musichall/newestdisc" } },
      { text: "歌单", to: { path: "/musichall/songlist" } },
      { text: "歌手", to: { path: "/musichall/artist" } },
    ];

    return () => {
      return (
        <section class="music-hall">
          <h2>音乐馆</h2>
          <div sticky-list>
            <CommonRouterList routelist={musichallCate}></CommonRouterList>
          </div>
          {
            renderKeepAliveRouterView()
          }
        </section>
      );
    };
  },
});
