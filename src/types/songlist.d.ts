//歌单分类子类
export declare type CatListSub = {
  category: number;
  imgId: number;
  imgUrl: any;
  name: string;
  type: number;
  hot: boolean;
  activity: boolean;
  resourceType: number;
  resourceCount: number;
};

export declare type SubscriberList = {
  more: boolean;
  reason: "needLogin" | string;
  subscribers: Subscriber[];
  total: number;
};

//歌单订阅者
export declare type Subscriber = {
  avatarUrl: string;
  birthday: number;
  description: string;
  defaultAvatar: string;
  detailDescription: string;
  followed: boolean;
  nickname: string;
  province: number;
  remarkName: string;
  signature: string;
  userId: number;
  vipType: number;
  userType: number;
  mutual: boolean;
  city: number;
  backgroundUrl: string;
};

//音频id数据
export declare type TrackId = Record<"at" | "id" | "lr" | "t" | "v", number>;

//音频轨道数据
export declare type Track = {
  //album
  al: {
    id: number;
    name: string;
    picUrl: string;
    tns: any[];
  };
  alias: string[];
  //artist
  ar: {
    alias: string[];
    id: number;
    name: string;
  }[];
  mark: number;
  mv: number;
  name: string;
  publishTime: number;
};

//排行榜列表
export declare type Playlist = {
  name: string;
  id: number;
  ToplistType: string;
  adType: number;
  coverImgUrl: string;
  description: string;
  ordered: boolean;
  subscribed: boolean;
  subscribers: Subscriber[];
  tags: string[];
  tracks: Track[];
  trackCount: number;
  trackIds: TrackId[];
  trackNumberUpdateTime: number;
  trackUpdateTime: number;
  updateFrequency: null | any;
  userId: number;
  videos: null | any;
  videoIds: null | any;
  createTime: number;
  updateTime: number;
  shareCount: number;
  playCount: number;
  subscribedCount: number;

  //额外
  createTimeStr: string;
  updateTimeStr: string;
  playCountStr: string;
  subscribedCountStr: string;
  shareCountStr: string;
};

//排行榜
export declare type Toplist = {
  playlist: Playlist;
  privileges?: any[];
  relatedVideos?: null | any;
  urls?: null | any;
};

//歌单创建者
export declare type SongListCreator = {
  avatarUrl: string; //发布者头像
  backgroundUrl: string; //主页背景图片
  birthday: number;
  city: number;
  defaultAvatar: boolean | string;
  description: string;
  detailDescription: string;
  expertTags: string[];
  followed: boolean; //是否已关注
  mutual: boolean; //是否互相关注
  userId: number;
  nickname: string;
  vipType: number;
  userType: number;
  signature: string;
  remarkName: null | string;
  gender: number; //性别
  avatarDetail: {
    indentityIconUrl: string; //身份图标
    identity: number;
    userType: number;
  };
};

//歌单列表
export declare type PlaylistCommon = {
  coverImgUrl: number;
  createTime: number;
  description: string;
  id: number;
  userId: number;
  tags: string[];
  ordered: boolean;
  privacy: number;
  recommendInfo: null | any;
  subscribed: null | any;
  subscribers: Subscriber[];
  tracks: null | any;
  newImported: boolean;
  name: string;
  creator: SongListCreator;
  authenticationTypes: number; //身份认证

  trackNumberUpdateTime: number;
  trackUpdateTime: number;
  trackCount: number;
  subscribedCount: number;
  commentCount: number;
  shareCount: number;
  playCount: number;
};

export declare type PlaylistDynamic = {
  bookedCount: number;
  commentCount: number;
  followed: boolean;
  playCount: number;
  remarkName: null | any;
  shareCount: number;
  subscribed: boolean;

  //额外的
  commentCountStr: string;
  playCountStr: string;
};

//搜索数据中的歌单
export declare type SearchPlaylist = {
  //收藏量
  bookCount: number;
  //播放量
  playCount: number;
  //包含的歌曲数量
  trackCount: number;
  coverImgUrl: string;
  creator: {
    authStatus: 0;
    expertTags: null;
    experts: null;
    nickname: string;
    userId: number;
    userType: number;
  };
  description: null | string;
  highQuality: boolean;
  specialType: number;
  subscribed: boolean;
  id: number;
  userId: number;
  officialTags: null | any;
  name: string;
};
