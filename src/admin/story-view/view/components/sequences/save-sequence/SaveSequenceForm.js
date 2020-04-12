import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';
import { withStyles } from '@material-ui/core';

import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';
import {
  arrayToSelectFieldOptions,
  renderCheckboxInput,
  renderInput,
  renderSelectInput
} from '../../../../../../shared/utils/formUtils';
import FilePicker from '../../../../../../shared/components/form/FileSelect/FilePicker';
import {
  MAX_SEQUENCE_SCENE_PIC_SIZE_MB,
  SEQUENCE_PICTURE_CROPPER_SIZE,
  SEQUENCE_PICTURE_PREVIEW_SIZE
} from '../../../../../../shared/constants/sequences';

import { styles } from './SaveSequence.css';

const compressOptions = {
  maxSizeMB: MAX_SEQUENCE_SCENE_PIC_SIZE_MB,
  maxWidthOrHeight: SEQUENCE_PICTURE_CROPPER_SIZE.height
};

class SaveSequenceForm extends Component {
  onFileUploaded = base64File => {
    this.props.formik.setFieldValue('scenePic', base64File);
  };

  renderSelectImage = () => {
    const { formik: { values: { scenePic } } } = this.props;
    return (
      <FilePicker
        inputId="sequence-picture"
        initialImage={scenePic}
        cropperProps={{
          size: SEQUENCE_PICTURE_PREVIEW_SIZE,
          cropperProps: {
            size: SEQUENCE_PICTURE_CROPPER_SIZE,
          }
        }}
        compressOptions={compressOptions}
        onFileSave={this.onFileUploaded}
      />
    );
  };

  render() {
    const { classes, formik, chapters, isStartSeq } = this.props;

    return (
      <Form noValidate>
        <div className={classes.formContainer}>
          <div className={classes.uploadBtn}>
            {this.renderSelectImage()}
          </div>
          <div className={classes.inputsContainer}>
            {!!chapters.length && renderSelectInput(formik, {
              label: 'Chapter',
              name: 'chapter',
              fullWidth: true,
              items: arrayToSelectFieldOptions(chapters),
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
          </div>
        </div>
      </Form>
    );
  }
}

SaveSequenceForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  isStartSeq: PropTypes.bool.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.instanceOf(ChapterModel)).isRequired,
};

export default withStyles(styles)(SaveSequenceForm);
