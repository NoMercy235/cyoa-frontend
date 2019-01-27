import { BaseModel } from '../../../../shared/domain/models/BaseModel';
import * as moment from 'moment';

export class CollectionModel extends BaseModel {
  _id = '';
  name = '';
  description = '';
  created_at = '';

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
    if (!this.description) {
      errors.description = 'This field is required';
    }
    return errors;
  }

  static forApi(collection) {
    return {
      name: collection.name,
      description: collection.description,
    };
  }

  static getTableColumns() {
    return [
      { name: 'Name' },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
