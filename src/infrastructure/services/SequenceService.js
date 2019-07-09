import { BaseService } from './BaseService';
import { SequenceModel } from '../models/SequenceModel';
import { OptionModel } from '../models/OptionModel';
import { QueryParams } from '../../shared/utilities';

class SequenceService extends BaseService {
  endpoint = 'api/sequence/:story';
  updateOrderEndpoint = 'api/sequence/:story/updateOrder';

  get = (id, options) => {
    return super.get(id, options).then(sequence => {
      sequence.options = sequence.options.map(o => new OptionModel(o));
      return new SequenceModel(sequence);
    });
  };

  list = (filters, sort, pagination) => {
    return super.list(filters, sort, pagination).then(response => {
      if (pagination) {
        return QueryParams.adaptResponse({
          resource: 'sequences',
          ResourceModel: SequenceModel,
        })(response);
      }
      return response.map(s => new SequenceModel(s));
    });
  };

  save = sequence => {
    return super.save(sequence).then(s => new SequenceModel(s));
  };

  update = (id, sequence) => {
    return super.update(id, sequence).then(s => new SequenceModel(s));
  };

  updateOrder = sequences => {
    const url = this.withRouteParams(this.updateOrderEndpoint);
    return this.client.put(url, sequences).then(BaseService.onSuccess);
  };
}


class PublicSequenceService extends BaseService {
  endpoint = 'public/sequence/:story';

  get = (id, options) => {
    return super.get(id, options).then(sequence => {
      sequence.options = sequence.options.map(o => new OptionModel(o));
      return new SequenceModel(sequence);
    });
  };
}

export const sequenceService = new SequenceService();
export const publicSequenceService = new PublicSequenceService();
