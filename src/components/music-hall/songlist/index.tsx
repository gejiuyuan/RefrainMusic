import {
  shallowReactive, 
  getCurrentInstance, 
  defineComponent,
} from "vue";
import {
  useRouter,
  useRoute, 
  RouterLink,
} from "vue-router";
import { CatListSub } from "@/types/songlist";
import { playlistCate, topPlaylist } from "@api/playlist";
import { EMPTY_OBJ, freeze } from "@/utils/constants";
import Songlist from "@widgets/song-list";
import "./index.scss";
import {
  NGrid,
  NGridItem,
  NDropdown,
  NButton,
  NxButton,
  NIcon,
} from "naive-ui";  
import { COMPONENT_NAME, PAGE_SIZE } from "@/utils/preference";
import { onFilteredBeforeRouteUpdate } from "@/hooks/onRouteHook";
import YuanInfinityScroll from '@widgets/infinity-scroll/infinity-scroll';

const obtainCategory = (data: any) => {
  const { categories, sub } = data;
  const cats: string[] = Object.values(categories);
  const catsArr = Array(cats.length)
    .fill("")
    .map(() => [] as CatListSub[]);

  sub.forEach((item: CatListSub) => {
    catsArr[item.category].push(item);
  });
  return {
    cats: cats as readonly any[],
    catsArr: catsArr as readonly any[],
  };
};

const orders = [
  { text: "热门", key: "hot" },
  { text: "最新", key: "new" },
];

export default defineComponent({
  name: COMPONENT_NAME.MUSICHALL_SONGLIST,
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();

    const vm = getCurrentInstance()!;

    const defaultOrder = orders[0].text;

    //额外的信息
    const listExtraInfo = shallowReactive({
      order: defaultOrder,
      cat: "",
      defaultLimit: PAGE_SIZE[COMPONENT_NAME.MUSICHALL_SONGLIST],
    });

    const showingList = shallowReactive({
      playlists: [],
      total: 0,
    });

    const getSonglist = async ({
      cat = void 0,
      offset = 0,
      order = defaultOrder,
      limit = listExtraInfo.defaultLimit,
    }) => {
      const { playlists, total } = await topPlaylist({
        cat,
        offset,
        order,
        limit,
      });
      playlists && (showingList.playlists = playlists);
      showingList.total = total ?? 0;
      listExtraInfo.order =
        orders.find(({ key }) => key === order)?.text || defaultOrder;
      listExtraInfo.cat = cat || "";
    };
    getSonglist(route.query);

    onFilteredBeforeRouteUpdate((to) => {
      getSonglist(to.query);
    });

    const categoryData = shallowReactive<ReturnType<typeof obtainCategory>>({
      cats: [],
      catsArr: [],
    });
    const getPlaylistCate = async () => {
      const res = await playlistCate();
      const { cats, catsArr } = obtainCategory(res);
      categoryData.cats = freeze(cats);
      categoryData.catsArr = freeze(catsArr);
    };
    getPlaylistCate();

    const changeCatRoute = (cat: string) =>
      router.push({ query: { ...route.query, cat } });

    const handleOrderCmd = (order: string) =>
      router.push({ query: { ...route.query, order } });

    return () => {
      const catDropdownOptions = orders.map(({ key, text: label }) => ({
        key,
        label,
      }));
      return (
        <section class="music-hall-songlist">
          <section class="songlist-head">
            <NGrid>
              <NGridItem span={4}>
                <RouterLink class="songlist-all-link" to="/musichall/songlist">
                  全部
                </RouterLink>
              </NGridItem>
              <NGridItem span={2} offset={18}>
                <NDropdown
                  trigger="click"
                  onSelect={handleOrderCmd}
                  options={catDropdownOptions}
                >
                  <NxButton
                    type="primary"
                    size="tiny"
                    iconPlacement="right"
                    dashed
                    ghost
                  >
                    {{
                      default: () => listExtraInfo.order,
                      icon: () => (
                        <i className="iconfont icon-xiajiantou"></i>
                      ),
                    }}
                  </NxButton>
                </NDropdown>
              </NGridItem>
            </NGrid>
          </section>

          <section class="songlist-category">
            {
              categoryData.cats.map((item, i) =>
                <div class="cate-layer" key={item}>
                  <em class="cate-name">{item}</em>
                  <div class="cate-sub">
                    {
                      categoryData.catsArr[i].map((subItem: any) =>
                        <a
                          href="javascript:;"
                          class="cate-sub-item"
                          key={subItem.name}
                          onClick={() => changeCatRoute(subItem.name)}
                        >
                          {subItem.name}
                        </a>
                      )
                    }
                  </div>
                </div>
              )
            }
          </section>
           
          <Songlist
            playlists={showingList.playlists}
            defaultLimit={listExtraInfo.defaultLimit}
            total={showingList.total}
            gaps={{ x: 40, y: 40 }}
            cols={6}
          ></Songlist> 

        </section>
      );
    };
  },
});
