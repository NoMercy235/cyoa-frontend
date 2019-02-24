import { BaseService } from './BaseService';
import { SequenceModel } from '../models/SequenceModel';
import { OptionModel } from '../models/OptionModel';

class SequenceService extends BaseService {
  endpoint = 'api/sequence/:story';

  get = (id, options) => {
    return super.get(id, options).then(sequence => {
      sequence.options = sequence.options.map(o => new OptionModel(o));
      return new SequenceModel(sequence);
    });
  };

  list = (filters, sort) => {
    return super.list(filters, sort).then(sequences => {
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
    return super.get(id, options).then(sequence => {
      sequence.options = sequence.options.map(o => new OptionModel(o));
      return new SequenceModel(sequence);
    });
  };
}

export const sequenceService = new SequenceService();
export const publicSequenceService = new PublicSequenceService();
