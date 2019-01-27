import { BaseModel } from '../../../../shared/domain/models/BaseModel';

export class OptionModel extends BaseModel {
  _id = '';
  action = '';
  sequence = '';
  nextSeq = '';
  consequence = [];

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.action) {
      errors.action = 'This field is required';
    }
    return errors;
  }

  static forApi(option) {
    return {
      action: option.action,
      sequence: option.sequence,
      nextSeq: option.nextSeq,
      consequence: option.consequence,
    };
  }

  static getTableColumns() {
    return [
      { name: 'Action' },
      { name: 'Leads to' },
      { name: 'Consequence' },
    ];
  }
}
