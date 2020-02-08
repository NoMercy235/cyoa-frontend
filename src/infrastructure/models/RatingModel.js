import { BaseModel } from './BaseModel';

export class RatingModel extends BaseModel {
  rating = 0;
  user = '';
  story = '';

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }
}
