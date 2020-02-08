import * as moment from 'moment';

import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';
import { openIdb, StoresEnum } from '../../shared/idb';
import { publicStoryService } from '../services/StoryService';
import { convertNumberToHuman } from '../../shared/utilities';

export class StoryModel extends BaseModel {
  name = '';
  shortDescription = '';
  longDescription = '';
  tags = [];
  tagsName = [];
  author = '';
  authorShort = '';
  startSeq = '';
  created_at = '';
  fromCollection = '';
  published = false;
  coverPic = '';
  isAvailableOffline = false;
  readTimes = 0;
  rating = 0;

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
    if (this.created_at) {
      this.created_at = moment(this.created_at);
    }
  }

  get createdAt() {
    if (!this.created_at) return '';
    return this.created_at.format('DD-MM-YYYY HH:mm');
  }

  get createdAtShort() {
    if (!this.created_at) return '';
    return this.created_at.format('DD-MM-YYYY');
  }

  get humanReadTimes() {
    return convertNumberToHuman(this.readTimes);
  }

  isOffline = async () => {
    if (!this.isAvailableOffline) return false;
    const db = await openIdb();
    return !!(await db.get(StoresEnum.Stories, this.id));
  };

  checkErrors() {
    let errors = {};
    if (!this.name) {
      errors.name = ERRORS.fieldRequired;
    }
    if (!this.shortDescription) {
      errors.shortDescription = ERRORS.fieldRequired;
    }
    if (!this.tags || !this.tags.length) {
      errors.tags = ERRORS.fieldRequired;
    }
    return errors;
  }

  // These are made as properties and not static functions because of a bug (I think)
  // that calls them at compile time. Doing so would crash the app since the function's
  // argument is undefined.
  saveOffline = async () => {
    const offlineStory = await publicStoryService.getOfflineStory(this.id);
    const db = await openIdb();
    offlineStory.updated = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
    await db.put(StoresEnum.Stories, offlineStory, offlineStory.story.id);
  };

  removeOffline = async () => {
    const db = await openIdb();
    await db.delete(StoresEnum.Stories, this.id);
  };

  static forApi(story) {
    const result = {
      name: story.name,
      shortDescription: story.shortDescription,
      longDescription: story.longDescription,
      tags: story.tags,
      tagsName: story.tagsName,
      startSeq: story.startSeq,
      fromCollection: story.fromCollection,
      coverPic: story.coverPic,
      isAvailableOffline: story.isAvailableOffline,
    };

    if (!result.coverPic) delete result.coverPic;

    return result;
  }

  static getTableColumns() {
    return [
      { name: 'Name' },
      {
        name: 'Tags',
        options: { filter: false, sort: false },
      },
      {
        name: 'Offline',
        options: { filter: false, sort: false },
      },
      {
        name: 'Published',
        options: { filter: false, sort: false },
      },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
