import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import Select from '../../../../../../shared/components/form/Select';
import { styles } from './SaveStory.css';


class SaveStoryForm extends Component {
  render() {
    const { formik, classes } = this.props;

    return (
      <Form noValidate>
        <div className={classes.firstRowContainer}>
          <Field
            name="name"
            required
            render={({ field }) => {
              return <TextField
                {...field}
                label="Name"
                className={classes.name}
                helperText={formik.errors.name}
                error={!!formik.errors.name}
                value={formik.values.name}
              />;
            }}
          />
          <Field
            name="tags"
            required
            render={({ field }) => {
              return (
                <Select
                  className={classes.tags}
                  formikField={field}
                  label="Tag"
                />
              );
            }}
          />
        </div>
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
              helperText={formik.errors.description}
              error={!!formik.errors.description}
              value={formik.values.description}
            />;
          }}
        />
      </Form>
    );
  }
}

SaveStoryForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(SaveStoryForm);
