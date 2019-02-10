import { BaseModel } from '../../shared/domain/models/BaseModel';

export class AttributeModel extends BaseModel {
  _id = '';
  name = '';
  description = '';
  startValue = 0;

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.name) {
      errors.name = 'This field is required';
    }
    if (this.startValue !== 0 && !this.startValue) {
      errors.startValue = 'This field is required';
    }
    return errors;
  }

  static forApi(attribute) {
    return {
      name: attribute.name,
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
