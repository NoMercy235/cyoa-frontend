import { BaseService } from '../../../../shared/domain/services/BaseService';
import { AttributeModel } from '../models/AttributeModel';

class AttributeService extends BaseService {
  endpoint = 'api/attribute/:story';

  save = collection => {
    return super.save(collection).then(c => new AttributeModel(c));
  };

  update = (id, collection) => {
    return super.update(id, collection).then(c => new AttributeModel(c));
  };
}

export const attributeService = new AttributeService();
