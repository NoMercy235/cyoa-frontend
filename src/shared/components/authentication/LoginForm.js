import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './Authentication.css';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';

class LoginForm extends Component {
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
              helperText={formik.errors.email}
              error={!!formik.errors.email}
              value={formik.values.email}
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
      </Form>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);
