
const Home = () => import("@views/home");

const MusicHall = () => import("@components/music-hall");
const MusicHallFeatured = () => import("@components/music-hall/featured");
const MusicHallTop = () => import("@components/music-hall/top");
const MusicHallNewest = () => import("@components/music-hall/newestmusic");
const MusicHallSonglist = () => import("@components/music-hall/songlist");
const MusicHallArtist = () => import("@components/music-hall/artist");
const MusicHallNewdisc = () => import("@components/music-hall/newestdisc");
const MusicRadio = () => import("@components/music-radio");

const OnlineVideo = () => import('@components/online-video');

const VideoAll = () => import('@components/online-video/all');

const VideoCategory = () => import('@components/online-video/category');

const Setting = () => import('@components/setting');
const SettingGeneral = () => import('@/components/setting/general');

const Artist = () => import('@components/artist');
const ArtistFeatured = () => import('@components/artist/featured');
const ArtistAllSongs = () => import('@components/artist/allSongs');
const ArtistAlbum = () => import('@components/artist/album');
const ArtistMv = () => import('@components/artist/mv');
const ArtistSimiSinger = () => import('@components/artist/similarSinger');
const ArtistDesc = () => import('@components/artist/description');

const Songlist = () => import('@components/songlist');
const SonglistMusic = () => import('@components/songlist/music');
const SonglistComment = () => import('@components/songlist/comment');
const SonglistSubscriber = () => import('@components/songlist/subscriber');

const User = () => import('@components/user');
const UserPlayRecord = () => import('@components/user/play-record');
const UserCollection = () => import('@components/user/collection');
const UserSonglist = () => import('@components/user/songlist');

const Search = () => import('@components/search');
const SearchSongs = () => import('@components/search/songs');
const SearchAlbum = () => import('@components/search/album');
const SearchLyric = () => import('@components/search/lyric');
const SearchRadio = () => import('@components/search/radio');
const SearchMv = () => import('@components/search/mv');
const SearchVideo = () => import('@components/search/video');
const SearchUser = () => import('@components/search/user');
const SearchSonglist = () => import('@components/search/songlist');
const SearchSinger = () => import('@components/search/singer');

const Video = () => import('@components/video');

const Mv = () => import('@components/mv');

const Album = () => import('@components/album');

const PersonalRecommend = () => import('@components/personal-recommend');

const MyPage = () => import('@components/my-page');

import { RouteLocation, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [

  {
    path: "/",
    redirect: "/musichall",
    component: Home,
    props: {},
    beforeEnter() { },
    meta: {},
    children: [
      {
        path: "musichall",
        redirect: "/musichall/featrued",
        component: MusicHall,
        children: [
          {
            path: "featrued",
            component: MusicHallFeatured,
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
            path: "newestdisc",
            component: MusicHallNewdisc,
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
        redirect: "/onlinevideo/all",
        component: OnlineVideo,
        children: [
          {
            path: 'all',
            component: VideoAll,
          },
          {
            path: 'category',
            component: VideoCategory,
          },
        ]
      },

      {
        path: "setting",
        redirect: '/setting/general',
        component: Setting,
        children: [
          {
            path: 'general',
            component: SettingGeneral,
          }
        ]
      },

      {
        path: 'personalRecommend',
        component: PersonalRecommend,
      },

      {
        path: "artist",
        redirect: "/artist/featured",
        component: Artist,
        children: [
          {
            path: "featured",
            component: ArtistFeatured,
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
            component: ArtistMv,
          },

          {
            path: "similarSinger",
            component: ArtistSimiSinger,
          },

          {
            path: "description",
            component: ArtistDesc,
          },
        ],
      },

      {
        path: "songlist/:id",
        name: 'songlist',
        redirect: (to: RouteLocation) => {
          return {
            path: 'songlist/:id/music',
            name: 'songlistMusic',
            params: {
              id: to.params.id
            }
          }
        },
        component: Songlist,
        children: [
          {
            path: "music",
            name: 'songlistMusic',
            component: SonglistMusic,
          },

          {
            path: "comments",
            name: 'songlistComments',
            component: SonglistComment,
          },

          {
            path: "subscribers",
            name: 'songlistSubscribers',
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
            path: "mv",
            component: SearchMv,
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

      {
        path: 'mv',
        component: Mv
      },

      {
        path: 'video',
        component: Video
      },

      {
        path: 'album',
        component: Album
      },

      {
        path: "/myPage",
        component: MyPage,
      },

    ],
  }
];

export default routes;
