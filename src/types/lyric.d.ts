export type SearchLyricItem = {
  //专辑
  al: {
    id: number;
    name: number;
    picUrl: string;
    tns: any[];
  };
  //别名
  alia: string[];
  //作者
  ar: {
    id: number;
    alia: string[];
    name: string;
    tns: any[];
  }[];
  cd: string;
  copyright: number;
  //歌曲时长
  dt: number;
  fee: number;
  id: number;
  mark: number;
  lyrics: string[];
  name: string;
  mv: number;
  pop: number;
  publishTime: number;
  single: number;
  v: number;
};
