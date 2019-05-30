import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Formik } from 'formik';
import { withStyles, Dialog } from '@material-ui/core';

import LoginForm from './LoginForm';
import { appStorePropTypes } from '../../store/AppStore';
import { DialogTitle } from '../dialog/Title';
import { DialogContent } from '../dialog/Content';
import { DialogActions } from '../dialog/Actions';
import AuthenticationActions from './AuthenticationActions';
import { NoAccount } from './NoAccount';
import { HasAccount } from './HasAccount';
import RegisterForm from './RegisterForm';
import { authService } from '../../../infrastructure/services/AuthenticationService';
import { UserModel } from '../../../infrastructure/models/UserModel';
import { AuthenticationModel } from '../../../infrastructure/models/AuthenticationModel';

import { styles } from './Authentication.css';
import { dialogDefaultCss } from '../dialog/Dialog.css';

@inject('appStore')
class AuthenticationModal extends Component {
  state = {
    isLoggingIn: true,
  };

  authenticate = response => {
    const { appStore, onSuccess, onClose } = this.props;

    localStorage.setItem('jwt', response.token);
    appStore.setUser(
      new UserModel(response.user)
    );
    onSuccess && onSuccess();
    onClose();
  };

  login = async (values) => {
    const response = await authService.login(values);
    this.authenticate(response);
  };

  register = async (values) => {
    const response = await authService.register(values);
    this.authenticate(response);
  };

  renderTitle() {
    return this.state.isLoggingIn
      ? 'Login to your account'
      : 'Register a new account';
  }

  renderOkText() {
    return this.state.isLoggingIn
      ? 'Login'
      : 'Register';
  }

  onHelperTextClick = (formik, metadata) => () => {
    formik.resetForm();
    this.setState(metadata);
  };

  renderHelperText(formik) {
    if (this.state.isLoggingIn) {
      return <NoAccount
        onHandleClick={this.onHelperTextClick(formik, { isLoggingIn: false })}
      />;
    } else {
      return <HasAccount
        onHandleClick={this.onHelperTextClick(formik,{ isLoggingIn: true })}
      />;
    }
  }

  onSubmit = async (values, { setSubmitting }) => {
    try {
      this.state.isLoggingIn
        ? this.login(values)
        : this.register(values);
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new AuthenticationModel(values);
    return model.checkErrors({ isLoggingIn: this.state.isLoggingIn });
  };

  renderForm = formik => {
    const { classes, open, onClose } = this.props;
    const { isLoggingIn } = this.state;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle
          onClose={onClose}
        >
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent>
          {isLoggingIn
            ? <LoginForm formik={formik} />
            : <RegisterForm formik={formik} />
          }
          {this.renderHelperText(formik)}
        </DialogContent>
        <DialogActions>
          <AuthenticationActions
            formik={formik}
            okText={this.renderOkText()}
            onClose={onClose}/>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    return (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={new AuthenticationModel()}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
      </>
    );
  }
}

AuthenticationModal.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  appStore: appStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(AuthenticationModal);
