import { BaseService } from '../../../../shared/domain/services/BaseService';

class StoryService extends BaseService {
  endpoint = 'api/story?';
}

export const storyService = new StoryService();
