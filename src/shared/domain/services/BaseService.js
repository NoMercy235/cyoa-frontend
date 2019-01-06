import * as axios from 'axios';
import { config } from '../../../config';

export class BaseService {
  constructor() {
    this.client = axios.create({
      baseURL: config.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      config => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
          config.headers.append('Authorization', `Bearer ${jwt}`);
        }
        return config;
      },
    );

    this.client.interceptors.response.use(
      null,
      err => { throw err.response.data; },
    );
  }
}
