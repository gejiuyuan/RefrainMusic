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

export default defineComponent({
  name: "MusicHall",
  setup(props, context) {
    const musichallCate = [
      { text: "个性推荐", to: { path: "/musichall/recommend" } },
      { text: "排行榜", to: { path: "/musichall/top" } },
      { text: "最新音乐", to: { path: "/musichall/newestmusic" } },
      { text: "歌单", to: { path: "/musichall/songlist" } },
      { text: "歌手", to: { path: "/musichall/artist" } },
    ];

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
