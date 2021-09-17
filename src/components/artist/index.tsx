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

import FollowButton, { FollowType } from "@widgets/follow-button";
import CommonRouterList from "@/widgets/common-router-list"; 

import { artistSingalSongs } from "@api/singer";
import { deepCopy, extend, objToQuery, padPicCrop } from "@/utils";
import "./index.scss";
import { EMPTY_OBJ, freeze } from "@/utils";
import { renderKeepAliveRouterView } from "@/widgets/common-renderer";
import { onFilteredBeforeRouteUpdate } from "@/hooks/onRouteHook";

export type Artist = {
  alias: string[];
  briefDesc: string;
  followed: boolean;
  picUrl: string;
  publishTime: number;
  name: string;
  id: string | number;
};

export type ArtistMenu = {
  text: string;
  key: string;
};

export interface MenuList extends ArtistMenu {
  to: string
}

const artistMenu: readonly ArtistMenu[] = freeze([
  { text: "热门歌曲", key: "featured" },
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

    const information = reactive<{
      artist: Artist; 
    }>({
      artist: {
        alias: [],
        briefDesc: "",
        followed: false,
        picUrl: "",
        publishTime: 0,
        id: '',
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
    
    const getArtistDetail = async (to: RouteLocationNormalized, from: RouteLocationNormalized = EMPTY_OBJ) => {
      const { query:toQuery } = to;
      const { query:fromQuery = EMPTY_OBJ } = from;
      if(toQuery.id !== fromQuery.id) {
        menuList.forEach((item, i) => {
          item.to = `/artist/${item.key}${objToQuery(toQuery, true)}`;
        });
        const { artist: artistInfo = {} } = await artistSingalSongs({ id:String(toQuery.id) });
        information.artist = artistInfo;
      }
    };

    getArtistDetail(route);

    onFilteredBeforeRouteUpdate((to, from) => {
      getArtistDetail(to, from);
    });
 
    const followChangeHandler = (isFollow: boolean) => {
      information.artist.followed = isFollow;
    } 

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
                  <FollowButton 
                    userId={artist.id} 
                    followed={artist.followed} 
                    followType={FollowType.artist}
                    onUpdateFollow={followChangeHandler} 
                  ></FollowButton>
                </div>
              </section>
            </NGridItem>
          </NGrid>

          <section class="artist-main">
            <section class="artist-menu">
              <CommonRouterList routelist={menuList}></CommonRouterList>
            </section>
            {
              renderKeepAliveRouterView()
            }
          </section>
        </section>
      );
    };
  },
});
