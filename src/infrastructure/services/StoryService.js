import { BaseService } from './BaseService';
import { StoryModel } from '../models/StoryModel';
import { SequenceModel } from '../models/SequenceModel';
import { OptionModel } from '../models/OptionModel';

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
    return super.update(id, story).then(s => new StoryModel(s));
  };

  publish = (id, published) => {
    const url = `${this.endpoint}/${id}/publish`;
    return this.client
      .put(url, { published })
      .then(BaseService.onSuccess)
      .then(s => new StoryModel(s));
  };

  checkIfCanPublish = id => {
    const url = `${this.endpoint}/checkIfCanPublish/${id}`;
    return this.client.get(url);
  };
}


class PublicStoryService extends BaseService {
  endpoint = 'public/story';
  quickEndpoint = 'public/story/quick';
  offlineEndpoint = 'public/story/offline';

  list = (filters = {}) => {
    return super.list(filters).then(stories => {
      return stories.map(s => new StoryModel(s));
    });
  };

  quickList = async (value) => {
    const quickSearch = `quickSearch=${value}`;
    const url = `${this.quickEndpoint}?${quickSearch}`;

    return await this.client
      .get(url)
      .then(BaseService.onSuccess)
      .then(stories => {
        return stories.map(s => new StoryModel(s));
      });
  };

  get = (id, options) => {
    return super.get(id, options).then(story => {
      return new StoryModel(story);
    });
  };

  getOfflineStory = async (id, instanced = false) => {
    return await this.client
      .get(`${this.offlineEndpoint}/${id}`)
      .then(BaseService.onSuccess)
      .then(({ story, sequences, options }) => {
        return {
          story: instanced ? new StoryModel(story) : story,
          sequences: instanced ? sequences.map(s => new SequenceModel(s)) : sequences,
          options: instanced ? options.map(o => new OptionModel(o)) : options,
        };
      });
  }
}

export const storyService = new StoryService();
export const publicStoryService = new PublicStoryService();
