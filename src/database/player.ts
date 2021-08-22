import Dexie from "dexie";
import { DbTable } from './database';
import { CurrentSongInfo } from '@utils/apiSpecial';
import { EMPTY_ARR, EMPTY_OBJ, is, override } from "@/utils";
import { toRaw } from "vue";

export enum PlayerDBTables {
  playerQueue = 'playerQueue',
}

const songInfos = "&id,albumName,duration,localedDuration,localedMark,mark,musicName,publishTime,starred,name,*alias,*singers,*artists,album.name";
class PlayerDatabase extends Dexie {

  public playQueue!: DbTable<CurrentSongInfo, number>;

  public currentSong!: DbTable<CurrentSongInfo, number>;

  constructor() {
    super('PlayerDatabase');
    this.version(1).stores({
      playQueue: `++index,${songInfos}`,
      currentSong: `,${songInfos}`,
    })
    this.playQueue.mapToClass(PlayerQueueMaster);
  }

}

export class PlayerQueueMaster {


}

export const playerDB = new PlayerDatabase();
playerDB.open();

export async function getOrPutPlayQueue(): Promise<CurrentSongInfo[]>;
export async function getOrPutPlayQueue(song: CurrentSongInfo): Promise<number>;
export async function getOrPutPlayQueue(song: CurrentSongInfo[]): Promise<number[]>;
export async function getOrPutPlayQueue(song?: CurrentSongInfo | CurrentSongInfo[]) {
  let method = '';
  if (is.undefined(song)) {
    method = 'toArray';
  }
  else if (is.array(song)) {
    method = 'bulkPut';
  }
  else {
    method = 'put';
  }
  return await playerDB.playQueue[method](toRaw(song));
}

export async function getOrPutCurrentSong(): Promise<CurrentSongInfo>;
export async function getOrPutCurrentSong(song: CurrentSongInfo): Promise<number>;
export async function getOrPutCurrentSong(song?: CurrentSongInfo) {
  const uniqueCurrentSong = (await playerDB.currentSong.toArray())[0];
  if (is.undefined(song)) {
    return uniqueCurrentSong;
  }
  if (uniqueCurrentSong) {
    return await playerDB.currentSong.toCollection().modify(toRaw(song));
  } else {
    return await playerDB.currentSong.put(toRaw(song));
  }
}
