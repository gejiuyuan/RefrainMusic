/**
 * 一些组件名称
 */
export enum COMPONENT_NAME {

  ARTIST_ALLSONGS = 'ArtistAllSongs',
  ARTIST_ALBUM = 'ArtistAlbum',
  ARTIST_MV = 'ArtistMv',

  MUSICHALL_SONGLIST = 'MusichallSonglist',
  MUSICHALL_ARTIST = 'MusichallArtist',

  SEARCH_VIDEO = 'SearchVideo',
  SEARCH_MV = 'SearchMV',
  SEARCH_LYRIC = 'SearchLyric',
  SEARCH_SONGLIST = 'SearchSonglist',
  SEARCH_ALBUM = 'SearchAlbum',

  USER_SONGLIST = 'UserSonglist',
  USER_COLLECTION = 'UserCollection',

  SONGLIST_SUBSCRIBER = 'SonglistSubscriber',

}

/**
 * 个人偏好（设置）的属性
 */
export enum PreferenceNames {
  theme = 'theme',
  order = 'order',
  playerQueueShow = 'playerQueueShow',
  playing = 'playing',
  currentTime = 'currentTime',
  rate = 'rate',
  volume = 'volume',
  mute = 'mute',
}

/**
 * 各个组件列表的分页器基础数量配置
 */
export const PAGE_SIZE = {

  /**
   * 默认
   */
  DEFAULT: 30,

  /**
   * 歌手详情-全部歌曲
   */
  [COMPONENT_NAME.ARTIST_ALLSONGS]: 30,

  /**
   * 歌手详情-专辑
   */
  [COMPONENT_NAME.ARTIST_ALBUM]: 28,

  /**
   * 歌手详情-MV
   */
  [COMPONENT_NAME.ARTIST_MV]: 25,

  /**
   * 音乐馆-歌单
   */
  [COMPONENT_NAME.MUSICHALL_SONGLIST]: 56,

  /**
   * 音乐馆-歌手
   */
  [COMPONENT_NAME.MUSICHALL_ARTIST]: 50,

  /**
   * 搜索-视频
   */
  [COMPONENT_NAME.SEARCH_VIDEO]: 50,

  /**
   * 搜索-MV
   */
  [COMPONENT_NAME.SEARCH_MV]: 40,

  /**
   * 搜索-歌词
   */
  [COMPONENT_NAME.SEARCH_LYRIC]: 30,

  /**
   * 搜索-歌单
   */
  [COMPONENT_NAME.SEARCH_SONGLIST]: 40,

  /**
   * 搜索-专辑
   */
  [COMPONENT_NAME.SEARCH_ALBUM]: 35,

  /**
   * 歌单-订阅者
   */
  [COMPONENT_NAME.SONGLIST_SUBSCRIBER]: 40,

  /**
   * 用户-歌单
   */
  [COMPONENT_NAME.USER_SONGLIST]: 30,

  /**
   * 用户-收藏
   */
  [COMPONENT_NAME.USER_COLLECTION]: 30,

}