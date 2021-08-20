import {
  markRaw,
  onMounted,
  readonly,
  ref,
  defineComponent,
} from "vue";
import CommonRouterList from "@widgets/common-router-list";
import KeepAliveRouterview from "@widgets/keep-alive-routerview";
import { RouterView } from "vue-router";
import "./index.scss";
import { getHomepageDragonBall, getHomepageFindings } from "@/api/homeInfo";

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

    // getHomepageDragonBall().then(console.info) 

    return () => {
      return (
        <section class="music-hall">
          <h2>音乐馆</h2>
          <CommonRouterList routelist={musichallCate}></CommonRouterList>
          <KeepAliveRouterview></KeepAliveRouterview>
        </section>
      );
    };
  },
});
