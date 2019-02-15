import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import Select from '../../../../../../shared/components/form/Select';
import { styles } from './SaveStory.css';
import { hasError } from '../../../../../../shared/components/form/helpers';
import { TagModel } from '../../../../../../shared/domain/models/TagModel';
import { CollectionModel } from '../../../../../../infrastructure/models/CollectionModel';
import FileSelect from '../../../../../../shared/components/form/FileSelect/FileSelect';

class SaveStoryForm extends Component {
  tags = TagModel.get();

  getCollections() {
    return this.props.collections.map(c => {
      return { _id: c._id, name: c.name };
    });
  }

  onFileUploaded = base64File => {
    this.props.formik.setFieldValue('coverPic', base64File);
  };

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
            render={({ field }) => {
              return (
                <Select
                  className={classes.fromCollection}
                  formikField={field}
                  label="Collection"
                  fullWidth
                  items={this.getCollections()}
                  {...hasError(formik, 'fromCollection')}
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
          name="shortDescription"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              type="text"
              label="Short description"
              fullWidth
              multiline
              rows={2}
              value={formik.values.shortDescription}
              {...hasError(formik, 'shortDescription')}
            />;
          }}
        />
        <Field
          name="longDescription"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              type="text"
              label="Long description"
              fullWidth
              multiline
              rows={5}
              value={formik.values.longDescription}
              {...hasError(formik, 'longDescription')}
            />;
          }}
        />

        <FileSelect
          className={classes.uploadBtn}
          label="Upload cover"
          onFileUploaded={this.onFileUploaded}
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
