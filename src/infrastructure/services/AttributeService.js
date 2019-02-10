import { BaseService } from '../../shared/domain/services/BaseService';
import { AttributeModel } from '../models/AttributeModel';

class AttributeService extends BaseService {
  endpoint = 'api/attribute/:story';

  list = filters => {
    return super.list(filters).then(attrs => {
      return attrs.map(a => new AttributeModel(a));
    });
  };

  save = attribute => {
    return super.save(attribute).then(a => new AttributeModel(a));
  };

  update = (id, attribute) => {
    return super.update(id, attribute).then(a => new AttributeModel(a));
  };
}

export const attributeService = new AttributeService();
