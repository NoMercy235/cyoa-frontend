import * as axios from 'axios';
import { config } from '../../../config';
import { Utils } from '@nomercy235/utils';

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
          config.headers['authorization'] = `Bearer ${jwt}`;
        }
        return config;
      },
    );

    this.client.interceptors.response.use(
      null,
      err => {
        // Redirect to the landing page and set an error descriptor if the response is 'Unauthorized'
        // TODO: show some kind of an error? hold the request and prompt the user to authenticate?
        if (err.response.status === 401) {
          window.location = '/?loginError=true';
          throw Utils.safeAccess(err, 'response.data') || err;
        }
      },
    );
  }
}
