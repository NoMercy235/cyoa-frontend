import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { inject } from 'mobx-react';

import { authService } from '../../../infrastructure/services/AuthenticationService';
import RecoverPasswordCmp from './RecoverPasswordCmp';
import { LANDING_ROUTE, routeWithQueryParams } from '../../constants/routes';
import { AuthenticationModel } from '../../../infrastructure/models/AuthenticationModel';
import { SnackbarEnum } from '../snackbar/Snackbar';
import { appStorePropTypes } from '../../store/AppStore';

@inject('appStore')
class RecoverPasswordContainer extends Component {

  onSubmit = async ({ password }, { setSubmitting }) => {
    const {
      appStore,
      match: {
        params: {
          email,
          token,
        },
      },
      history,
    } = this.props;
    try {
      await authService.recoverPassword({ token, email, password });
      history.push(routeWithQueryParams(LANDING_ROUTE, { recoverPasswordSuccess: true }));
    } catch (e) {
      appStore.showSnackbar({
        variant: SnackbarEnum.Variants.Error,
        message: 'Your request could not be completed',
      });
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
      <Formik
        initialValues={{ password: '', repeatPassword: '' }}
        onSubmit={this.onSubmit}
        validate={this.validate}
      >
        {this.renderForm}
      </Formik>
    );
  }
}

RecoverPasswordContainer.propTypes = {
  appStore: appStorePropTypes,
};

export default withRouter(RecoverPasswordContainer);
