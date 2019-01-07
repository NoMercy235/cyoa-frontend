import * as PropTypes from 'prop-types';
import { action, computed, observable } from 'mobx';
import { UserModel } from '../domain/models/UserModel';

class AppStore {
  constructor () {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  @observable user;

  @action setUser(user) {
    this.user = user;
  }

  @computed get isLoggedIn() {
    return !!this.user;
  }
}

export const appStorePropTypes = PropTypes.shape({
  user: PropTypes.instanceOf(UserModel),

  setUser: PropTypes.func,

  isLoggedIn: PropTypes.bool,
});

export const appStore = new AppStore();
