import { BaseService } from './BaseService';
import { PlayerModel } from '../models/PlayerModel';

class PlayerService extends BaseService {
  getOrCreateEndpoint = 'public/player/getOrCreate/:story';
  updateEndpoint = 'public/player/updateAttributes/:playerId';

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

  update = metadata => {
    return this.client
      .put(this.withRouteParams(this.updateEndpoint), metadata)
      .then(response => {
        return new PlayerModel(BaseService.onSuccess(response));
      });
  };
}

export const playerService = new PlayerService();
