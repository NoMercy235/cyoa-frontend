import { BaseService } from '../../../../shared/domain/services/BaseService';
import { StoryModel } from '../models/StoryModel';

class StoryService extends BaseService {
  endpoint = 'api/story?';

  async save(story) {
    try {
      const dbStory = await super.save(story);
      return new StoryModel(dbStory);
    } catch (e) {
      throw e;
    }
  }
}

export const storyService = new StoryService();
