import { BaseService } from './BaseService';
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


class PublicSequenceService extends BaseService {
  endpoint = 'public/sequence/:story';

  get = (id, options) => {
    return super.get(id, options).then(story => {
      return new SequenceModel(story);
    });
  };
}

export const sequenceService = new SequenceService();
export const publicSequenceService = new PublicSequenceService();
