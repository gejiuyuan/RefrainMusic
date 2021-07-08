import {
  markRaw,
  onMounted,
  reactive,
  watch,
  shallowReactive,
  computed,
  toRefs,
  defineComponent,
  h,
} from "vue";
import {
  useRouter,
  useRoute,
  onBeforeRouteUpdate,
  RouteLocationNormalized,
  RouteComponent,
  RouterView,
} from "vue-router";
import {
  NMenu,
  NGrid,
  NGridItem
} from 'naive-ui'

import FollowButton from "@widgets/follow-button";
import CommonRouterList from "@/widgets/common-router-list";
import KeepAliveRouterview from "@/widgets/keep-alive-routerview";

import { artistSingalSongs } from "@api/singer";
import { deepCopy, extend, objToQuery, padPicCrop } from "@/utils";
import "./index.scss";
import { EMPTY_OBJ, freeze } from "@/utils";

export type Artist = {
  alias: string[];
  briefDesc: string;
  followed: boolean;
  picUrl: string;
  publishTime: number;
  name: string;
};

export type ArtistMenu = {
  text: string;
  key: string;
};

export interface MenuList extends ArtistMenu {
  to: string
}

const artistMenu: readonly ArtistMenu[] = freeze([
  { text: "精选", key: "featured" },
  { text: "所有歌曲", key: "allSongs" },
  { text: "专辑", key: "album" },
  { text: "MV", key: "mv" },
  { text: "相似歌手", key: "similarSinger" },
  { text: "详情", key: "description" },
]);

export default defineComponent({
  name: "Artist",
  setup(props, { emit, slots }) {
    const router = useRouter();
    const route = useRoute();

    const information = shallowReactive<{
      artist: Artist;
    }>({
      artist: {
        alias: [],
        briefDesc: "",
        followed: false,
        picUrl: "",
        publishTime: 0,
        name: "",
      },
    });

    //菜单列表
    const menuList = reactive<MenuList[]>(
      artistMenu.reduce((total, { text, key }, i) => {
        const item = {} as MenuList;
        item.text = text;
        item.key = key
        item.to = ''
        total.push(item);
        return total;
      }, [] as MenuList[])
    );
    const activeMenuValue = computed(() => {
      const { path } = route;
      return menuList.find(({ key }) => path.includes(key))?.text || menuList[0].text;
    });

    const getArtistDetail = async (route: RouteLocationNormalized) => {
      const query = route.query as PlainObject<string>;
      const id = query.id + "";
      menuList.forEach((item, i) => {
        item.to = `/artist/${item.key}${objToQuery(query, true)}`;
      });
      const { data } = await artistSingalSongs({ id });
      const { artist: artistInfo = [] } = data || EMPTY_OBJ;
      information.artist = freeze(artistInfo);
    };

    getArtistDetail(route);

    onBeforeRouteUpdate((to, { query: { id: fromId } }, next) => {
      if (to.query.id != fromId) {
        getArtistDetail(to);
      }
      next();
    });

    return () => {
      const { artist } = information;
      return (
        <section class="yplayer-artist artist-container">
          <NGrid
            class="artist-top"
          >
            <NGridItem span={4}>
              <section class="artist-top-left">
                <div class="artist-avatar">
                  <img
                    loading="lazy"
                    src={padPicCrop(artist.picUrl, { x: 200, y: 200 })}
                    alt=""
                  />
                </div>
              </section>
            </NGridItem>

            <NGridItem span={20}>
              <section class="artist-top-right">
                <h2 class="artist-name">
                  <span class="artist-real-name">{artist.name}</span>
                  <span class="artist-alias">{artist.alias.join("、")}</span>
                </h2>
                <div class="artist-operate">
                  <FollowButton></FollowButton>
                </div>
              </section>
            </NGridItem>
          </NGrid>

          <section class="artist-main">
            <section class="artist-menu">
              <CommonRouterList routelist={menuList}></CommonRouterList>
            </section>
            <KeepAliveRouterview></KeepAliveRouterview>
          </section>
        </section>
      );
    };
  },
});
