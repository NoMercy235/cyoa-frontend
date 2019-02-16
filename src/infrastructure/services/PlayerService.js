import { BaseService } from './BaseService';
import { OptionModel } from '../models/OptionModel';
import { PlayerModel } from '../models/PlayerModel';

class PlayerService extends BaseService {
  getOrCreateEndpoint = 'public/player/getOrCreate/:story';

  get = playerId => {
    let url = this.getOrCreateEndpoint;

    if (playerId) {
      url += `?playerId=${playerId}`;
    }

    return this.client
      .get(this.withRouteParams(url))
      .then(response => {
        return new PlayerModel(BaseService.onSuccess(response));
      });
  };

  update = (id, option) => {
    return super.update(id, option).then(a => new OptionModel(a));
  };
}

export const playerService = new PlayerService();
