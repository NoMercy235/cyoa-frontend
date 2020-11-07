import { BaseModel } from './BaseModel';

export class PlayerModel extends BaseModel {
  _id = '';
  player = '';
  story = '';
  lastStorySequence = '';
  attributes = [];

  constructor(metadata, options) {
    super(metadata, options);
    this.assignToSelf(metadata);
  }

  static forApi(option) {
    return {
      lastStorySequence: option.lastStorySequence,
      attributes: option.attributes,
    };
  }
}
