import { BaseService } from '../../../../shared/domain/services/BaseService';
import { CollectionModel } from '../models/CollectionModel';

class CollectionService extends BaseService {
  endpoint = 'api/collection?';

  async save(story) {
    try {
      const dbCollection = await super.save(story);
      return new CollectionModel(dbCollection);
    } catch (e) {
      throw e;
    }
  }
}

export const collectionService = new CollectionService();
