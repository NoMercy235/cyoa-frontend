import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './Authentication.css';
import LoginForm from './LoginForm';
import { appStorePropTypes } from '../../store/AppStore';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle } from '../dialog/Title';
import { DialogContent } from '../dialog/Content';
import { DialogActions } from '../dialog/Actions';
import { Formik } from 'formik';
import AuthenticationActions from './AuthenticationActions';
import { NoAccount } from './NoAccount';
import { HasAccount } from './HasAccount';
import RegisterForm from './RegisterForm';
import { authService } from '../../../infrastructure/services/AuthenticationService';
import { inject } from 'mobx-react';
import { UserModel } from '../../../infrastructure/models/UserModel';
import { AuthenticationModel } from '../../../infrastructure/models/AuthenticationModel';
import Snackbar from '../snackbar/Snackbar';
import { BaseModel } from '../../../infrastructure/models/BaseModel';

@inject('appStore')
class AuthenticationModal extends Component {
  state = {
    isLoggingIn: true,

    // snackbar
    open: false,
    variant: 'success',
    message: '',
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  getSnackbarText = () => {
    return this.state.isLoggingIn
      ? 'Login successful!'
      : 'Register successful!';
  };

  authenticate = response => {
    localStorage.setItem('jwt', response.token);
    this.props.appStore.setUser(
      new UserModel(response.user)
    );
    this.props.onClose();
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
    this.onChangeState(metadata)();
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
        ? await this.login(values)
        : await this.register(values);
      this.onChangeState({
        variant: 'success',
        open: true,
        message: this.getSnackbarText(),
      })();
    } catch (e) {
      this.onChangeState({
        variant: 'error',
        open: true,
        message: BaseModel.handleError(e),
      })();
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
    const { open, message, variant } = this.state;

    return (
      <Fragment>
        <Formik
          enableReinitialize={true}
          initialValues={new AuthenticationModel()}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
        <Snackbar
          open={open}
          onClose={this.onChangeState({ open: false })}
          message={message}
          variant={variant}
        />
      </Fragment>
    );
  }
}

AuthenticationModal.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(AuthenticationModal);
