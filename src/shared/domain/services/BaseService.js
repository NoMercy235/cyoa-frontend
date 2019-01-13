import * as axios from 'axios';
import { config } from '../../../config';
import { Utils } from '@nomercy235/utils';

export class BaseService {
  endpoint = '';

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
        if (err.response.status === 401 && !err.response.config.url.match(/auth\/authenticate$/)) {
          window.location = '/?loginError=true';
        }

        throw Utils.safeAccess(err, 'response.data') || err;
      },
    );
  }

  async list(filters = {}) {
    let query = '';

    Object.keys(filters).forEach(key => {
      const a = encodeURIComponent(`filter[${key}][op]`) + `=${filters[key].op}`;
      const b = encodeURIComponent(`filter[${key}][value]`) + `=${filters[key].value}`;
      query += [a, b, ''].join('&');
    });

    try {
      const response = await this.client.get(this.endpoint + query);
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async save(resource) {
    try {
      const response = await this.client.post(this.endpoint, resource);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
