import Dexie, { IndexableType } from "dexie";

export declare interface DbTable<T = any, K = IndexableType> extends Dexie.Table<T, K>, PlainObject { }