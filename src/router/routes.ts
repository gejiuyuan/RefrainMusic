import Home from "@views/home";
import MusicHall from "@components/music-hall";
import MusicHallFeatured from "@components/music-hall/featured";
import MusicHallTop from "@components/music-hall/top";
import MusicHallNewest from "@components/music-hall/newestmusic";
import MusicHallSonglist from "@components/music-hall/songlist";
import MusicHallArtist from "@components/music-hall/artist";
import MusicHallNewdisc from "@/components/music-hall/newestdisc";

import MusicRadio from "@components/music-radio";

import OnlineVideo from "@components/online-video";
import VideoAll from "@components/online-video/all";
import VideoCategory from "@components/online-video/category";

import Setting from "@components/setting";

import Artist from "@components/artist";
import ArtistFeatured from "@components/artist/featured";
import ArtistAllSongs from "@components/artist/allSongs";
import ArtistAlbum from "@components/artist/album";
import artistMv from "@components/artist/mv";
import artistSimiSinger from "@components/artist/similarSinger";
import artistDesc from "@components/artist/description";

import Songlist from "@components/songlist";
import SonglistMusic from "@components/songlist/music";
import SonglistComment from "@components/songlist/comment";
import SonglistSubscriber from "@components/songlist/subscriber";

import User from "@components/user";
import UserPlayRecord from "@components/user/play-record";
import UserCollection from "@components/user/collection";
import UserSonglist from "@components/user/songlist";

import Search from "@components/search";
import SearchSongs from "@components/search/songs";
import SearchAlbum from "@components/search/album";
import SearchLyric from "@components/search/lyric";
import SearchRadio from "@components/search/radio";
import SearchMv from "@components/search/mv";
import SearchVideo from "@components/search/video";
import SearchUser from "@components/search/user";
import SearchSonglist from "@components/search/songlist";
import SearchSinger from "@components/search/singer";

import Video from "@components/video";

import Mv from '@components/mv';

import Album from "@components/album";

import PersonalRecommend from '@components/personal-recommend';

import MyPage from "@components/my-page";
import { RouteLocation, RouteRecordRaw } from "vue-router";

// const MusicHall = () => import("@components/music-hall");
// const MusicHallFeatured = () =>
//   import("@components/music-hall/featured");
// const MusicHallTop = () => import("@components/music-hall/top");
// const MusicHallNewest = () => import("@components/music-hall/newestmusic");
// const MusicHallSonglist = () => import("@components/music-hall/songlist");
// const MusicHallArtist = () => import("@components/music-hall/artist");

// const MusicRadio = () => import("@components/music-radio");
// const OnlineVideo = () => import("@components/online-video");
// const Setting = () => import("@components/setting");

// const Artist = () => import("@components/artist");
// const ArtistFeatured = () => import("@components/artist/featured");
// const ArtistAllSongs = () => import("@components/artist/allSongs");
// const ArtistAlbum = () => import("@components/artist/album");
// const artistMv = () => import("@components/artist/mv");
// const artistSimiSinger = () => import("@components/artist/similarSinger");
// const artistDesc = () => import("@components/artist/description");

// const Songlist = () => import("@components/songlist");
// const SonglistMusic = () => import("@components/songlist/music");
// const SonglistComment = () => import("@components/songlist/comment");
// const SonglistSubscriber = () => import("@components/songlist/subscriber");

// const User = () => import("@components/user");
// const UserPlayRecord = () => import("@components/user/play-record");
// const UserCollection = () => import("@components/user/collection");
// const UserSonglist = () => import("@components/user/songlist");

// const Search = () => import("@components/search");
// const SearchSongs = () => import("@components/search/songs");
// const SearchAlbum = () => import("@components/search/album");
// const SearchLyric = () => import("@components/search/lyric");
// const SearchRadio = () => import("@components/search/radio");
// const SearchVideo = () => import("@components/search/video");
// const SearchUser = () => import("@components/search/user");
// const SearchSonglist = () => import("@components/search/songlist");
// const SearchSinger = () => import("@components/search/singer");

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
        component: Setting,
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
