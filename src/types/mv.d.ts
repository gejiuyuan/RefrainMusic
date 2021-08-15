export declare type Mv = {
  artistName: string;
  id: number;
  duration: number;
  imgurl: string;
  imgurl16v9: string;
  name: string;
  publishTime: string;
  status: number;
  subed: boolean;
  playCount: number;
  artist: any;

  //额外的
  playCountStr?: string;
};

export declare type SearchMv = {
  alias: null | any;
  artistId: number;
  artistName: string;
  artists: any[];
  desc: string | null;
  briefDesc: string | null;
  cover: string;
  duration: number;
  id: number;
  mark: number;
  name: number;
  playCount: number;
  playCountStr: string;
  transNames: string[] | null
}