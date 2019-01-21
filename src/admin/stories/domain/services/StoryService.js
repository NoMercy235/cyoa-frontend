import { BaseService } from '../../../../shared/domain/services/BaseService';
import { StoryModel } from '../models/StoryModel';

class StoryService extends BaseService {
  endpoint = 'api/story';

  save = story => {
    return super.save(story).then(s => new StoryModel(s));
  };
}

export const storyService = new StoryService();
