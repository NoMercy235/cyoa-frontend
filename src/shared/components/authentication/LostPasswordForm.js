import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { withStyles, TextField } from '@material-ui/core';

import { styles } from './Authentication.css';
import { hasError } from '../../formUtils';

class LostPasswordForm extends Component {
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

  render() {
    return (
      <Form noValidate>
        <Field
          name="email"
          required
          render={this.renderEmailField}
        />
      </Form>
    );
  }
}

LostPasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(LostPasswordForm);
