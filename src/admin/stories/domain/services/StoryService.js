import { BaseService } from '../../../../shared/domain/services/BaseService';

class StoryService extends BaseService {
  endpoint = 'api/story';

  async list() {
    try {
      const response = await this.client.get(this.endpoint);
      return response.data;
    } catch (e) {
      // Show toaster or something
      throw e;
    }
  }

  async save(story) {
    try {
      const response = await this.client.post(this.endpoint, story);
      return response.data;
    } catch (e) {
      // Show toaster or something
      throw e;
    }
  }
}

export const storyService = new StoryService();
