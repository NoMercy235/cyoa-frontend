import { openDB } from 'idb';
import { SequenceModel } from '../infrastructure/models/SequenceModel';
import { OptionModel } from '../infrastructure/models/OptionModel';

export const DB_NAME = 'cyoa';
export const DB_VERSION = 1;
export const StoresEnum = {
  Stories: 'stories',
};

const ensureTablesExist = db => {
  const currentObjectStores = Object.values(db.objectStoreNames);
  const currentStores = Object.values(StoresEnum);

  // Add if they don't exist
  currentStores
    .filter(storeName => !currentObjectStores.includes(storeName))
    .map(storeName => {
      db.createObjectStore(storeName, {
        autoIncrement: true,
      });
    });

  // Remove if they shouldn't exist
  currentObjectStores
    .filter(storeName => !currentStores.includes(storeName))
    .forEach(storeName => {
      db.deleteObjectStore(storeName);
    });
};

export const configureIdb = async () => {
  await openDB(DB_NAME, DB_VERSION, { upgrade: ensureTablesExist });
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

export const getSeqById = async (storyId, seqId, instanced = true) => {
  const db = await openIdb();
  const storyStore = await db.get(StoresEnum.Stories, storyId);
  let seq = storyStore.sequences.find(s => s._id === seqId);
  seq.options = storyStore.options.filter(o => o.sequence === seqId);
  if (instanced) {
    // The warning is an IDE bug
    seq = new SequenceModel(seq);
    seq.options = seq.options.map(o => new OptionModel(o));
  }
  return seq;
};
