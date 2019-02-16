import * as PropTypes from 'prop-types';
import { action, computed, observable } from 'mobx';
import { UserModel } from '../../infrastructure/models/UserModel';

class AppStore {
  @observable user;

  constructor () {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  @action setUser(user) {
    this.user = user;
  }

  @computed get isLoggedIn() {
    return !!this.user;
  }

  getUserId() {
    return this.isLoggedIn
      ? this.user._id
      : '';
  }
}

export const appStorePropTypes = PropTypes.shape({
  user: PropTypes.instanceOf(UserModel),

  setUser: PropTypes.func,
  getUserId: PropTypes.func,

  isLoggedIn: PropTypes.bool,
});

export const appStore = new AppStore();
