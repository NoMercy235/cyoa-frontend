import { BaseModel } from './BaseModel';

export class TagModel extends BaseModel {
  static tags;

  _id;
  name;

  constructor (metadata, options) {
    super(metadata, options);
    this.assignToSelf(metadata);
  }

  static get() {
    return TagModel.tags;
  }

  static set(tags) {
    TagModel.tags = tags;
  }
}
