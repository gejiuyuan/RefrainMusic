import Home from "@views/home";
import MusicHall from "@components/home/music-hall";
import MusicHallFeatured from "@components/home/music-hall/featured";
import MusicHallTop from "@components/home/music-hall/top";
import MusicHallNewest from "@components/home/music-hall/newestmusic";
import MusicHallSonglist from "@components/home/music-hall/songlist";
import MusicHallArtist from "@components/home/music-hall/artist";
import MusicHallNewdisc from "@/components/home/music-hall/newestdisc";

import MusicRadio from "@components/home/music-radio";

import OnlineVideo from "@components/home/online-video";
import VideoAll from "@components/home/online-video/all";
import VideoCategory from "@components/home/online-video/category";

import Setting from "@components/home/setting";

import Artist from "@components/home/artist";
import ArtistFeatured from "@components/home/artist/featured";
import ArtistAllSongs from "@components/home/artist/allSongs";
import ArtistAlbum from "@components/home/artist/album";
import artistMv from "@components/home/artist/mv";
import artistSimiSinger from "@components/home/artist/similarSinger";
import artistDesc from "@components/home/artist/description";

import Songlist from "@components/home/songlist";
import SonglistMusic from "@components/home/songlist/music";
import SonglistComment from "@components/home/songlist/comment";
import SonglistSubscriber from "@components/home/songlist/subscriber";

import User from "@components/home/user";
import UserPlayRecord from "@components/home/user/play-record";
import UserCollection from "@components/home/user/collection";
import UserSonglist from "@components/home/user/songlist";

import Search from "@components/home/search";
import SearchSongs from "@components/home/search/songs";
import SearchAlbum from "@components/home/search/album";
import SearchLyric from "@components/home/search/lyric";
import SearchRadio from "@components/home/search/radio";
import SearchMv from "@components/home/search/mv";
import SearchVideo from "@components/home/search/video";
import SearchUser from "@components/home/search/user";
import SearchSonglist from "@components/home/search/songlist";
import SearchSinger from "@components/home/search/singer";

import Video from "@components/home/video";

import Mv from '@components/home/mv';

import Album from "@components/home/album";

import PersonalRecommend from '@components/home/personal-recommend';

import MyPage from "@components/home/my-page";
import { RouteLocation, RouteRecordRaw } from "vue-router";

// const MusicHall = () => import("@components/home/music-hall");
// const MusicHallFeatured = () =>
//   import("@components/home/music-hall/featured");
// const MusicHallTop = () => import("@components/home/music-hall/top");
// const MusicHallNewest = () => import("@components/home/music-hall/newestmusic");
// const MusicHallSonglist = () => import("@components/home/music-hall/songlist");
// const MusicHallArtist = () => import("@components/home/music-hall/artist");

// const MusicRadio = () => import("@components/home/music-radio");
// const OnlineVideo = () => import("@components/home/online-video");
// const Setting = () => import("@components/home/setting");

// const Artist = () => import("@components/home/artist");
// const ArtistFeatured = () => import("@components/home/artist/featured");
// const ArtistAllSongs = () => import("@components/home/artist/allSongs");
// const ArtistAlbum = () => import("@components/home/artist/album");
// const artistMv = () => import("@components/home/artist/mv");
// const artistSimiSinger = () => import("@components/home/artist/similarSinger");
// const artistDesc = () => import("@components/home/artist/description");

// const Songlist = () => import("@components/home/songlist");
// const SonglistMusic = () => import("@components/home/songlist/music");
// const SonglistComment = () => import("@components/home/songlist/comment");
// const SonglistSubscriber = () => import("@components/home/songlist/subscriber");

// const User = () => import("@components/home/user");
// const UserPlayRecord = () => import("@components/home/user/play-record");
// const UserCollection = () => import("@components/home/user/collection");
// const UserSonglist = () => import("@components/home/user/songlist");

// const Search = () => import("@components/home/search");
// const SearchSongs = () => import("@components/home/search/songs");
// const SearchAlbum = () => import("@components/home/search/album");
// const SearchLyric = () => import("@components/home/search/lyric");
// const SearchRadio = () => import("@components/home/search/radio");
// const SearchVideo = () => import("@components/home/search/video");
// const SearchUser = () => import("@components/home/search/user");
// const SearchSonglist = () => import("@components/home/search/songlist");
// const SearchSinger = () => import("@components/home/search/singer");

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
        redirect: "/onlinevideo/category",
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
