import Dexie from "dexie";

const playerDB = new Dexie('playerDB')
playerDB.version(1).stores({

})