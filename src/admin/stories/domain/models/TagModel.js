import { BaseModel } from '../../../../shared/domain/models/BaseModel';

export class TagModel extends BaseModel {
  _id;
  name;
  label;

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }
}
