export declare type SongChargeInfo = {
  rate: 128000 | 192000 | 32000 | 999000 | number;
  chargeUrl: string | null;
};

export declare type PlayRecord = {
  playCount: number;
  score: number;
  song: SongInfo;
}[];

export declare type SongInfo = {
  //歌曲名字
  name: string;
  //歌曲别名，如xxx游戏宣传曲
  alia: string[];
  //歌曲id
  id: number;
  //单曲时长，单位：毫秒
  dt: number;
  //歌手信息
  ar: {
    id: number;
    name: string;
    alias: string[];
  }[];
  //专辑
  al: {
    id: number;
    name: string;
    picUrl: string;
  };
  //发行时间
  publishTime: number;
  //评论数量
  mark: number;
  privilege: {
    chargeInfoList: SongChargeInfo[];
  };
};

export declare type SongUrlInfo = {
  type: 'mp3' | 'm4a';
  encodeType: 'mp3',
  canExtend: boolean;
  fee: 8 | number;
  url: string;
  size: number;
  id: number;
  md5: string;
  gain: 0 | number;
  level: 'standard' | string;
  played: 0 | 1;
  //免费试听时间段，单位：秒
  freeTrialInfo: {
    start: number;
    end: number;
  } | null;
}