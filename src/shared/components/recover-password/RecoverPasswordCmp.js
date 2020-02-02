import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { Button, TextField } from '@material-ui/core';

import { hasError } from '../form/helpers';

class RecoverPasswordCmp extends Component {
  renderNewPasswordField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="password"
        label="New password"
        fullWidth
        value={formik.values.newPassword}
        {...hasError(formik, 'newPassword')}
      />
    );
  };

  renderNewPasswordRepeatField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="password"
        label="Repeat password"
        fullWidth
        value={formik.values.newPasswordRepeat}
        {...hasError(formik, 'newPasswordRepeat')}
      />
    );
  };

  render() {
    const { formik } = this.props;

    return (
      <Form noValidate>
        <Field
          name="newPassword"
          required
          render={this.renderNewPasswordField}
        />
        <Field
          name="newPasswordRepeat"
          required
          render={this.renderNewPasswordRepeatField}
        />
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          onClick={formik.submitForm}
        >
          Confirm
        </Button>
      </Form>
    );
  }
}

RecoverPasswordCmp.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default RecoverPasswordCmp;
