import { BaseService } from '../../shared/domain/services/BaseService';
import { SequenceModel } from '../models/SequenceModel';

class SequenceService extends BaseService {
  endpoint = 'api/sequence/:story';

  list = filters => {
    return super.list(filters).then(sequences => {
      return sequences.map(s => new SequenceModel(s));
    });
  };

  save = sequence => {
    return super.save(sequence).then(s => new SequenceModel(s));
  };

  update = (id, sequence) => {
    return super.update(id, sequence).then(s => new SequenceModel(s));
  };
}

export const sequenceService = new SequenceService();
