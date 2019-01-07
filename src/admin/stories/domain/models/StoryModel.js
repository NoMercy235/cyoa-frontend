import { BaseModel } from '../../../../shared/domain/models/BaseModel';

export class StoryModel extends BaseModel {
  _id;
  name;
  description;
  tags;
  author;
  startSeq;
  created_at;

  constructor(metadata) {
    super();
    Object.assign(this, metadata);
  }

  static getTableColumns() {
    return [
      { label: 'Name', sortable: false },
      { label: 'Tags', sortable: false },
      { label: 'Created on', sortable: false },
    ];
  }
}
