import { BaseModel } from './BaseModel';

export class RatingModel extends BaseModel {
  _id = '';
  rating = 0;
  user = '';
  story = '';

  constructor(metadata, options) {
    super(metadata, options);
    this.assignToSelf(metadata);
  }
}
