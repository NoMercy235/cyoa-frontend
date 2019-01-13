import { BaseService } from './BaseService';

class TagsService extends BaseService {
  endpoint = 'api/tag?';
}

export const tagService = new TagsService();
