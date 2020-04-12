import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';
import { withStyles } from '@material-ui/core';

import { styles } from './Authentication.css';
import { renderInput } from '../../utils/formUtils';

class RegisterForm extends Component {
  render() {
    const { formik } = this.props;
    return (
      <Form noValidate>
        {renderInput(formik, {
          label: 'First name',
          name: 'firstName',
          fullWidth: true,
        })}
        {renderInput(formik, {
          label: 'Last name',
          name: 'lastName',
          fullWidth: true,
        })}
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
        {renderInput(formik, {
          label: 'Repeat password',
          name: 'repeatPassword',
          fullWidth: true,
          type: 'password',
        })}
      </Form>
    );
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterForm);
