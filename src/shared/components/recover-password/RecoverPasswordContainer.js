import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';

import { authService } from '../../../infrastructure/services/AuthenticationService';
import Snackbar, { SnackbarEnum } from '../snackbar/Snackbar';
import RecoverPasswordCmp from './RecoverPasswordCmp';

class RecoverPasswordContainer extends Component {
  snackbarRef = React.createRef();

  onSubmit = async ({ newPassword: password }) => {
    const {
      match: {
        params: {
          email,
          token
        }
      },
    } = this.props;
    await this.snackbarRef.current.executeAndShowSnackbar(
      authService.recoverPassword,
      [{ token, email, password }],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Password changed!',
      },
    );
  };

  validate = ({ newPassword, newPasswordRepeat }) => {
    return newPassword && newPasswordRepeat && newPassword === newPasswordRepeat;
  };

  renderForm = formik => {
    return (
      <RecoverPasswordCmp formik={formik}/>
    );
  };

  render() {
    return (
      <>
        <Formik
          initialValues={{ newPassword: '', newPasswordRepeat: '' }}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

export default withRouter(RecoverPasswordContainer);
