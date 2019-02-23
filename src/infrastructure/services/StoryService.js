import { BaseService } from './BaseService';
import { StoryModel } from '../models/StoryModel';

class StoryService extends BaseService {
  endpoint = 'api/story';

  get = (id, options) => {
    return super.get(id, options).then(story => {
      return new StoryModel(story);
    });
  };

  list = filters => {
    return super.list(filters).then(stories => {
      return stories.map(s => new StoryModel(s));
    });
  };

  save = story => {
    return super.save(story).then(s => new StoryModel(s));
  };

  update = (id, story) => {
    return super.update(id, story).then(c => new StoryModel(c));
  };
}


class PublicStoryService extends BaseService {
  endpoint = 'public/story';

  list = (filters = {}) => {
    return super.list(filters).then(stories => {
      return stories.map(s => new StoryModel(s));
    });
  };

  get = (id, options) => {
    return super.get(id, options).then(story => {
      return new StoryModel(story);
    });
  };
}

export const storyService = new StoryService();
export const publicStoryService = new PublicStoryService();
