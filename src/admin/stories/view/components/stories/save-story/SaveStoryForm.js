import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { withStyles, Switch, Typography, TextField } from '@material-ui/core';

import Select from '../../../../../../shared/components/form/Select/Select';
import { TagModel } from '../../../../../../infrastructure/models/TagModel';
import { CollectionModel } from '../../../../../../infrastructure/models/CollectionModel';
import FileSelect from '../../../../../../shared/components/form/FileSelect/FileSelect';

import { styles } from './SaveStory.css';
import { hasError } from '../../../../../../shared/formUtils';

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
    const collections = this.getCollections();
    return (
      <Select
        className={classes.fromCollection}
        formikField={field}
        label="Collection"
        fullWidth
        items={collections}
        disabled={!collections.length}
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

  renderIsAvailableOfflineField = ({ field }) => {
    const { formik: { values } } = this.props;
    return (
      <Switch
        {...field}
        checked={values.isAvailableOffline}
        value={values.isAvailableOffline}
        disabled={!!values._id}
      />
    );
  };

  renderIsAvailableOfflineInfo = () => {
    const { formik } = this.props;

    return !!formik.values._id && (
      <i>
        <Typography
          variant="caption"
          color="secondary"
        >
          (cannot edit)
        </Typography>
      </i>
    );
  };

  renderIsAvailableOfflineWarning = () => {
    const { formik: { values } } = this.props;

    return values.isAvailableOffline && !values._id && (
      <Typography
        variant="caption"
        color="secondary"
      >
        Warning. If the story is available offline, you will not be able to add attributes to it (the story will not have a player) and the actions (options) chosen by the reader cannot have consequences.
      </Typography>
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
    const { classes, collections } = this.props;

    return (
      <Form noValidate>
        <div className={classes.firstRowContainer}>
          <Field
            name="tags"
            required
            render={this.renderTagsField}
          />
          {!!collections.length && (
            <Field
              name="fromCollection"
              render={this.renderCollectionField}
            />
          )}
        </div>
        <Field
          name="name"
          required
          render={this.renderNameField}
        />
        <Typography
          className={classes.isAvailableOfflineContainer}
          variant="inherit"
          color="inherit"
          noWrap
        >
          Make this story available offline?
          <Field
            name="isAvailableOffline"
            render={this.renderIsAvailableOfflineField}
          />
          {this.renderIsAvailableOfflineInfo()}
        </Typography>
        {this.renderIsAvailableOfflineWarning()}
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
