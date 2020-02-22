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
      .catch(() => null);

  };

  update = (id, user) => {
    return super.update(id, user).then(u => new UserModel(u));
  };
}

export const userService = new UserService();
