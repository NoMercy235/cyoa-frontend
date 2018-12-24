import { observable, action, computed } from 'mobx';
import { createTransformer } from 'mobx-utils';
import * as PropTypes from 'prop-types';

class AppStore {
  @observable modals = [];

  /**
   * Registers a modal across the application.
   * @param {{
   *  id: string,
   *  open: boolean,
   *  component: React.Component
   * }} metadata
   */
  @action registerModal(metadata) {
    metadata.open = !!metadata.open;
    this.modals.push(metadata);
  }

  @action showModal(id) {
    this.getModal(id).open = true;
  }

  @action hideModal(id) {
    this.getModal(id).open = false;
  }

  @computed get isModalOpen() {
    return createTransformer(id => this.getModal(id).open);
  }

  getModal(id) {
    return this.modals.find(modal => modal.id === id);
  }
}

export const appPropTypes = PropTypes.shape({
  modals: PropTypes.array,
  registerModal: PropTypes.func,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  isModalOpen: PropTypes.func,
});

export const appStore = new AppStore();
