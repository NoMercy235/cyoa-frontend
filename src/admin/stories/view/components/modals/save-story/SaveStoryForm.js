import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import Select from '../../../../../../shared/components/form/Select';
import { styles } from './SaveStory.css';
import { hasError } from '../../../../../../shared/components/form/helpers';
import { TagModel } from '../../../../../../shared/domain/models/TagModel';
import { CollectionModel } from '../../../../domain/models/CollectionModel';

class SaveStoryForm extends Component {
  tags = TagModel.get();

  getCollections() {
    return this.props.collections.map(c => {
      return { _id: c._id, name: c.name };
    });
  }

  render() {
    const { formik, classes } = this.props;

    return (
      <Form noValidate>
        <div className={classes.firstRowContainer}>
          <Field
            name="tags"
            required
            render={({ field }) => {
              return (
                <Select
                  className={classes.tags}
                  formikField={field}
                  label="Tags"
                  items={this.tags}
                  multiple={true}
                  {...hasError(formik, 'tags')}
                />
              );
            }}
          />
          <Field
            name="fromCollection"
            required
            render={({ field }) => {
              return (
                <Select
                  className={classes.fromCollection}
                  formikField={field}
                  label="Collection"
                  fullWidth
                  items={this.getCollections()}
                  {...hasError(formik, 'tags')}
                />
              );
            }}
          />
        </div>
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

SaveStoryForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  collections: PropTypes.arrayOf(PropTypes.shape(CollectionModel)),
};

export default withStyles(styles)(SaveStoryForm);
