import {
  defineComponent,
  markRaw,
  onMounted,
  reactive,
  readonly,
  ref,
} from "vue";
import AsideRouterList from "@/widgets/aside-route-list";
import { playlistCate } from "@api/playlist";
import "./index.scss";

export default defineComponent({
  name: "HomeCategory",
  setup(props, { slots, emit }) {

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
        <section class="home-category">
          <section class="home-left-nav" scrollbar="auto">
            <AsideRouterList
              list={onlineMusic.list}
              title={onlineMusic.title}
            ></AsideRouterList>
          </section>
        </section>
      );
    };
  },
});
