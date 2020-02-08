import { BaseModel } from './BaseModel';
import * as moment from 'moment';
import { ERRORS } from '../../shared/constants/errors';

export class ChapterModel extends BaseModel {
  _id = '';
  name = '';
  description = '';
  created_at = '';
  parentChapter = '';
  subChapters = [];

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

  checkErrors() {
    let errors = {};
    if (!this.name) {
      errors.name = ERRORS.fieldRequired;
    }
    return errors;
  }

  static forApi(chapter, extra = []) {
    let result = {
      name: chapter.name,
      description: chapter.description,
      parentChapter: chapter.parentChapter,
    };

    extra.forEach(key => {
      result[key] = chapter[key];
    });

    return result;
  }
}
