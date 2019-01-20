import { BaseModel } from '../../../../shared/domain/models/BaseModel';
import * as moment from 'moment';

export class StoryModel extends BaseModel {
  _id = '';
  name = '';
  description = '';
  tags = [];
  author = '';
  startSeq = '';
  created_at = '';
  fromCollection = '';

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
      errors.name = 'This field is required';
    }
    if (!this.description) {
      errors.description = 'This field is required';
    }
    if (!this.tags || !this.tags.length) {
      errors.tags = 'This field is required';
    }
    return errors;
  }

  static forApi(story) {
    return {
      name: story.name,
      description: story.description,
      tags: story.tags,
      startSeq: story.startSeq,
      fromCollection: story.fromCollection,
    };
  }

  static getTableColumns() {
    return [
      { label: 'Name', sortable: false },
      { label: 'Tags', sortable: false },
      { label: 'Created on', sortable: false },
    ];
  }
}
