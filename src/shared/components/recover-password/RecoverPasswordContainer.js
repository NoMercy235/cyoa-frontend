import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';

import { authService } from '../../../infrastructure/services/AuthenticationService';
import RecoverPasswordCmp from './RecoverPasswordCmp';
import { LANDING_ROUTE, routeWithQueryParams } from '../../constants/routes';
import { AuthenticationModel } from '../../../infrastructure/models/AuthenticationModel';
import Snackbar, { SnackbarEnum } from '../snackbar/Snackbar';

class RecoverPasswordContainer extends Component {
  snackbarRef = React.createRef();

  onSubmit = async ({ password }, { setSubmitting }) => {
    const {
      match: {
        params: {
          email,
          token
        }
      },
      history
    } = this.props;
    try {
      await authService.recoverPassword({ token, email, password });
      history.push(routeWithQueryParams(LANDING_ROUTE, { recoverPasswordSuccess: true }));
    } catch (e) {
      this.snackbarRef.current.showSnackbar({
        variant: SnackbarEnum.Variants.Error,
        message: 'Your request could not be completed',
      })
    } finally {
      setSubmitting(false);
    }
  };

  validate = (values) => {
    const model = new AuthenticationModel(values);
    return model.checkErrors(['email', 'firstName', 'lastName']);
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
          initialValues={{ password: '', repeatPassword: '' }}
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
