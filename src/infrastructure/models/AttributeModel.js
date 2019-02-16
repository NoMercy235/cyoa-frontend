import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';

export class AttributeModel extends BaseModel {
  _id = '';
  name = '';
  isImportant = false;
  description = '';
  startValue = 0;

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.name) {
      errors.name = ERRORS.fieldRequired;
    }
    if (this.startValue !== 0 && !this.startValue) {
      errors.startValue = ERRORS.fieldRequired;
    }
    return errors;
  }

  static forApi(attribute) {
    return {
      name: attribute.name,
      isImportant: attribute.isImportant,
      description: attribute.description,
      startValue: attribute.startValue,
    };
  }

  static getTableColumns() {
    return [
      { name: 'Name' },
      { name: 'Start Value', options: { filter: false} },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
