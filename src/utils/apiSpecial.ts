import { SongInfo } from "@/types/song";
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
 * 获取修正后的songInfo
 * @param songInfo 从api接口中返回的songInfo
 * @returns
 */
export interface RealSongInfo extends SongInfo {
  musicName: string; //完整的音乐名称（本名 + 别名）
  localedMark: string; //评论数（本地化版）
  localedDuration: string; //时长（本地化版）
  localedPublishTime?: string; //发布时间（本地化版）
  singers: Pick<SongInfo["ar"][number], "id" | "name">[]; //音乐的作者（歌手）信息
}
export const getModifiedSongInfo = (songInfo: SongInfo): RealSongInfo => {
  const { ar, name, alia, dt, publishTime, mark } = songInfo;
  const musicName = getFullName({ name, alias: alia });
  const singers = ar.map(({ id, name, alias }) => ({
    id,
    name: getFullName({ name, alias }),
  }));
  const localedMark = getLocaleCount(mark);
  const localedDuration = second2TimeStr(dt / 1000);
  const localedPublishTime =
    publishTime != null
      ? getLocaleDate(publishTime, {
          delimiter: "-",
          divide: "day",
        })
      : "未知";
  return {
    ...songInfo,
    singers,
    musicName,
    localedMark,
    localedDuration,
    localedPublishTime,
  };
};
