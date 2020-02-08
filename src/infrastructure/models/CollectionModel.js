import { BaseModel } from './BaseModel';
import * as moment from 'moment';
import { ERRORS } from '../../shared/constants/errors';

export class CollectionModel extends BaseModel {
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
      errors.name = ERRORS.fieldRequired;
    }
    if (!this.description) {
      errors.description = ERRORS.fieldRequired;
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
