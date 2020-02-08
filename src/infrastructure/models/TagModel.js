import { BaseModel } from './BaseModel';

export class TagModel extends BaseModel {
  static tags;

  _id;
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
