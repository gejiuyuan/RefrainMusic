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
import './index.scss';

export default defineComponent({
    name: "HomeNav",
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
                <section class="yplayer-home-nav">
                    <h1 class="yplayer-logo">
                        <img loading="lazy" src={logo.value} />
                    </h1>
                    <section class="navbody-scroller" scrollbar="auto">
                        <section class="yplayer-home-navbody">
                            <AsideRouterList
                                list={onlineMusic.list}
                                title={onlineMusic.title}
                            ></AsideRouterList>
                        </section>
                    </section>
                </section>
            )
        }
    },
})