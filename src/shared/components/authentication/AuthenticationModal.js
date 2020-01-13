import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Formik } from 'formik';
import { withStyles, Dialog, Typography } from '@material-ui/core';

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
import { BROADCAST_CHANNEL_NAME, BroadcastEvents } from '../../constants/global';

import { styles } from './Authentication.css';
import { dialogDefaultCss } from '../dialog/Dialog.css';

const RigamoBC = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

@inject('appStore')
@observer
class AuthenticationModal extends Component {
  state = {
    registeredSuccessfully: false,
    isLoggingIn: true,
    errorMessage: '',
  };
  snackbarRef = React.createRef();

  componentDidMount () {
    RigamoBC.onmessage = async ({ data: { type, payload } }) => {
      if (type !== BroadcastEvents.Login) return;
      await this.login(payload);
    }
  }

  onClose = () => {
    const { appStore, onClose } = this.props;

    appStore.setIsAuthModalOpen(false);
    onClose && onClose();

    this.formik.resetForm();
    this.setState({
      registeredSuccessfully: false,
      isLoggingIn: true,
      errorMessage: '',
    });
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

  login = async (response) => {
    const { appStore } = this.props;

    localStorage.setItem('jwt', response.token);
    appStore.setUser(
      new UserModel(response.user)
    );
    this.onSuccess();
    this.onClose();
  };

  loginBroadcast = async values => {
    const response = await authService.login(values);

    this.login(response);
    RigamoBC.postMessage({
      type: BroadcastEvents.Login,
      payload: response,
    });
  };

  register = async (values) => {
    await authService.register(values);
    this.setState({
      registeredSuccessfully: true,
    })
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

  renderCancelText() {
    return this.state.registeredSuccessfully
      ? 'Ok'
      : 'Cancel';
  }

  onHelperTextClick = (formik, metadata) => () => {
    formik.resetForm();
    this.setState({
      ...metadata,
      errorMessage: '',
    });
  };

  renderErrorText () {
    const { classes } = this.props;
    const { errorMessage } = this.state;

    if (!errorMessage) return null;

    return (
      <Typography
        className={classes.errorText}
        variant="caption"
        color="secondary"
      >
        {errorMessage}
      </Typography>
    );
  }

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
        ? await this.loginBroadcast(values)
        : await this.register(values);
    } catch (e) {
      this.setState({ errorMessage: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new AuthenticationModel(values);
    return model.checkErrors({ isLoggingIn: this.state.isLoggingIn });
  };

  renderForm = (formik) => {
    const { isLoggingIn } = this.state;

    return (
      <>
        {isLoggingIn
          ? <LoginForm formik={formik} />
          : <RegisterForm formik={formik} />
        }
        {this.renderErrorText()}
        {this.renderHelperText(formik)}
      </>
    );
  };

  renderRegisteredSuccessfully = () => {
    return (
      <Typography
        variant="h6"
        color="inherit"
      >
        Registration complete! Please verify your email before attempting to login.
      </Typography>
    );
  };

  renderModal = isAuthModalOpen => formik => {
    const { classes } = this.props;
    const { registeredSuccessfully } = this.state;
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
          {registeredSuccessfully
            ? this.renderRegisteredSuccessfully()
            : this.renderForm(formik)
          }
        </DialogContent>
        <DialogActions>
          <AuthenticationActions
            formik={formik}
            registeredSuccessfully={registeredSuccessfully}
            okText={this.renderOkText()}
            cancelText={this.renderCancelText()}
            onClose={this.onClose}
          />
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
          {this.renderModal(appStore.isAuthModalOpen)}
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
