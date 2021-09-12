import usePlayerStore from "@/stores/player";
import { NewestSongInfo, SongInfo } from "@/types/song";
import { is } from "@utils/index";
import { getLocaleCount } from "./calc";
import { getLocaleDate, second2TimeStr } from "./time";

export const getFullName = ({
  name,
  alias,
}: {
  name: string;
  alias?: string[];
}) => {
  return `${name}${alias?.length ? `(${alias.join("、")})` : ""}`;
};

export const getFullNames = (args: FuncParamsType<typeof getFullName>[0][]) => {
  return args.map(getFullName).join("、");
};

/**
 * 获取歌曲附加的信息
 */
export type ExtraSongInfo = {
  artists: SongInfo["ar"];
  publishTime?: number;
  mark?: number;
  name: string;
  duration: number;
  alias: string[];
  album: {
    name: string;
    alias?: string[];
  };
};

export const getSongExtraInfo = (
  param: ExtraSongInfo
): {
  musicName: string; //完整的音乐名称（本名 + 别名）
  albumName: string; //完整的专辑名称（本名 + 别名）
  localedMark?: string; //评论数（本地化版）
  localedDuration: string; //时长（本地化版）
  localedPublishTime?: string; //发布时间（本地化版）
  singers: Pick<SongInfo["ar"][number], "id" | "name">[]; //音乐的作者（歌手）信息
} => {
  const { name, mark, alias, duration, publishTime, artists, album } = param;
  const musicName = getFullName({ name, alias });
  const albumName = getFullName(album);
  const localedMark = is.number(mark) ? getLocaleCount(mark) : void 0;
  const singers = artists.map(({ id, name, alias }) => ({
    id,
    name: getFullName({ name, alias }),
  }));
  const localedDuration = second2TimeStr(duration / 1000);
  const localedPublishTime =
    publishTime != null
      ? getLocaleDate(publishTime, {
        delimiter: "-",
        divide: "day",
      })
      : "未知";
  return {
    musicName,
    albumName,
    localedMark,
    singers,
    localedDuration,
    localedPublishTime,
  };
};

/**
 * 当前播放歌曲信息
 */
export type CurrentSongInfo =
  | ReturnType<typeof getModifiedSongInfo>
  | ReturnType<typeof getModifiedNewestSongInfo>;

/**
 * 获取修正后的songInfo
 * @param songInfo 从api接口中返回的songInfo
 * @returns
 */

export const getModifiedSongInfo = (songInfo: SongInfo) => {
  const {
    ar: artists,
    name,
    alia: alias,
    dt: duration,
    publishTime,
    mark,
    id,
    starred,
    al: album,
  } = songInfo;

  return {
    id,
    name,
    mark,
    alias,
    album,
    artists,
    starred,
    duration,
    publishTime,
    ...getSongExtraInfo({
      artists,
      alias,
      duration,
      publishTime,
      mark,
      name,
      album,
    }),
  };
};

/**
 * 获取修正后的NewestSongInfo
 * @param newestSongInfo 从api接口中返回的NewestSongInfo
 * @returns
 */
export const getModifiedNewestSongInfo = (newestSongInfo: NewestSongInfo) => {
  const {
    artists,
    name,
    alias,
    duration,
    id,
    fee,
    album,
    starredNum,
    starred,
    mvid,
    playedNum,
    popularity,
  } = newestSongInfo;
  const { publishTime } = album;
  return {
    id,
    fee,
    name,
    mvid,
    alias,
    album,
    artists,
    starred,
    starredNum,
    duration,
    publishTime,
    playedNum,
    popularity,
    ...getSongExtraInfo({ artists, name, alias, duration, publishTime, album }),
  };
};
