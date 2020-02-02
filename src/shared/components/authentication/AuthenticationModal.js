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
import { BROADCAST_CHANNEL_NAME, BroadcastEvents } from '../../constants/events';
import { LostPassword } from './LostPassword';
import LostPasswordForm from './LostPasswordForm';

import { styles } from './Authentication.css';
import { dialogDefaultCss } from '../dialog/Dialog.css';

const RigamoBC = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

const FormStates = {
  Login: 'login',
  Register: 'register',
  LostPassword: 'lostPassword',
  SuccessRegister: 'successRegister',
  SuccessLostPassword: 'successLostPassword',
};

@inject('appStore')
@observer
class AuthenticationModal extends Component {
  state = {
    errorMessage: '',
    formState: FormStates.Login,
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
      formState: FormStates.Login,
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
      formState: FormStates.SuccessRegister,
    })
  };

  lostPassword = async (values) => {
    await authService.lostPassword(values);
    this.setState({
      formState: FormStates.SuccessLostPassword,
    })
  };

  renderTitle() {
    switch (this.state.formState) {
      case FormStates.Login:
        return 'Login to your account';
      case FormStates.Register:
        return 'Register a new account';
      case FormStates.LostPassword:
        return 'Recover your password';
      case FormStates.SuccessRegister:
      case FormStates.SuccessLostPassword:
        return 'Action completed';
      default:
    }
  }

  renderOkText() {
    switch (this.state.formState) {
      case FormStates.Login:
        return 'Login';
      case FormStates.Register:
        return 'Register';
      case FormStates.LostPassword:
        return 'Submit';
      default:
    }
  }

  renderCancelText() {
    switch (this.state.formState) {
      case FormStates.Login:
      case FormStates.Register:
      case FormStates.LostPassword:
        return 'Cancel';
      case FormStates.SuccessRegister:
      case FormStates.SuccessLostPassword:
        return 'Ok';
      default:
    }
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
    const { formState } = this.state;

    switch (formState) {
      case FormStates.Login:
        return (
          <>
            <NoAccount
              onHandleClick={this.onHelperTextClick(formik, { formState: FormStates.Register })}
            />
            <LostPassword
              onHandleClick={this.onHelperTextClick(formik, { formState: FormStates.LostPassword })}
            />
          </>
        );
      case FormStates.Register:
        return (
          <HasAccount
            onHandleClick={this.onHelperTextClick(formik,{ formState: FormStates.Login })}
          />
        );
      case FormStates.LostPassword:
        return (
          <HasAccount
            onHandleClick={this.onHelperTextClick(formik,{ formState: FormStates.Login })}
          />
        );
      default:
    }
  }

  onSubmit = async (values, { setSubmitting }) => {
    try {
      switch (this.state.formState) {
        case FormStates.Login:
          return await this.loginBroadcast(values);
        case FormStates.Register:
          return await this.register(values);
        case FormStates.LostPassword:
          return await this.lostPassword(values);
        default:
      }
    } catch (e) {
      this.setState({ errorMessage: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const { formState } = this.state;
    const model = new AuthenticationModel(values);

    if (formState === FormStates.LostPassword) {
      return AuthenticationModel.validateEmail(values.email);
    }

    return model.checkErrors({
      isLoggingIn: formState === FormStates.Login
    });
  };

  renderActionCompleted = (message) => {
    return (
      <Typography
        variant="h6"
        color="inherit"
      >
        {message}
      </Typography>
    );
  };

  renderForm = (formik) => {
    switch (this.state.formState) {
      case FormStates.Login:
        return <LoginForm formik={formik} />;
      case FormStates.Register:
        return <RegisterForm formik={formik} />;
      case FormStates.LostPassword:
        return <LostPasswordForm formik={formik} />;
      default:
    }
  };

  renderContent = (formik) => {
    const { classes } = this.props;
    const { formState } = this.state;

    if (formState === FormStates.SuccessRegister) {
      return this.renderActionCompleted(
        'Registration complete! Please verify your email before attempting to login.'
      );
    }

    if (formState === FormStates.SuccessLostPassword) {
      return this.renderActionCompleted(
        'The password recovery request was sent to the provided email! Please follow the instructions there to proceed,'
      );
    }

    return (
      <>
        {this.renderForm(formik)}
        {this.renderErrorText()}
        <div className={classes.helperTextContainer}>
          {this.renderHelperText(formik)}
        </div>
      </>
    );
  };

  renderModal = isAuthModalOpen => formik => {
    const { classes } = this.props;
    const { formState } = this.state;
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
          {this.renderContent(formik)}
        </DialogContent>
        <DialogActions>
          <AuthenticationActions
            formik={formik}
            showAsConfirm={
              formState === FormStates.SuccessRegister || formState === FormStates.SuccessLostPassword
            }
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
