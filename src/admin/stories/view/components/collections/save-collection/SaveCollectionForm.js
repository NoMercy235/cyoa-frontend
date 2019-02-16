import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './SaveCollection.css';
import { hasError } from '../../../../../../shared/components/form/helpers';

class SaveCollectionForm extends Component {
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
              fullWidth
              className={classes.name}
              value={formik.values.name}
              {...hasError(formik, 'name')}
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

SaveCollectionForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(SaveCollectionForm);
