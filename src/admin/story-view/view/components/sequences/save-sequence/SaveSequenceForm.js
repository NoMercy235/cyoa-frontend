import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';
import { withStyles, Button } from '@material-ui/core';

import FileSelect from '../../../../../../shared/components/form/FileSelect/FileSelect';
import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';
import { renderCheckboxInput, renderInput, renderSelectInput } from '../../../../../../shared/formUtils';

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

  render() {
    const { classes, formik, chapters, isStartSeq } = this.props;

    return (
      <Form noValidate>
        {!!chapters.length && renderSelectInput(formik, {
          label: 'Chapter',
          name: 'chapter',
          className: classes.chapterField,
          fullWidth: true,
          items: this.getChapters(),
        })}
        {renderInput(formik, {
          label: 'Name',
          name: 'name',
          fullWidth: true,
        })}
        {renderCheckboxInput(formik, {
          label: 'Start the story with this sequence?',
          name: 'isStartSeq',
          className: classes.checkboxFieldContainer,
          disabled: isStartSeq,
          defaultValue: isStartSeq,
        })}
        {renderCheckboxInput(formik, {
          label: 'Is this an ending sequence?',
          name: 'isEnding',
          className: classes.checkboxFieldContainer
        })}
        {renderInput(formik, {
          label: 'Content',
          name: 'content',
          fullWidth: true,
          textarea: { rows: 10 },
        })}

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
