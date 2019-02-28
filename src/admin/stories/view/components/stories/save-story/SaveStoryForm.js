import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import Select from '../../../../../../shared/components/form/Select/Select';
import { styles } from './SaveStory.css';
import { hasError } from '../../../../../../shared/components/form/helpers';
import { TagModel } from '../../../../../../infrastructure/models/TagModel';
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

  renderTagsField = ({ field }) => {
    const { formik, classes } = this.props;
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
  };

  renderCollectionField = ({ field }) => {
    const { formik, classes } = this.props;
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
  };

  renderNameField = ({ field }) => {
    const { formik, classes } = this.props;
    return (
      <TextField
        {...field}
        label="Name"
        fullWidth
        className={classes.name}
        value={formik.values.name}
        {...hasError(formik, 'name')}
      />
    );
  };

  renderShortDescriptionField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="text"
        label="Short description"
        fullWidth
        multiline
        rows={2}
        value={formik.values.shortDescription}
        {...hasError(formik, 'shortDescription')}
      />
    );
  };

  renderLongDescriptionField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="text"
        label="Long description"
        fullWidth
        multiline
        rows={5}
        value={formik.values.longDescription}
        {...hasError(formik, 'longDescription')}
      />
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <Form noValidate>
        <div className={classes.firstRowContainer}>
          <Field
            name="tags"
            required
            render={this.renderTagsField}
          />
          <Field
            name="fromCollection"
            render={this.renderCollectionField}
          />
        </div>
        <Field
          name="name"
          required
          render={this.renderNameField}
        />
        <Field
          name="shortDescription"
          required
          render={this.renderShortDescriptionField}
        />
        <Field
          name="longDescription"
          required
          render={this.renderLongDescriptionField}
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
  collections: PropTypes.arrayOf(PropTypes.instanceOf(CollectionModel)),
};

export default withStyles(styles)(SaveStoryForm);
