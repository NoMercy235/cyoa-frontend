import { BaseModel } from './BaseModel';

export class PlayerModel extends BaseModel {
  _id = '';
  player = '';
  story = '';
  lastStorySequence = '';
  attributes = [];

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  static forApi(option) {
    return {
      lastStorySequence: option.lastStorySequence,
      attributes: option.attributes,
    };
  }
}
