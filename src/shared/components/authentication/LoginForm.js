import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { withStyles, TextField } from '@material-ui/core';

import { hasError } from '../form/helpers';

import { styles } from './Authentication.css';

class LoginForm extends Component {
  renderEmailField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        label="Email"
        fullWidth
        value={formik.values.email}
        {...hasError(formik, 'email')}
      />
    );
  };

  renderPasswordField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="password"
        label="Password"
        fullWidth
        value={formik.values.password}
        {...hasError(formik, 'password')}
      />
    );
  };

  render() {

    return (
      <Form noValidate>
        <Field
          name="email"
          required
          render={this.renderEmailField}
        />
        <Field
          name="password"
          required
          render={this.renderPasswordField}
        />
      </Form>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);
