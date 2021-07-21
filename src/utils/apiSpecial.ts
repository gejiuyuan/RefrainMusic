import { realSongInfo } from "@/widgets/song-table";

export const getFullName = ({
  name,
  alias,
}: {
  name: string;
  alias?: string[];
}) => {
  return `${name}${alias?.length ? `(${alias.join("、")})` : ""}`;
};

export const getFullNames = (
  args: InferFuncOneParamType<typeof getFullName>[]
) => {
  return args.map(getFullName).join("、");
};

/**
 * 获取修正后的currentSongInfo
 * @param currentSongInfo 从api接口中返回的currentSongInfo
 * @returns
 */
export const getModifiedCurrentSongInfo = (currentSongInfo: realSongInfo) => {
  const { id, ar, name, alia: alias, al } = currentSongInfo;
  return {
    id,
    ar,
    name,
    alia: alias,
    al,
    //根据name（歌曲名）和ar（歌唱者）补全的属性：musicName、singer
    musicName: getFullName({ name, alias }),
    singer: ar.map(({ id, name, alias }) => {
      return {
        id,
        name: getFullName({ name, alias }),
      };
    }),
  };
};
