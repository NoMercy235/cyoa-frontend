import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import { styles } from './SaveSequence.css';
import { hasError } from '../../../../../../shared/components/form/helpers';

class SaveSequenceForm extends Component {
  render() {
    const { formik } = this.props;

    return (
      <Form noValidate>
        <Field
          name="name"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              label="Name"
              fullWidth
              value={formik.values.name}
              {...hasError(formik, 'name')}
            />;
          }}
        />
        <Field
          name="content"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              type="text"
              label="Content"
              fullWidth
              multiline
              rows={10}
              value={formik.values.content}
              {...hasError(formik, 'content')}
            />;
          }}
        />
      </Form>
    );
  }
}

SaveSequenceForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(SaveSequenceForm);
