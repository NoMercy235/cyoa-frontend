import { BaseService } from './BaseService';

class AuthenticationService extends BaseService {
  login = async (metadata) => {
    try {
      const response = await this.client.post('auth/authenticate', metadata);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  register = async (metadata) => {
    try {
      const response = await this.client.post('auth/register', metadata);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  lostPassword = async ({ email }) => {
    try {
      const response = await this.client.get(`auth/lostPassword/${encodeURIComponent(email)}`);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  recoverPassword = async ({ token, email, password }) => {
    try {
      const response = await this.client.put(`auth/recoverPassword/${email}/${token}`, { password });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  checkToken = async () => {
    try {
      await this.client.get('auth/checkToken');
    } catch (e) {
      if (!e.status) {
        // A network error occurred. The use most likely lost internet access, so
        // we don't remove the JWT token yet.
        return ;
      }
      localStorage.removeItem('jwt');
      throw e;
    }
  };

  verifyEmail = async (token) => {
    const res = await this.client.get(`auth/verifyEmail/${token}`);
    return res.data;
  }

  resendConfirmationEmail = async (email) => {
    const res = await this.client.get(`auth/resendEmail/${email}`);
    return res.data;
  }
}

export const authService = new AuthenticationService();
