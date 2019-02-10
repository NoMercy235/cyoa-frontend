import { BaseService } from '../../shared/domain/services/BaseService';
import { CollectionModel } from '../models/CollectionModel';

class CollectionService extends BaseService {
  endpoint = 'api/collection';

  list = filters => {
    return super.list(filters).then(collections => {
      return collections.map(c => new CollectionModel(c));
    });
  };

  save = collection => {
    return super.save(collection).then(c => new CollectionModel(c));
  };

  update = (id, collection) => {
    return super.update(id, collection).then(c => new CollectionModel(c));
  };
}

export const collectionService = new CollectionService();
