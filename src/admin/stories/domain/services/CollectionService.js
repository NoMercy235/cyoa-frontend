import { BaseService } from '../../../../shared/domain/services/BaseService';
import { CollectionModel } from '../models/CollectionModel';

class CollectionService extends BaseService {
  endpoint = 'api/collection';

  save = collection => {
    return super.save(collection).then(c => new CollectionModel(c));
  };

  update = (id, collection) => {
    return super.update(id, collection).then(c => new CollectionModel(c));
  };
}

export const collectionService = new CollectionService();
