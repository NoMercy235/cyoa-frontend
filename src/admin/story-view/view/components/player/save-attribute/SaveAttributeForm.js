import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { withStyles, TextField } from '@material-ui/core';

import { hasError } from '../../../../../../shared/components/form/helpers';

import { styles } from './SaveAttribute.css';

class SaveAttributeForm extends Component {
  renderNameField = ({ field }) => {
    const { formik, classes } = this.props;
    return (
      <TextField
        {...field}
        label="Name"
        className={classes.name}
        value={formik.values.name}
        {...hasError(formik, 'name')}
      />
    );
  };

  renderStartValueField = ({ field }) => {
    const { formik, classes } = this.props;
    return (
      <TextField
        {...field}
        label="Start value"
        type="number"
        className={classes.startValue}
        value={formik.values.startValue}
        {...hasError(formik, 'startValue')}
      />
    );
  };

  renderDescriptionField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="text"
        label="Description"
        fullWidth
        multiline
        rows={3}
        value={formik.values.description}
        {...hasError(formik, 'description')}
      />
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <Form noValidate>
        <div className={classes.firstRowContainer}>
          <Field
            name="name"
            required
            render={this.renderNameField}
          />
          <Field
            name="startValue"
            required
            render={this.renderStartValueField}
          />
        </div>
        <Field
          name="description"
          required
          render={this.renderDescriptionField}
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
