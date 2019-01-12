import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './Authentication.css';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { hasError } from '../form/helpers';

class RegisterForm extends Component {
  render() {
    const { formik } = this.props;

    return (
      <Form noValidate>
        <Field
          name="email"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              label="Email"
              fullWidth
              value={formik.values.email}
              {...hasError(formik, 'email')}
            />;
          }}
        />
        <Field
          name="password"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              type="password"
              label="Password"
              fullWidth
              value={formik.values.password}
              {...hasError(formik, 'password')}
            />;
          }}
        />
        <Field
          name="repeatPassword"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              type="password"
              label="Repeat password"
              fullWidth
              value={formik.values.repeatPassword}
              {...hasError(formik, 'repeatPassword')}
            />;
          }}
        />
      </Form>
    );
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterForm);
