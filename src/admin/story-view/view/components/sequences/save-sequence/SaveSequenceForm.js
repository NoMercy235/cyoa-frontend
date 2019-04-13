import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import { styles } from './SaveSequence.css';
import { hasError } from '../../../../../../shared/components/form/helpers';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FileSelect from '../../../../../../shared/components/form/FileSelect/FileSelect';
import Button from '@material-ui/core/Button';
import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';
import Select from '../../../../../../shared/components/form/Select/Select';

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
    return (
      <Select
        className={classes.chapterField}
        formikField={field}
        label="Chapter"
        fullWidth
        items={this.getChapters()}
        {...hasError(formik, 'chapter')}
      />
    );
  };

  renderAuthorNoteField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        label="Author's note"
        fullWidth
        value={formik.values.authorNote}
        {...hasError(formik, 'authorNote')}
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
          name="authorNote"
          required
          render={this.renderAuthorNoteField}
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
