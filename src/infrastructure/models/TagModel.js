import { BaseModel } from './BaseModel';

export class TagModel extends BaseModel {
  static tags;
  name;

  constructor (metadata) {
    super();
    Object.assign(this, metadata);
  }

  static get() {
    return TagModel.tags;
  }

  static set(tags) {
    TagModel.tags = tags;
  }
}
