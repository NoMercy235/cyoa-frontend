import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import Select from '../../../../../../shared/components/form/Select';
import { styles } from './SaveStory.css';
import { hasError } from '../../../../../../shared/components/form/helpers';
import { TagModel } from '../../../../../../shared/domain/models/TagModel';

class SaveStoryForm extends Component {
  tags = TagModel.get();

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
                value={formik.values.name}
                {...hasError(formik, 'name')}
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
                  items={this.tags}
                  {...hasError(formik, 'tags')}
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
              value={formik.values.description}
              {...hasError(formik, 'description')}
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
