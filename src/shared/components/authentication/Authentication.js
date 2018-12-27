import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './Authentication.css';
import { Field, Form, Formik } from 'formik';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Utils } from '@nomercy235/utils';

class Authentication extends Component {
  onCancel = () => {
    Utils.safeAccess(this.props, 'onCancel()');
  };

  render() {
    const { classes } = this.props;

    return (
      <div
        className={classes.container}
        tabIndex={-1}
      >
        <Typography variant="h6" id="modal-title">
          Login to your account
        </Typography>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 500);
          }}
          validate={values => {
            let errors = {};
            if (!values.username) {
              errors.username = 'This field is required';
            }
            if (!values.password) {
              errors.password = 'This field is required';
            }
            return errors;
          }}
        >
          {({
            isSubmitting,
            errors,
            values,
          }) => {
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
                      helperText={errors.username}
                      error={!!errors.username}
                      value={values.username}
                    />;
                  }}
                />
                <Field
                  name="password"
                  required
                  render={({ field }) => {
                    return <TextField
                      {...field}
                      label="Password"
                      fullWidth
                      helperText={errors.password}
                      error={!!errors.password}
                      value={values.password}
                    />;
                  }}
                />
                <div className={classes.buttons}>
                  <Button
                    color="secondary"
                    onClick={this.onCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Submit
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

Authentication.propTypes = {
  classes: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
};

export default withStyles(styles)(Authentication);
