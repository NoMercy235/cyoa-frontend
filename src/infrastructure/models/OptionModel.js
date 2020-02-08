import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';
import { Utils } from '@nomercy235/utils';
import { ConsequenceModel } from './ConsequenceModel';

export class OptionModel extends BaseModel {
  action = '';
  sequence = '';
  nextSeq = '';
  consequences = [];

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
    if (Utils.safeAccess(this.consequences, 'length')) {
      this.consequences = this.consequences.map(c => new ConsequenceModel(c));
    }
  }

  checkErrors() {
    let errors = {};

    if (!this.action) {
      errors.action = ERRORS.fieldRequired;
    }

    if (!this.nextSeq) {
      errors.nextSeq = ERRORS.fieldRequired;
    }

    errors.consequences = new Array(this.consequences.length);
    this.consequences.forEach((c, i) => {
      errors.consequences[i] = {
        index: i,
        ...c.checkErrors(),
      };
    });
    errors.consequences = errors.consequences.filter(
      e => e && (Object.keys(e).length > 1)
    );

    if (!errors.consequences.length) {
      delete errors.consequences;
    }

    return errors;
  }

  static forApi(option) {
    return {
      story: option.story,
      action: option.action,
      sequence: option.sequence,
      nextSeq: option.nextSeq.value
        ? option.nextSeq.value
        : option.nextSeq,
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
