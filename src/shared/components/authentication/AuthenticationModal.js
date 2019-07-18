import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
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
import { SnackbarEnum } from '../snackbar/Snackbar';
import Snackbar from '../snackbar/Snackbar';
import { makeRegexForPath, READ_STORY_ROUTE } from '../../constants/routes';

import { styles } from './Authentication.css';
import { dialogDefaultCss } from '../dialog/Dialog.css';

@inject('appStore')
@observer
class AuthenticationModal extends Component {
  state = {
    isLoggingIn: true,
  };
  snackbarRef = React.createRef();

  onClose = () => {
    const { appStore, onClose } = this.props;

    this.formik.resetForm();

    appStore.setIsAuthModalOpen(false);
    onClose && onClose();
  };

  onAskIfShouldReplacePlayer = () => {
    const { appStore } = this.props;

    const readPathRegexp = makeRegexForPath(READ_STORY_ROUTE);
    if (readPathRegexp.test(window.location.pathname)) {
      appStore.isKeepPlayerModalOpen = true;
    }
  };

  onSuccess = () => {
    const { onSuccess } = this.props;

    this.onAskIfShouldReplacePlayer();

    this.snackbarRef.current.showSnackbar({
      variant: SnackbarEnum.Variants.Success,
      message: 'Welcome!',
    });
    onSuccess && onSuccess();
  };

  authenticate = response => {
    const { appStore } = this.props;

    localStorage.setItem('jwt', response.token);
    appStore.setUser(
      new UserModel(response.user)
    );
    this.onSuccess();
    this.onClose();
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

  renderForm = isAuthModalOpen => formik => {
    const { classes } = this.props;
    const { isLoggingIn } = this.state;
    this.formik = formik;

    return (
      <Dialog
        open={isAuthModalOpen}
        onClose={this.onClose}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle onClose={this.onClose}>
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
            onClose={this.onClose}/>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    const { appStore } = this.props;

    return (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={new AuthenticationModel()}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm(appStore.isAuthModalOpen)}
        </Formik>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

AuthenticationModal.propTypes = {
  classes: PropTypes.object,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  appStore: appStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(AuthenticationModal);
