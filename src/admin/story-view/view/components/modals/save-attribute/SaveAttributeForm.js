import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import { styles } from './SaveAttribute.css';
import { hasError } from '../../../../../../shared/components/form/helpers';

class SaveAttributeForm extends Component {
  render() {
    const { formik, classes } = this.props;

    return (
      <Form noValidate>
        <Field
          name="name"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              label="Name"
              className={classes.name}
              value={formik.values.name}
              {...hasError(formik, 'name')}
            />;
          }}
        />
        <Field
          name="startValue"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              label="Start value"
              type="number"
              className={classes.startValue}
              value={formik.values.startValue}
              {...hasError(formik, 'startValue')}
            />;
          }}
        />
        <Field
          name="description"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              type="text"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formik.values.description}
              {...hasError(formik, 'description')}
            />;
          }}
        />
      </Form>
    );
  }
}

SaveAttributeForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(SaveAttributeForm);
