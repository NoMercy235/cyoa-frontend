import { BaseService } from '../../../../shared/domain/services/BaseService';

class CollectionService extends BaseService {
  endpoint = 'api/collection';

  async list() {
    try {
      const response = await this.client.get(this.endpoint);
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async save(collection) {
    try {
      const response = await this.client.post(this.endpoint, collection);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}

export const collectionService = new CollectionService();
