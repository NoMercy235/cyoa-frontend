import { openDB } from 'idb';

export const DB_NAME = 'cyoa';
export const DB_VERSION = 1;
export const StoresEnum = {
  Stories: 'stories',
};

export const configureIdb = async () => {
  await openDB(DB_NAME, 1, {
    upgrade (db) {
      db.createObjectStore(StoresEnum.Stories, {
        autoIncrement: true,
      });
    },
  });
};

let dbCaches = {};

export const openIdb = async (dbName = DB_NAME, version = DB_VERSION) => {
  if (dbCaches[dbName]) {
    return dbCaches[dbName];
  }
  dbCaches[dbName] = await openDB(dbName, version);
  return dbCaches[dbName];
};

export const getStoryStoreIdInIdb = async storyId => {
  const db = await openIdb();
  return await db.get(StoresEnum.Stories, storyId);
};

export const getSeqById = async (storyId, seqId) => {
  const db = await openIdb();
  const storyStore = await db.get(StoresEnum.Stories, storyId);
  const seq = storyStore.sequences.find(s => s._id === seqId);
  seq.options = storyStore.options.filter(o => o.sequence === seqId);
  return seq;
};
