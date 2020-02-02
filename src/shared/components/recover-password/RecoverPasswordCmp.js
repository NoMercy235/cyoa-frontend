import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { Button, TextField } from '@material-ui/core';

import { hasError } from '../form/helpers';

class RecoverPasswordCmp extends Component {
  renderPasswordField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="password"
        label="New password"
        fullWidth
        value={formik.values.password}
        {...hasError(formik, 'password')}
      />
    );
  };

  renderRepeatPasswordField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="password"
        label="Repeat password"
        fullWidth
        value={formik.values.repeatPassword}
        {...hasError(formik, 'repeatPassword')}
      />
    );
  };

  render() {
    const { formik } = this.props;

    return (
      <Form noValidate>
        <Field
          name="password"
          required
          render={this.renderPasswordField}
        />
        <Field
          name="repeatPassword"
          required
          render={this.renderRepeatPasswordField}
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
