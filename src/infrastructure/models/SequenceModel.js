import { BaseModel } from './BaseModel';
import { observable } from 'mobx';
import { ERRORS } from '../../shared/constants/errors';

export class SequenceModel extends BaseModel {
  _id = '';
  story = '';
  chapter = '';
  name = '';
  scenePic = '';
  hasScenePic = false;
  content = '';
  isEnding = false;
  @observable options = [];

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.name) {
      errors.name = ERRORS.fieldRequired;
    }
    if (!this.content) {
      errors.content = ERRORS.fieldRequired;
    }
    return errors;
  }

  static forApi(sequence, extraFields = []) {
    return {
      name: sequence.name,
      scenePic: sequence.scenePic,
      content: sequence.content,
      isEnding: sequence.isEnding,
      chapter: sequence.chapter,
      ...(extraFields.reduce((curr, field) => {
        curr[field] = sequence[field];
        return curr;
      }, {})),
    };
  }

  static getTableColumns() {
    return [
      { name: 'Id', options: { display: 'excluded' } },
      { name: 'Name' },
      { name: 'Type' },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
