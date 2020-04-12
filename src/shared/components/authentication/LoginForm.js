import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';
import { withStyles } from '@material-ui/core';

import { styles } from './Authentication.css';
import { renderInput } from '../../utils/formUtils';

class LoginForm extends Component {
  render() {
    const { formik } = this.props;
    return (
      <Form noValidate>
        {renderInput(formik, {
          label: 'Email',
          name: 'email',
          fullWidth: true,
        })}
        {renderInput(formik, {
          label: 'Password',
          name: 'password',
          fullWidth: true,
          type: 'password',
        })}
      </Form>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);
