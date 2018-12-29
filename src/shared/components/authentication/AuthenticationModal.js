import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './Authentication.css';
import Authentication from './LoginForm';
import { appPropTypes } from '../../store/AppStore';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle } from '../dialog/Title';
import { DialogContent } from '../dialog/Content';
import { DialogActions } from '../dialog/Actions';
import { Formik } from 'formik';
import AuthenticationActions from './AuthenticationActions';
import Typography from '@material-ui/core/es/Typography/Typography';

class AuthenticationModal extends Component {
  state = {
    isLoggingIn: true,
  };

  renderTitle() {
    return this.state.isLoggingIn
      ? 'Login to your account'
      : 'Register a new account';
  }

  renderHelperText() {
    if (this.state.isLoggingIn) {
      const here = (
        <span
          className={this.props.classes.here}
          onClick={console.log}
        >
          here
        </span>
      );
      return (
        <Typography
          className={this.props.classes.helperText}
          variant="caption"
          color="inherit">
          No account? Register {here}!
        </Typography>
      );
    }
  }

  render() {
    return (
      <Fragment>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 500);
          }}
          validate={values => {
            let errors = {};
            if (!values.username) {
              errors.username = 'This field is required';
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
              >
                <DialogTitle
                  onClose={this.props.onClose}
                >
                  {this.renderTitle()}
                </DialogTitle>
                <DialogContent>
                  <Authentication formik={formik} />
                  {this.renderHelperText()}
                </DialogContent>
                <DialogActions>
                  <AuthenticationActions
                    formik={formik}
                    okText="Login"
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
