import {
  computed,
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
import useUserStore from "@/stores/user";
import guoxiaoyouLogo from "@assets/img/guoxiaoyou.png";

export default defineComponent({
  name: "HomeLeft",
  setup(props, { slots, emit }) {

    const userStore = useUserStore();

    const logo = ref(guoxiaoyouLogo);

    const onlineMusic = reactive({
      title: "在线音乐",
      list: [
        { text: "音乐馆", to: { path: "/musichall" } },
        { text: "电台", to: { path: "/musicradio" } },
        { text: "视频", to: { path: "/onlinevideo" } },
      ],
    });


    const createdPlaylist = computed(() => {
      const list = userStore.playlist.myCreated.map(({ name, id }) => {
        return {
          text: name,
          to: {
            path: '/songlist/:id',
            name: 'songlist',
            params: { id }
          }
        }
      })
      return {
        title: '创建的歌单',
        list,
      }
    })

    const collectedPlaylist = computed(() => {
      const list = userStore.playlist.myCollection.map(({ name, id }) => {
        return {
          text: name,
          to: {
            path: '/songlist/:id',
            name: 'songlist',
            params: { id }
          }
        }
      })
      return {
        title: '收藏的歌单',
        list,
      }
    })

    return () => {

      const { list: createdList, title: createdTitle } = createdPlaylist.value;
      const { list: collectionList, title: collectionTitle } = collectedPlaylist.value;

      return (
        <aside class="home-left">
          <h1 class="home-logo">
            <img loading="lazy" src={logo.value} />
          </h1>
          <section class="home-category" scrollbar="overlay">
            <AsideRouterList
              list={onlineMusic.list}
              title={onlineMusic.title}
            ></AsideRouterList>
            <AsideRouterList
              list={createdList}
              title={createdTitle}
            ></AsideRouterList>
            <AsideRouterList
              list={collectionList}
              title={collectionTitle}
            ></AsideRouterList>
          </section>
        </aside>
      );
    };
  },
});
