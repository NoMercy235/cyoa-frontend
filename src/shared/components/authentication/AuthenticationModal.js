import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './Authentication.css';
import Authentication from './Authentication';
import Modal from '../modal/Modal';
import { appPropTypes } from '../../store/AppStore';

class AuthenticationModal extends Component {
  render() {
    return (
      <Modal
        open={this.props.open}
        onBackdropClick={this.props.onClose}
      >
        <p>Hello</p>
        <Authentication />
        <p>Footer</p>
      </Modal>
    );
  }
}

AuthenticationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appStore: appPropTypes,
};

export default withStyles(styles, { withTheme: true })(AuthenticationModal);
