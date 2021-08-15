import {
  defineComponent,
  markRaw,
  onMounted,
  reactive,
  watch,
  shallowReactive,
  provide,
} from "vue";
import {
  useRoute,
  useRouter,
  LocationQuery,
  routerKey,
  RouterView,
  onBeforeRouteLeave,
} from "vue-router";
import CommonRouterList from "@/widgets/common-router-list";
import KeepAliveRouterview from "@/widgets/keep-alive-routerview";
import { searchCloud, searchMulMatch } from "@api/search";
import {
  objToQuery,
  deepCopy,
  getLocaleCount,
  getLocaleDate,
  padPicCrop,
  is,
} from "@/utils";
import "./index.scss";
import { EMPTY_OBJ } from "@/utils";
import { SearchLyricItem } from "@/types/lyric";
import { SearchPlaylist } from "@/types/songlist";
import { SearchSingerItem } from "@/types/singer";
import { SearchUserProfileItem } from "@/types/user";

import { NTabs, NTabPane } from "naive-ui";
import { COMPONENT_NAME, PAGE_SIZE } from "@/utils/preference";

export const baseSearchCate = [
  { text: "歌曲", to: "/search/songs", type: 1, limit: PAGE_SIZE.DEFAULT },
  { text: "视频", to: "/search/video", type: 1014, limit: PAGE_SIZE[COMPONENT_NAME.SEARCH_VIDEO] },
  { text: "专辑", to: "/search/album", type: 10, limit: PAGE_SIZE[COMPONENT_NAME.SEARCH_ALBUM] },
  { text: "歌单", to: "/search/songlist", type: 1000, limit: PAGE_SIZE[COMPONENT_NAME.SEARCH_SONGLIST] },
  { text: "歌词", to: "/search/lyric", type: 1006, limit: PAGE_SIZE[COMPONENT_NAME.SEARCH_LYRIC] },
  { text: "歌手", to: "/search/singer", type: 100, limit: PAGE_SIZE.DEFAULT },
  { text: "电台", to: "/search/radio", type: 1009, limit: PAGE_SIZE.DEFAULT },
  { text: "MV", to: "/search/mv", type: 1004, limit: PAGE_SIZE[COMPONENT_NAME.SEARCH_MV] },
  { text: "用户", to: "/search/user", type: 1002, limit: PAGE_SIZE.DEFAULT },
];

export enum SearchKeyTypeMap {
  music = 1,
  video = 1014,
  album = 10,
  playlist = 1000,
  lyric = 1006,
  singer = 100,
  radio = 1009,
  mv = 1004,
  user = 1002,
}

export interface SearchCloundData extends PlainObject {
  music: {
    songCount: number;
    songs: any[];
  };
  video: {
    videoCount: number;
    videos: any[];
  };
  album: {
    albumCount: number;
    albums: any[];
  };
  playlist: {
    playlistCount: number;
    playlists: SearchPlaylist[];
  };
  lyric: {
    songCount: number;
    songs: SearchLyricItem[];
  };
  singer: {
    artistCount: number;
    artists: SearchSingerItem[];
  };
  mv: PlainObject;
  user: {
    userprofilesCount: number;
    userprofiles: SearchUserProfileItem[];
  };
  radio: PlainObject;
}

