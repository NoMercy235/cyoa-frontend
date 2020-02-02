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

  async lostPassword({ email }) {
    try {
      const response = await this.client.get(`auth/lostPassword/${encodeURIComponent(email)}`);
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async checkToken() {
    try {
      await this.client.get('auth/checkToken');
    } catch (e) {
      localStorage.removeItem('jwt');
      throw e;
    }
  }

  async verifyEmail (token) {
    const res = await this.client.get(`auth/verifyEmail/${token}`);
    return res.data;
  }
}

export const authService = new AuthenticationService();
