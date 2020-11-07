import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';

export class AttributeModel extends BaseModel {
  _id = '';
  name = '';
  isImportant = false;
  description = '';
  startValue = 0;
  linkedEnding = null;

  constructor(metadata, options) {
    super(metadata, options);
    this.assignToSelf(metadata);
  }

  checkErrors() {
    let errors = {};
    if (!this.name) {
      errors.name = ERRORS.fieldRequired;
    }
    if (this.startValue !== 0 && !this.startValue) {
      errors.startValue = ERRORS.fieldRequired;
    }
    if (this.isImportant && !this.linkedEnding) {
      errors.linkedEnding = ERRORS.fieldRequired;
    }
    return errors;
  }

  static forApi(attribute) {
    return {
      name: attribute.name,
      isImportant: attribute.isImportant,
      description: attribute.description,
      startValue: attribute.startValue,
      linkedEnding: attribute.linkedEnding && attribute.linkedEnding.value
        ? attribute.linkedEnding.value
        : attribute.linkedEnding,
    };
  }

  static getTableColumns() {
    return [
      { name: 'Name' },
      { name: 'Start Value', options: { filter: false} },
      { name: 'Important?', options: { filter: false} },
      {
        name: '',
        options: { filter: false, sort: false },
      },
    ];
  }
}
