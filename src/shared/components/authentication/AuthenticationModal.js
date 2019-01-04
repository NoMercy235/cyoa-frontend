import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './Authentication.css';
import LoginForm from './LoginForm';
import { appPropTypes } from '../../store/AppStore';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle } from '../dialog/Title';
import { DialogContent } from '../dialog/Content';
import { DialogActions } from '../dialog/Actions';
import { Formik } from 'formik';
import AuthenticationActions from './AuthenticationActions';
import { NoAccount } from './NoAccount';
import { HasAccount } from './HasAccount';
import RegisterForm from './RegisterForm';
import { authService } from './AuthenticationService';
import { inject } from 'mobx-react';
import { UserModel } from '../../domain/models/UserModel';

@inject('appStore')
class AuthenticationModal extends Component {
  state = {
    isLoggingIn: true,
  };

  onChangeState = () => {
    this.setState({ isLoggingIn: !this.state.isLoggingIn });
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

  renderHelperText() {
    if (this.state.isLoggingIn) {
      return <NoAccount onHandleClick={this.onChangeState} />;
    } else {
      return <HasAccount onHandleClick={this.onChangeState} />;
    }
  }

  renderForm(formik) {
    if (this.state.isLoggingIn) {
      return <LoginForm formik={formik} />;
    } else {
      return <RegisterForm formik={formik} />;
    }
  }


  render() {
    return (
      <Fragment>
        <Formik
          initialValues={{ email: '', password: '', repeatPassword: '' }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await authService.login(values);
              this.props.appStore.setUser(
                new UserModel(response.user)
              );
              this.props.onClose();
            } finally {
              setSubmitting(false);
            }
          }}
          validate={values => {
            let errors = {};
            if (!values.email) {
              errors.email = 'This field is required';
            }
            if (!values.password) {
              errors.password = 'This field is required';
            }
            return errors;
          }}
        >
          {formik => {
            return (
              <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                classes={{ paper: this.props.classes.dialogSize }}
              >
                <DialogTitle
                  onClose={this.props.onClose}
                >
                  {this.renderTitle()}
                </DialogTitle>
                <DialogContent>
                  {this.renderForm(formik)}
                  {this.renderHelperText()}
                </DialogContent>
                <DialogActions>
                  <AuthenticationActions
                    formik={formik}
                    okText={this.renderOkText()}
                    onClose={this.props.onClose}/>
                </DialogActions>
              </Dialog>
            );
          }}
        </Formik>
      </Fragment>
    );
  }
}

AuthenticationModal.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appStore: appPropTypes,
};

export default withStyles(styles, { withTheme: true })(AuthenticationModal);
