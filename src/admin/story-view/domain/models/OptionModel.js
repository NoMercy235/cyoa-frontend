import { BaseModel } from '../../../../shared/domain/models/BaseModel';

export class OptionModel extends BaseModel {
  _id = '';
  action = '';
  sequence = '';
  nextSeq = '';
  consequences = [];

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors() {
    let errors = {};

    if (!this.action) {
      errors.action = 'This field is required';
    }

    if (!this.nextSeq) {
      errors.nextSeq = 'This field is required';
    }

    errors.consequences = new Array(this.consequences.length);
    this.consequences.forEach((c, i) => {
      errors.consequences[i] = c.checkErrors();
      if (!Object.keys(errors.consequences[i])) {
        delete errors.consequences[i];
      }
    });
    errors = errors.consequences.filter(e => e && e.length);

    if (!errors.consequences.length) {
      delete errors.consequences;
    }

    return errors;
  }

  static forApi(option) {
    return {
      action: option.action,
      sequence: option.sequence,
      nextSeq: option.nextSeq,
      consequences: option.consequences,
    };
  }

  static getTableColumns() {
    return [
      { name: 'Action' },
      { name: 'Leads to' },
      { name: 'Consequence' },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
