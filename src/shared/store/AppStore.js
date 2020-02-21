import * as PropTypes from 'prop-types';
import { action, computed, observable } from 'mobx';

import { UserModel } from '../../infrastructure/models/UserModel';
import { QueryParams } from '../utilities';

const makeRandomId = function () {
  return Math.random().toString().substring(2);
};

class AppStore {
  @observable isWebSocketConnected;
  @observable HeaderCmp;
  @observable user;
  @observable onlineUsers = 0;
  @observable onlineStatus = true;
  @observable canUseIdb;
  @observable isAuthModalOpen = false;
  @observable isKeepPlayerModalOpen = false;
  @observable currentLoadingAnimation = [];

  @observable queryParams = {
    publicStories: new QueryParams({
      pagination: { page: 0, limit: 10, total: 0 },
    }),
    sequences: new QueryParams({
      pagination: { page: 0, limit: 10, total: 0 },
    }),
  };

  localId = '';

  @action setIsWebSocketConnected = value => {
    this.isWebSocketConnected = value;
  };

  @action generateLocalId = () => {
    this.localId = localStorage.getItem('localId');
    if (!this.localId) {
      this.localId = makeRandomId();
      localStorage.setItem('localId', this.localId);
    }
  };

  @action setUser = user => {
    this.user = user;
  };

  @action setOnlineUsers = onlineUsers => {
    this.onlineUsers = onlineUsers;
  };

  @action loadHeader = cmp => {
    this.HeaderCmp = cmp;
  };

  @action unloadHeader = () => {
    this.HeaderCmp = null;
  };

  @action setOnlineStatus = status => {
    this.onlineStatus = status;
  };

  @action setCanUseIdb = hasIdb => {
    this.canUseIdb = hasIdb;
  };

  @action setIsAuthModalOpen = state => {
    this.isAuthModalOpen = state;
  };

  @action addCurrentLoadingAnimation = currentLoadingAnimation => {
    this.currentLoadingAnimation.push(currentLoadingAnimation);
  };

  @action removeCurrentLoadingAnimation = currentLoadingAnimation => {
    this.currentLoadingAnimation = this.currentLoadingAnimation.filter(cla => {
      return cla !== currentLoadingAnimation;
    });
  };

  @computed get isLoggedIn() {
    return !!this.user;
  }

  getUserId = () => {
    return this.isLoggedIn
      ? this.user._id
      : this.localId;
  }
}

export const appStorePropTypes = PropTypes.shape({
  isWebSocketConnected: PropTypes.bool,
  setIsWebSocketConnected: PropTypes.func,

  user: PropTypes.instanceOf(UserModel),
  onlineUsers: PropTypes.number,

  generateLocalId: PropTypes.func,

  setUser: PropTypes.func,
  getUserId: PropTypes.func,

  setOnlineUsers: PropTypes.func,

  loadHeader: PropTypes.func,
  unloadHeader: PropTypes.func,

  onlineStatus: PropTypes.bool,
  setOnlineStatus: PropTypes.func,

  canUseIdb: PropTypes.bool,
  setCanUseIdb: PropTypes.func,

  isAuthModalOpen: PropTypes.bool,
  setIsAuthModalOpen: PropTypes.func,

  isLoggedIn: PropTypes.bool,

  currentLoadingAnimation: PropTypes.arrayOf(PropTypes.string),
  addCurrentLoadingAnimation: PropTypes.func,
  removeCurrentLoadingAnimation: PropTypes.func,
});

export const appStore = new AppStore();
