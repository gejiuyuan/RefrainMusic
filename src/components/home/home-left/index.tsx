import {
  defineComponent,
  markRaw,
  onMounted,
  reactive,
  readonly,
  ref,
} from "vue";
import AsideRouterList from "@/widgets/aside-route-list";
import guoxiaoyouLogo from "@assets/img/guoxiaoyou.png";
import { playlistCate } from "@api/playlist";
import "./index.scss";

export default defineComponent({
  name: "HomeLeft",
  setup(props, { slots, emit }) {
    const logo = ref(guoxiaoyouLogo);

    const onlineMusic = reactive({
      title: "在线音乐",
      list: [
        { text: "音乐馆", to: { path: "/musichall" } },
        { text: "电台", to: { path: "/musicradio" } },
        { text: "视频", to: { path: "/onlinevideo" } },
      ],
    });

    return () => {
      return (
        <aside class="home-left">
          <h1 class="home-logo">
            <img loading="lazy" src={logo.value} />
          </h1>
          <section class="home-left-nav" scrollbar="auto">
            <AsideRouterList
              list={onlineMusic.list}
              title={onlineMusic.title}
            ></AsideRouterList>
          </section>
        </aside>
      );
    };
  },
});
