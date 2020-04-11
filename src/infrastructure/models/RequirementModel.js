import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';

export class RequirementModel extends BaseModel {
  attribute = '';
  value = 0;

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.attribute) {
      errors.attribute = ERRORS.fieldRequired;
    }
    if (this.value !== 0 && !this.value) {
      errors.value = ERRORS.fieldRequired;
    }
    return errors;
  }

  static forApi(requirement) {
    return {
      attribute: requirement.attribute,
      value: requirement.value,
    };
  }
}
