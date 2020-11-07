import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';

export class ConsequenceModel extends BaseModel {
  attribute = '';
  changeValue = 0;

  constructor(metadata, options) {
    super(metadata, options);
    this.assignToSelf(metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.attribute) {
      errors.attribute = ERRORS.fieldRequired;
    }
    if (!this.changeValue) {
      errors.changeValue = ERRORS.fieldRequired;
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
