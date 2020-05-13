import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Divider, Drawer } from '@material-ui/core';
import { Formik } from 'formik';

import SaveSequenceForm from '../../sequences/save-sequence/SaveSequenceForm';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { NEW_SEQUENCE_POSITION } from '../../../../../../shared/constants/graph';

import styles from './SaveGraphSequence.module.scss';
import notFoundImg from '../../../../../../assets/notfound.png';

const computeIsStartSeq = (story, seqId) => {
  return !story.startSeq || story.startSeq === seqId;
};

class SaveGraphSequence extends Component {
  getInitialValues = () => {
    const { sequence, story } = this.props;
    const resource = sequence || new SequenceModel({ story: story._id });
    // This was done because the isStartSeq property is not located on
    // the sequence, but on the story, thus it couldn't have been
    // loaded correctly while editing in any other way.
    resource.isStartSeq = computeIsStartSeq(story, resource._id);
    resource.scenePic = resource.scenePic || notFoundImg;
    return resource;
  };

  onSubmit = async (values, { setSubmitting, resetForm }) => {
    const { sequence, onSuccess, onDrawerClose } = this.props;
    try {
      if (values._id && values.scenePic === sequence.scenePic) {
        delete values.scenePic;
      }
      if (!values.x && !values.y) {
        Object.assign(values, NEW_SEQUENCE_POSITION);
      }

      const { isStartSeq, ...newSequence } = values;

      await onSuccess(newSequence, isStartSeq);
      resetForm();
      onDrawerClose();
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new SequenceModel(values);
    return model.checkErrors();
  };

  renderForm = formik => {
    const { story, onDrawerClose } = this.props;

    return (
      <div className={styles.formContainer}>
        <SaveSequenceForm
          formik={formik}
          isStartSeq={computeIsStartSeq(story, formik.initialValues._id)}
          chapters={[]}
        />
        <Divider/>
        <div className={styles.buttons}>
          <BasicFormActions
            formik={formik}
            onClose={onDrawerClose}
          />
        </div>
      </div>
    );
  };

  render () {
    const { open, onDrawerClose } = this.props;

    return (
      <Drawer
        anchor="top"
        open={open}
        onClose={onDrawerClose}
      >
        {open && <Formik
          enableReinitialize={true}
          initialValues={this.getInitialValues()}
          validateOnChange={false}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>}
      </Drawer>
    );
  }
}

SaveGraphSequence.propTypes = {
  open: PropTypes.bool.isRequired,
  story: PropTypes.instanceOf(StoryModel),
  sequence: PropTypes.instanceOf(SequenceModel),

  onSuccess: PropTypes.func.isRequired,
  onDrawerClose: PropTypes.func.isRequired,
};

export default SaveGraphSequence;
