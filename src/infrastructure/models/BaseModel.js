import * as moment from 'moment';

export class BaseModel {
  created_at;
  updated_at;

  constructor (metadata = {}) {
    if (metadata.created_at) {
      metadata.created_at = moment(metadata.created_at);
    }
    if (metadata.updated_at) {
      metadata.updated_at = moment(metadata.updated_at);
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

  get updatedAt() {
    if (!this.updated_at) return '';
    return this.updated_at.format('DD-MM-YYYY HH:mm');
  }

  get updatedAtShort() {
    if (!this.updated_at) return '';
    return this.updated_at.format('DD-MM-YYYY');
  }

  static handleError(e) {
    // Error set by the server
    if (e.message) return e.message;

    return 'An error has occurred';
  }

  static handleExtraFieldsForApi (resource, extraFields = []) {
    return (extraFields.reduce((curr, field) => {
      curr[field] = resource[field];
      return curr;
    }, {}))
  }
}
