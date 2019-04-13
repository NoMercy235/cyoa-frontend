import { BaseModel } from './BaseModel';
import { observable } from 'mobx';
import { ERRORS } from '../../shared/constants/errors';

export class SequenceModel extends BaseModel {
  _id = '';
  chapter = '';
  authorNote = '';
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
    if (!this.authorNote) {
      errors.authorNote = ERRORS.fieldRequired;
    }
    if (!this.content) {
      errors.content = ERRORS.fieldRequired;
    }
    return errors;
  }

  static forApi(sequence) {
    return {
      authorNote: sequence.authorNote,
      scenePic: sequence.scenePic,
      content: sequence.content,
      isEnding: sequence.isEnding,
      chapter: sequence.chapter,
    };
  }

  static getTableColumns() {
    return [
      { name: 'Id', options: { display: 'excluded' } },
      { name: 'Author\'s note' },
      { name: 'Start' },
      { name: 'End' },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
