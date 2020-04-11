import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { TextField } from '@material-ui/core';

import { hasError } from '../../../../../../shared/formUtils';

class SaveCollectionForm extends Component {
  renderNameField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        label="Name"
        fullWidth
        value={formik.values.name}
        {...hasError(formik, 'name')}
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
    return (
      <Form noValidate>
        <Field
          name="name"
          required
          render={this.renderNameField}
        />
        <Field
          name="description"
          required
          render={this.renderDescriptionField}
        />
      </Form>
    );
  }
}

SaveCollectionForm.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default SaveCollectionForm;
