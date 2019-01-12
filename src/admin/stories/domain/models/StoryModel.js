import { BaseModel } from '../../../../shared/domain/models/BaseModel';
import * as moment from 'moment';

export class StoryModel extends BaseModel {
  _id;
  name;
  description;
  tags;
  author;
  startSeq;
  created_at;

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
      errors.name = 'This field is required';
    }
    return errors;
  }

  static getTableColumns() {
    return [
      { label: 'Name', sortable: false },
      { label: 'Tags', sortable: false },
      { label: 'Created on', sortable: false },
    ];
  }
}
