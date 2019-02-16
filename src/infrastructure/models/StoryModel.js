import { BaseModel } from './BaseModel';
import * as moment from 'moment';
import { ERRORS } from '../../shared/constants/errors';

export class StoryModel extends BaseModel {
  _id = '';
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
  publish = false;
  coverPic = '';

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

  static forApi(story) {
    return {
      name: story.name,
      shortDescription: story.shortDescription,
      longDescription: story.longDescription,
      tags: story.tags,
      tagsName: story.tagsName,
      startSeq: story.startSeq,
      fromCollection: story.fromCollection,
      coverPic: story.coverPic,
    };
  }

  static getTableColumns() {
    return [
      { name: 'Name' },
      {
        name: 'Tags',
        options: { filter: false, sort: false },
      },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
