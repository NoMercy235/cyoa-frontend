import { BaseService } from './BaseService';
import { TagModel } from '../models/TagModel';

class TagsService extends BaseService {
  endpoint = 'tag';

  list = () => {
    return super.list().then(tags => {
      return tags.map(t => new TagModel(t));
    });
  };
}

export const tagService = new TagsService();
