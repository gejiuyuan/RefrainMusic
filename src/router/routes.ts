import Home from "@views/home";

const MusicHall = () => import("@components/home/music-hall");
const MusicHallRecommend = () =>
  import("@components/home/music-hall/recommend");
const MusicHallTop = () => import("@components/home/music-hall/top");
const MusicHallNewest = () => import("@components/home/music-hall/newestmusic");
const MusicHallSonglist = () => import("@components/home/music-hall/songlist");
const MusicHallArtist = () => import("@components/home/music-hall/artist");

const MusicRadio = () => import("@components/home/music-radio");
const OnlineVideo = () => import("@components/home/online-video");
const Setting = () => import("@components/home/setting");

const Artist = () => import("@components/home/artist");
const ArtistFeature = () => import("@components/home/artist/featured");
const ArtistAllSongs = () => import("@components/home/artist/allSongs");
const ArtistAlbum = () => import("@components/home/artist/album");
const artistMv = () => import("@components/home/artist/mv");
const artistSimiSinger = () => import("@components/home/artist/similarSinger");
const artistDesc = () => import("@components/home/artist/description");

const Songlist = () => import("@components/home/songlist");
const SonglistMusic = () => import("@components/home/songlist/music");
const SonglistComment = () => import("@components/home/songlist/comment");
const SonglistSubscriber = () => import("@components/home/songlist/subscriber");

const User = () => import("@components/home/user");
const UserPlayRecord = () => import("@components/home/user/play-record");
const UserCollection = () => import("@components/home/user/collection");
const UserSonglist = () => import("@components/home/user/songlist");

const Search = () => import("@components/home/search");
const SearchSongs = () => import("@components/home/search/songs");
const SearchAlbum = () => import("@components/home/search/album");
const SearchLyric = () => import("@components/home/search/lyric");
const SearchRadio = () => import("@components/home/search/radio");
const SearchVideo = () => import("@components/home/search/video");
const SearchUser = () => import("@components/home/search/user");
const SearchSonglist = () => import("@components/home/search/songlist");
const SearchSinger = () => import("@components/home/search/singer");

const routes = [
  {
    path: "/",
    redirect: "/musichall",
    component: Home,
    props: {},
    beforeEnter() {},
    meta: {},
    children: [
      {
        path: "musichall",
        redirect: "/musichall/recommend",
        component: MusicHall,
        children: [
          {
            path: "recommend",
            component: MusicHallRecommend,
          },
          {
            path: "top",
            component: MusicHallTop,
          },
          {
            path: "newestmusic",
            component: MusicHallNewest,
          },
          {
            path: "songlist",
            component: MusicHallSonglist,
          },
          {
            path: "artist",
            component: MusicHallArtist,
          },
        ],
      },

      {
        path: "musicradio",
        component: MusicRadio,
      },

      {
        path: "onlinevideo",
        component: OnlineVideo,
      },

      {
        path: "setting",
        component: Setting,
      },

      {
        path: "artist",
        redirect: "/artist/featured",
        component: Artist,
        children: [
          {
            path: "featured",
            component: ArtistFeature,
          },

          {
            path: "allSongs",
            component: ArtistAllSongs,
          },

          {
            path: "album",
            component: ArtistAlbum,
          },

          {
            path: "mv",
            component: artistMv,
          },

          {
            path: "similarSinger",
            component: artistSimiSinger,
          },

          {
            path: "description",
            component: artistDesc,
          },
        ],
      },

      {
        path: "songlist",
        redirect: "/songlist/music",
        component: Songlist,
        children: [
          {
            path: "music",
            component: SonglistMusic,
          },

          {
            path: "comments",
            component: SonglistComment,
          },

          {
            path: "subscribers",
            component: SonglistSubscriber,
          },
        ],
      },

      {
        path: "user",
        redirect: "/user/playRecord",
        component: User,
        children: [
          {
            path: "playRecord",
            component: UserPlayRecord,
          },
          {
            path: "collection",
            component: UserCollection,
          },
          {
            path: "songlist",
            component: UserSonglist,
          },
        ],
      },

      {
        path: "search",
        redirect: "/search/songs",
        component: Search,
        children: [
          {
            path: "songs",
            component: SearchSongs,
          },
          {
            path: "album",
            component: SearchAlbum,
          },
          {
            path: "lyric",
            component: SearchLyric,
          },
          {
            path: "radio",
            component: SearchRadio,
          },
          {
            path: "video",
            component: SearchVideo,
          },
          {
            path: "user",
            component: SearchUser,
          },
          {
            path: "songlist",
            component: SearchSonglist,
          },
          {
            path: "singer",
            component: SearchSinger,
          },
        ],
      },
    ],
  },
];

export default routes;
