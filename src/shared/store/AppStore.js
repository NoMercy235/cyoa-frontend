import * as PropTypes from 'prop-types';
import { action, computed, observable } from 'mobx';
import { UserModel } from '../../infrastructure/models/UserModel';

const makeRandomId = function () {
  return Math.random().toString().substring(2);
};

class AppStore {
  @observable user;
  localId = '';

  constructor () {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    } else {
      this.localId = localStorage.getItem('localId');
      if (!this.localId) {
        this.localId = makeRandomId();
        localStorage.setItem('localId', this.localId);
      }
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
      : this.localId;
  }
}

export const appStorePropTypes = PropTypes.shape({
  user: PropTypes.instanceOf(UserModel),

  setUser: PropTypes.func,
  getUserId: PropTypes.func,

  isLoggedIn: PropTypes.bool,
});

export const appStore = new AppStore();
