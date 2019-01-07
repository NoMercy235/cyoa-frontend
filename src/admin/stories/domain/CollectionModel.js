import { BaseModel } from '../../../shared/domain/models/BaseModel';

export class CollectionModel extends BaseModel {
  _id;
  name;
  description;
  created_at;

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  static getTableColumns() {
    return [
      { label: 'Name', sortable: false },
    ];
  }
}
