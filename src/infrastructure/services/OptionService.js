import { BaseService } from './BaseService';
import { OptionModel } from '../models/OptionModel';
import { makePath } from '../../shared/constants/routes';

class OptionService extends BaseService {
  endpoint = 'api/option/:sequence';
  allOptionsEndpoint = 'api/option/story/:story';

  get = id => {
    return super.get(id).then(o => new OptionModel(o));
  };

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

  getAllStoryOptions = (storyId) => {
    const endpoint = makePath(this.allOptionsEndpoint, { ':story': storyId });
    return this.client.get(`${endpoint}?${BaseService.parseSort({ created_at: 'asc' })}`)
      .then(BaseService.onSuccess).then(options => {
        return options.map(o => new OptionModel(o));
      });
  };
}

export const optionService = new OptionService();
