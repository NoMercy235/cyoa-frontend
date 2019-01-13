import { BaseService } from '../../../../shared/domain/services/BaseService';

class CollectionService extends BaseService {
  endpoint = 'api/collection?';
}

export const collectionService = new CollectionService();
