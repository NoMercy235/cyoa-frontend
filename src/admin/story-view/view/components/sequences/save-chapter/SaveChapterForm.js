import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { withStyles, TextField } from '@material-ui/core';

import Select from '../../../../../../shared/components/form/Select/Select';
import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';

import { styles } from './SaveChapter.css';
import { hasError } from '../../../../../../shared/utils/formUtils';

class SaveChapterForm extends Component {
  getChapters = () => {
    return this.props.chapters.map(c => {
      return { _id: c._id, name: c.name };
    });
  };

  renderParentChapterField = ({ field }) => {
    const { formik, classes } = this.props;
    return (
      <Select
        className={classes.parentChapter}
        formikField={field}
        label="Parent chapter"
        fullWidth
        items={this.getChapters()}
        {...hasError(formik, 'parentChapter')}
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
    // Parent chapter is flawed and this workflow will be reworked anyway
    // so I'm commenting this for now
    return (
      <Form noValidate>
        {/*<Field*/}
        {/*  name="parentChapter"*/}
        {/*  render={this.renderParentChapterField}*/}
        {/*/>*/}
        <Field
          name="name"
          required
          render={this.renderNameField}
        />
        <Field
          name="description"
          render={this.renderDescriptionField}
        />
      </Form>
    );
  }
}

SaveChapterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.instanceOf(ChapterModel)).isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(SaveChapterForm);
