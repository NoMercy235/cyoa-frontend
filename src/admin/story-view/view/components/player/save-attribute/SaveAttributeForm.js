import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { withStyles, TextField, Checkbox, Typography } from '@material-ui/core';

import FormikAutocompleteContainer
  from '../../../../../../shared/components/form/Autocomplete/FormikAutocompleteContainer';

import { styles } from './SaveAttribute.css';
import { hasError } from '../../../../../../shared/utils/formUtils';

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
        value={formik.values.isImportant}
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

  renderLinkedEndingField = ({ field }) => {
    const { formik, onSequenceSearch } = this.props;
    return (
      <FormikAutocompleteContainer
        formik={formik}
        field={field}
        label="Associated ending"
        placeholder="Search for sequences"
        searchOnFocus={true}
        onSearchRequest={onSequenceSearch}
      />
    );
  };

  renderLinkedEndingFormikField = () => {
    const { formik } = this.props;

    if (!formik.values.isImportant) return null;

    return (
      <Field
        name="linkedEnding"
        render={this.renderLinkedEndingField}
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
          variant="inherit"
          color="inherit"
          noWrap
        >
          Is important?
          <Field
            name="isImportant"
            render={this.renderIsImportantField}
          />
        </Typography>
        {this.renderLinkedEndingFormikField()}
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
  onSequenceSearch: PropTypes.func.isRequired,
};

export default withStyles(styles)(SaveAttributeForm);
