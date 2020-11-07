import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';
import { Utils } from '@nomercy235/utils';
import { ConsequenceModel } from './ConsequenceModel';
import { RequirementModel } from './RequirementModel';

const checkErrorsForExtra = (errors, extra, propName) => {
  const errorsArray = extra
    .map((extra, index) => {
      return {
        index,
        ...extra.checkErrors(),
      };
    })
    .filter(errorObj => Object.keys(errorObj).length > 1);
  if (errorsArray.length) {
    errors[propName] = errorsArray;
  }
};

export class OptionModel extends BaseModel {
  _id = '';
  story = '';
  action = '';
  sequence = '';
  nextSeq = '';
  consequences = [];
  requirements = [];

  constructor(metadata, options) {
    super(metadata, options);
    this.assignToSelf(metadata);
    if (Utils.safeAccess(this.consequences, 'length')) {
      this.consequences = this.consequences.map(c => new ConsequenceModel(c));
    }
    if (Utils.safeAccess(this.requirements, 'length')) {
      this.requirements = this.requirements.map(r => new RequirementModel(r));
    }
  }

  checkErrors(ignoreFields = []) {
    let errors = {};

    if (!this.action) {
      errors.action = ERRORS.fieldRequired;
    }

    if (!ignoreFields.includes('nextSeq') && !this.nextSeq) {
      errors.nextSeq = ERRORS.fieldRequired;
    }

    checkErrorsForExtra(errors, this.consequences, 'consequences');
    checkErrorsForExtra(errors, this.requirements, 'requirements');
    return errors;
  }

  static forApi(option, extraFields) {
    return {
      story: option.story,
      action: option.action,
      sequence: option.sequence.value
        ? option.sequence.value
        : option.sequence,
      nextSeq: option.nextSeq.value
        ? option.nextSeq.value
        : option.nextSeq,
      consequences: option.consequences,
      requirements: option.requirements,
      ...BaseModel.handleExtraFieldsForApi(option, extraFields),
    };
  }

  static getTableColumns() {
    return [
      { name: 'Action' },
      { name: 'Leads to' },
      { name: 'Consequence' },
      { name: 'Requirement' },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
