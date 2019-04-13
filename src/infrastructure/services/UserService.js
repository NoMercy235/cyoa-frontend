import { BaseService } from './BaseService';

class UserService extends BaseService {
  endpoint = 'api/user';

  getUserWithToken = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return null;

    const url = `${this.endpoint}/getUserWithToken`;

    return this.client
      .get(url)
      .then(BaseService.onSuccess)
      .catch(() => null);

  };
}

export const userService = new UserService();
