import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { withStyles, Button, Checkbox, TextField, Typography } from '@material-ui/core';

import { hasError } from '../../../../../../shared/components/form/helpers';
import FileSelect from '../../../../../../shared/components/form/FileSelect/FileSelect';
import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';
import Select from '../../../../../../shared/components/form/Select/Select';

import { styles } from './SaveSequence.css';

class SaveSequenceForm extends Component {
  state = {
    renderViewImage: this.props.formik.values.hasScenePic,
    scenePic: '',
  };

  getChapters = () => {
    return this.props.chapters.map(c => {
      return { _id: c._id, name: c.name };
    });
  };

  onFileUploaded = base64File => {
    this.props.formik.setFieldValue('scenePic', base64File);
  };

  getSequence = async () => {
    const seq = await this.props.getSequence();
    this.setState({
      renderViewImage: false,
      scenePic: seq.scenePic,
    });
  };

  renderViewImage = () => {
    const { classes } = this.props;
    return (
      <Button
        className={classes.uploadBtn}
        variant="contained"
        component="span"
        onClick={this.getSequence}
      >
        View image
      </Button>
    );
  };

  renderSelectImage = () => {
    const { classes } = this.props;
    return (
      <FileSelect
        className={classes.uploadBtn}
        label="Upload scene picture"
        onFileUploaded={this.onFileUploaded}
        initialPreview={this.state.scenePic}
      />
    );
  };

  renderChapterField = ({ field }) => {
    const { formik, classes } = this.props;
    const chapters = this.getChapters();
    return (
      <Select
        className={classes.chapterField}
        formikField={field}
        label="Chapter"
        fullWidth
        items={chapters}
        disabled={!chapters.length}
        {...hasError(formik, 'chapter')}
      />
    );
  };

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

  renderIsStartSeqField = ({ field }) => {
    const { formik, isStartSeq } = this.props;
    return (
      <Checkbox
        {...field}
        disabled={isStartSeq}
        checked={formik.values.isStartSeq}
        value=""
      />
    );
  };

  renderIsEndingField = ({ field }) => {
    const { formik } = this.props;
    return (
      <Checkbox
        {...field}
        checked={formik.values.isEnding}
        value=""
      />
    );
  };

  renderContentField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        type="text"
        label="Content"
        fullWidth
        multiline
        rows={10}
        value={formik.values.content}
        {...hasError(formik, 'content')}
      />
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <Form noValidate>
        <Field
          name="chapter"
          required
          render={this.renderChapterField}
        />
        <Field
          name="name"
          required
          render={this.renderNameField}
        />
        <Typography
          className={classes.isStartSeqContainer}
          variant="inherit"
          color="inherit"
          noWrap
        >
          Start the story with this sequence?
          <Field
            name="isStartSeq"
            render={this.renderIsStartSeqField}
          />
        </Typography>
        <Typography
          className={classes.isStartSeqContainer}
          variant="inherit"
          color="inherit"
          noWrap
        >
          Is this an ending sequence?
          <Field
            name="isEnding"
            render={this.renderIsEndingField}
          />
        </Typography>
        <Field
          name="content"
          required
          render={this.renderContentField}
        />

        {this.state.renderViewImage
          ? this.renderViewImage()
          : this.renderSelectImage()
        }
      </Form>
    );
  }
}

SaveSequenceForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  isStartSeq: PropTypes.bool.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.instanceOf(ChapterModel)).isRequired,
  getSequence: PropTypes.func.isRequired,
};

export default withStyles(styles)(SaveSequenceForm);
