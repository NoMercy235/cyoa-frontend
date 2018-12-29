import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './Authentication.css';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';

class RegisterForm extends Component {
  render() {
    const { formik } = this.props;

    return (
      <Form noValidate>
        <Field
          name="username"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              label="Username"
              fullWidth
              helperText={formik.errors.username}
              error={!!formik.errors.username}
              value={formik.values.username}
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
              helperText={formik.errors.password}
              error={!!formik.errors.password}
              value={formik.values.password}
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
              helperText={formik.errors.repeatPassword}
              error={!!formik.errors.repeatPassword}
              value={formik.values.repeatPassword}
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
