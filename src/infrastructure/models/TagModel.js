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
    if (!TagModel.tags) {
      TagModel.tags = JSON.parse(localStorage.getItem('tags'))
        .map(t => new TagModel(t));
    }
    return TagModel.tags;
  }

  static getOne(id) {
    // Fix for older tags
    // TODO: remove this
    return TagModel.get().find(t => t._id === id) || id;
  }
}
