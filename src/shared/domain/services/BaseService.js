import * as axios from 'axios';
import { config } from '../../../config';
import { Utils } from '@nomercy235/utils';

/**
 * This class uses normal functions which are without async/await
 * due to a bug in Babel that prevents the usage of super in children
 * classes if the parent class' method was marked async.
 */
export class BaseService {
  endpoint = '';
  routeParams;

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
        // Redirect to the home page and set an error descriptor if the response is 'Unauthorized'
        // TODO: show some kind of an error? hold the request and prompt the user to authenticate?
        if (
          Utils.safeAccess(err, 'response.status') === 401 &&
          !err.response.config.url.match(/auth\/authenticate$/) &&
          window.location.pathname !== '/'
        ) {
          window.location = '/?loginError=true';
        }

        throw Utils.safeAccess(err, 'response.data') || err;
      },
    );

    this.list = this.list.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  list(filters = {}) {
    let query = '';

    Object.keys(filters).forEach(key => {
      const a = encodeURIComponent(`filter[${key}][op]`) + `=${filters[key].op}`;
      const b = encodeURIComponent(`filter[${key}][value]`) + `=${filters[key].value}`;
      const options = filters[key].options ? JSON.stringify(filters[key].options) : {};
      const c = encodeURIComponent(`filter[${key}][options]`) + `=${options}`;
      query += [a, b, c, ''].join('&');
    });

    let url = this.withRouteParams(this.endpoint + '?' + query);
    return this.client.get(url).then(BaseService.onSuccess);
  }

  get(id) {
    const url = this.withRouteParams(this.endpoint + '/' + id);
    return this.client.get(url).then(BaseService.onSuccess);
  }

  save(resource) {
    const url = this.withRouteParams(this.endpoint);
    return this.client.post(url, resource).then(BaseService.onSuccess);
  }

  update(id, metadata) {
    const url = this.withRouteParams(`${this.endpoint}/${id}`);
    return this.client.put(url, metadata).then(BaseService.onSuccess);
  }

  delete(resourceId) {
    const url = this.withRouteParams(`${this.endpoint}/${resourceId}`);
    return this.client.delete(url).then(BaseService.onSuccess);
  }

  withRouteParams(url) {
    let result = url;
    if (this.routeParams) {
      Object.keys(this.routeParams).forEach(key => {
        result = url.replace(key, this.routeParams[key]);
      });
    }
    return result;
  }

  setNextRouteParams(params) {
    this.routeParams = params;
  }

  static onSuccess(response) {
    return response.data;
  }
}
