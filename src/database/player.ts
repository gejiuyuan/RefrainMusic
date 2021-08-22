import Dexie from "dexie";
import { DbTable } from './database';
import { CurrentSongInfo } from '@utils/apiSpecial';
import { EMPTY_ARR, EMPTY_OBJ, is } from "@/utils";

export enum PlayerDBTables {
  playerQueue = 'playerQueue',
}

class PlayerDatabase extends Dexie {

  public playQueue!: DbTable<CurrentSongInfo, number>;

  constructor() {
    super('PlayerDatabase');
    this.version(1).stores({
      playQueue: "++index,&id,albumName,duration,localedDuration,localedMark,mark,musicName,publishTime,starred,name,*alias,*singers,*artists,album.name",
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
  } else if (is.array(song)) {
    method = 'bulkPut';
  } else {
    method = 'put';
  }
  return await playerDB.playQueue[method](song);
}