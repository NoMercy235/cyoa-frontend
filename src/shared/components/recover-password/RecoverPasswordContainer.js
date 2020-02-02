import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';

import { authService } from '../../../infrastructure/services/AuthenticationService';
import RecoverPasswordCmp from './RecoverPasswordCmp';
import { LANDING_ROUTE, routeWithQueryParams } from '../../constants/routes';

class RecoverPasswordContainer extends Component {
  onSubmit = async ({ newPassword: password }) => {
    const {
      match: {
        params: {
          email,
          token
        }
      },
      history
    } = this.props;
    await authService.recoverPassword({ token, email, password });
    history.push(routeWithQueryParams(LANDING_ROUTE, { recoverPasswordSuccess: true }));
  };

  validate = ({ newPassword, newPasswordRepeat }) => {
    return newPassword && newPasswordRepeat && newPassword === newPasswordRepeat;
  };

  renderForm = formik => {
    return (
      <RecoverPasswordCmp
        formik={formik}
        onSuccess={this.onSuccess}
      />
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
      </>
    );
  }
}

export default withRouter(RecoverPasswordContainer);
