//播放列表相关属性
export declare type Playlistkeys = "title" | "author" | "lrc" | "pic" | "url";

//歌曲信息
export declare type SongInfo = Record<Playlistkeys, string>;

//播放列表
export declare type Playlist = {
  isShow: boolean;
  list: SongInfo[];
  history: SongInfo[];
  length: number;
};

//歌曲海报
export declare type Playbill = {
  src: string;
  size: number[];
};

//播放顺序
export declare type OrderKeys = "order" | "singalLoop" | "random" | "loop";

//vuex的palyer模块的State状态数据
export declare type PlayerState = {
  title: string;
  volume: number;
  paused: boolean;
  loop: boolean;
  willPlayTime: number;
  currentTime: number;
  currentIndex: number;
  currentDuration: number;
  canUpdateTime: boolean;
  playOrder: OrderKeys;
  playlist: Playlist;
  lyric: LyricType;
  playbill: Playbill;
};

declare const _playerDefault: {
  PlayerState: typeof PlayerState;
};

export default _playerDefault;
