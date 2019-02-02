import { BaseModel } from '../../../../shared/domain/models/BaseModel';

export class ConsequenceModel extends BaseModel {
  attribute = '';
  changeValue = 0;

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.attribute) {
      errors.attribute = 'This field is required';
    }
    if (this.changeValue !== 0 && !this.changeValue) {
      errors.changeValue = 'This field is required';
    }
    return errors;
  }

  static forApi(consequence) {
    return {
      attribute: consequence.attribute,
      changeValue: consequence.changeValue,
    };
  }
}
