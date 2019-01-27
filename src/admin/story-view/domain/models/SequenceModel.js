import { BaseModel } from '../../../../shared/domain/models/BaseModel';

export class SequenceModel extends BaseModel {
  _id = '';
  name = '';
  content = '';
  isEnding = false;
  options = [];

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.name) {
      errors.name = 'This field is required';
    }
    if (!this.content) {
      errors.content = 'This field is required';
    }
    return errors;
  }

  static forApi(attribute) {
    return {
      name: attribute.name,
      content: attribute.content,
      isEnding: attribute.isEnding,
    };
  }

  static getTableColumns() {
    return [
      { name: 'Id', options: { display: 'excluded' } },
      { name: 'Name' },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
