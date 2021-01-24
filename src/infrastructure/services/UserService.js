import { BaseService } from './BaseService';
import { UserModel } from '../models/UserModel';

class UserService extends BaseService {
  endpoint = 'api/user';

  getUserWithToken = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return null;

    const url = `${this.endpoint}/getUserWithToken`;

    return this.client
      .get(url)
      .then(BaseService.onSuccess)
      .then(data => new UserModel(data))
    ;
  };

  uploadProfilePicture (img) {
    const url = `${this.endpoint}/profilePicture`;

    return this.client
      .post(url, { profile: img })
      .then(BaseService.onSuccess)
    ;
  }

  update = (id, user) => {
    return super.update(id, user).then(u => new UserModel(u));
  };
}

class PublicUserService extends BaseService {
  endpoint = 'public/user';

  getUserOverview = (id) => {
    const url = `${this.endpoint}/overview/${id}`;
    return this.client
      .get(url)
      .then(BaseService.onSuccess)
      .then(overview => {
        return {
          ...overview,
          user: new UserModel(overview.user),
        };
      });
  };

  getProfilePicture = (userId) => {
    const url = `${this.endpoint}/profilePicture/${userId}`;
    return this.client
      .get(url)
      .then(BaseService.onSuccess);
  };
}

export const userService = new UserService();
export const publicUserService = new PublicUserService();
