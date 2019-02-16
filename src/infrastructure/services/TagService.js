import { BaseService } from './BaseService';

class TagsService extends BaseService {
  endpoint = 'tag';
}

export const tagService = new TagsService();
