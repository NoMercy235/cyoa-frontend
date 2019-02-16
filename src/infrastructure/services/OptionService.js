import { BaseService } from './BaseService';
import { OptionModel } from '../models/OptionModel';

class OptionService extends BaseService {
  endpoint = 'api/option/:sequence';

  list = filters => {
    return super.list(filters).then(options => {
      return options.map(a => new OptionModel(a));
    });
  };

  save = option => {
    return super.save(option).then(a => new OptionModel(a));
  };

  update = (id, option) => {
    return super.update(id, option).then(a => new OptionModel(a));
  };
}

export const optionService = new OptionService();
