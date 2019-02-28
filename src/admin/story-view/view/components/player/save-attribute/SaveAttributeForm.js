import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import { styles } from './SaveAttribute.css';
import { hasError } from '../../../../../../shared/components/form/helpers';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

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

  renderIsImportantField = ({ field }) => {
    const { formik } = this.props;
    return (
      <Checkbox
        {...field}
        checked={formik.values.isImportant}
        value=""
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
        <Typography
          className={classes.isImportantContainer}
          variant="inherit"
          color="inherit"
          noWrap
        >
          Is this an important attribute?
          <Field
            name="isImportant"
            render={this.renderIsImportantField}
          />
        </Typography>
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
