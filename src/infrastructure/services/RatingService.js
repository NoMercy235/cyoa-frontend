import { BaseService } from './BaseService';
import { RatingModel } from '../models/RatingModel';

class RatingService extends BaseService {
  endpoint = 'api/rating';

  createUrl = (userId, storyId) => `${this.endpoint}/${userId}/${storyId}`;

  get = (userId, storyId) => {
    return this.client
      .get(this.createUrl(userId, storyId))
      .then(RatingService.onSuccess);
  };

  update = (userId, storyId, rating) => {
    return this.client
      .put(this.createUrl(userId, storyId), { rating })
      .then(RatingService.onSuccess);
  };

  static onSuccess (response) {
    return new RatingModel(BaseService.onSuccess(response));
  }
}

export const ratingService = new RatingService();
