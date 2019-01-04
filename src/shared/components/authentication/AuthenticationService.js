import { BaseService } from '../../domain/services/BaseService';

class AuthenticationService extends BaseService {
  endpoint = 'auth/authenticate';

  async login(metadata) {
    try {
      const response = await this.client.post(this.endpoint, metadata);
      return response.data;
    } catch (e) {
      // Show toaster or something
      throw e;
    }
  }
}

export const authService = new AuthenticationService();