export default defineComponent({
  name: "Search",
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    const searchCate = reactive(
      deepCopy<typeof baseSearchCate>(baseSearchCate)
    );

    const searchMulMatchData = reactive({
      album: [] as any[],
      artist: [] as any[],
    });

    const searchCloundData = reactive<SearchCloundData>({
      music: {
        songCount: 0,
        songs: [],
      },
      video: {
        videos: [],
        videoCount: 0,
      },
      album: {
        albumCount: 0,
        albums: [],
      },
      playlist: {
        playlistCount: 0,
        playlists: [],
      },
      lyric: {
        songCount: 0,
        songs: [],
      },
      singer: {
        artistCount: 0,
        artists: [],
      },
      mv: {},
      user: {
        userprofilesCount: 0,
        userprofiles: [],
      },
      radio: {},
    });
    provide("searchCloundData", searchCloundData);

    const toArtistDetailPage = (id: string | number, path = "") =>
      router.push({
        path: `/artist/${path}`,
        query: {
          id,
        },
      });

    /**
     * 获取搜索的头数据（包括歌手、专辑）
     * @param keywords
     */
    const getSearchMulMatch = async (keywords: string) => {
      const { data = {} } = await searchMulMatch({ keywords });
      const { result = {} } = data;
      const { album = [], artist = [] } = result;
      searchMulMatchData.album = album;
      searchMulMatchData.artist = artist;
    };

    /**
     * 获取搜索的详细数据（包括歌曲、歌词、歌单等各类别）
     * @param keywords
     * @param type
     */
    const getSearchCloundData = async (query: LocationQuery) => {
      const { keywords, type, limit, offset } = query as PlainObject<string>;
      const typeCat = SearchKeyTypeMap[+type];
      const { data = {} } = await searchCloud({
        type,
        keywords,
        limit,
        offset,
      });
      const { result } = data;
      result && (searchCloundData[typeCat] = result);
    };

    const searchQueryWatcher = watch(
      () => route.query,
      async (query: LocationQuery, oldQuery: LocationQuery | undefined) => {
        const { keywords: oldKeywords, type: oldType } = oldQuery || EMPTY_OBJ;
        const { keywords, type } = query as PlainObject<string>;
        searchCate.forEach((item: typeof baseSearchCate[number], i) => {
          const { to: baseTo, type, limit } = baseSearchCate[i];
          const queryStr = objToQuery(
            { keywords, type: `${type}`, limit, offset: "0" },
            true
          );
          item.to = baseTo + queryStr;
        });
        if (oldKeywords !== keywords) {
          getSearchMulMatch(keywords);
        }
        getSearchCloundData(query);
      },
      {
        immediate: true,
      }
    );

    onBeforeRouteLeave(() => {
      searchQueryWatcher();
    });

    const renderArtists = () => {
      return searchMulMatchData.artist.map((item, i) => (
        <div
          class="mutimatch-box mutimatch-singer"
          key={item.id}
          onClick={() => toArtistDetailPage(item.id)}
        >
          <img
            loading="lazy"
            class="singer-avatar"
            src={padPicCrop(item.picUrl, { x: 160, y: 160 })}
            alt=""
          />
          <div class="mutimatch-main">
            <h5>
              歌手：
              <em>{`${item.name}${item.trans && `（${item.trans}）`}`}</em>
            </h5>
            <div>
              <em
                class="mutimatch-link"
                onClick={(ev) => {
                  ev.stopPropagation();
                  toArtistDetailPage(item.id, "allSongs");
                }}
              >
                单曲：
                <span>{getLocaleCount(item.musicSize)}</span>
              </em>
              <em
                class="mutimatch-link"
                onClick={(ev) => {
                  ev.stopPropagation();
                  toArtistDetailPage(item.id, "mv");
                }}
              >
                MV：
                <span>{getLocaleCount(item.mvSize)}</span>
              </em>
              <em>
                粉丝：
                <span>{getLocaleCount(item.fansSize)}</span>
              </em>
            </div>
          </div>
        </div>
      ));
    };

    const renderAlbums = () => {
      return searchMulMatchData.album.map((item, i) => (
        <div class="mutimatch-box mutimatch-album" key={item.id}>
          <img
            loading="lazy"
            class="album-pic"
            src={padPicCrop(item.picUrl, { x: 160, y: 160 })}
            alt=""
          />
          <div class="mutimatch-main">
            <h5>
              专辑：
              <em>{`${item.name}`}</em>
            </h5>
            <div>
              <em>
                发布时间：
                <span>{getLocaleDate(item.publishTime)}</span>
              </em>
            </div>
          </div>
        </div>
      ));
    };

    return () => {
      const { artist, album } = searchMulMatchData;
      const hasSearchMutiMatch = [artist, album].some((_) => !is.emptyArray(_));
      return (
        <section class="yplayer-search">
          {hasSearchMutiMatch && (
            <section class="search-multimatch">
              {renderArtists()}
              {renderAlbums()}
            </section>
          )}
          <CommonRouterList routelist={searchCate}></CommonRouterList>
          <KeepAliveRouterview></KeepAliveRouterview>
        </section>
      );
    };
  },
});
