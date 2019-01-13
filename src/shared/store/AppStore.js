import * as PropTypes from 'prop-types';
import { action, computed, observable } from 'mobx';
import { UserModel } from '../domain/models/UserModel';
import { TagModel } from '../domain/models/TagModel';

class AppStore {
  @observable user;
  @observable tags = [];

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

  @action setTags(tags) {
    this.tags = tags;
  }
}

export const appStorePropTypes = PropTypes.shape({
  user: PropTypes.instanceOf(UserModel),
  tags: PropTypes.arrayOf(PropTypes.shape(TagModel)),

  setUser: PropTypes.func,

  isLoggedIn: PropTypes.bool,
});

export const appStore = new AppStore();
