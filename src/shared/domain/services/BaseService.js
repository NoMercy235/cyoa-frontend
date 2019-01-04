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

    this.client.interceptors.response.use(
      null,
      err => { throw err.response.data; },
    );
  }
}
