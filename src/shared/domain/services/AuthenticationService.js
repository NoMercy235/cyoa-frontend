import { BaseService } from './BaseService';

class AuthenticationService extends BaseService {
  async login(metadata) {
    try {
      const response = await this.client.post('auth/authenticate', metadata);
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async register(metadata) {
    try {
      const response = await this.client.post('auth/register', metadata);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}

export const authService = new AuthenticationService();
