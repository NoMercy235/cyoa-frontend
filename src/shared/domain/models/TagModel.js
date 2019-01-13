import { BaseModel } from './BaseModel';

export class TagModel extends BaseModel {
  _id;
  name;

  constructor (metadata) {
    super();
    Object.assign(this, metadata);
  }
}
