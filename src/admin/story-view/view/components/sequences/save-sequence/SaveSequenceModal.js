import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Dialog } from '@material-ui/core';
import { Formik } from 'formik';
import { inject } from 'mobx-react';

import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar, { SnackbarEnum } from '../../../../../../shared/components/snackbar/Snackbar';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { sequenceService } from '../../../../../../infrastructure/services/SequenceService';
import SaveSequenceForm from './SaveSequenceForm';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { storyService } from '../../../../../../infrastructure/services/StoryService';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';

import { styles } from './SaveSequence.css';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

@inject('storyViewStore')
class SaveSequenceModal extends Component {
  snackbarRef = React.createRef();

  getSequence = async () => {
    const params = { ':story': this.props.story.id };
    sequenceService.setNextRouteParams(params);
    return await sequenceService.get(this.props.sequence.id);
  };

  renderTitle() {
    return this.props.sequence ? 'Edit sequence' : 'Create sequence';
  }

  sendRequest = async (method, args, message) => {
    const params = { ':story': this.props.story.id };
    sequenceService.setNextRouteParams(params);
    return await this.snackbarRef.current.executeAndShowSnackbar(
      method,
      args,
      { variant: SnackbarEnum.Variants.Success, message },
    );
  };

  saveSequence = async values => {
    return await this.sendRequest(
      sequenceService.save,
      [SequenceModel.forApi(values)],
      'Sequence saved!',
    );
  };

  updateSequence = async values => {
    const sequence = await this.sendRequest(
      sequenceService.update,
      [values.id, SequenceModel.forApi(values)],
      'Sequence updated!',
    );
    this.props.storyViewStore.updateSequence(values.id, sequence);
    return sequence;
  };

  updateStoryStartSeq = async seq => {
    const { storyViewStore, story } = this.props;
    storyService.update(story.id, { startSeq: seq.id });
    // This does trigger the render function a second time (after the
    // update or addition of a new sequence) but it shouldn't affect
    // performance as there are not many things rendered and this
    // method should not be called often.
    storyViewStore.updateCurrentStory(
      { startSeq: seq.id }
    );
  };

  getInitialValues = () => {
    const { sequence, selectedChapterId, isStartSeq } = this.props;
    const resource = sequence || new SequenceModel({ chapter: selectedChapterId });
    // This was done because the isStartSeq property is not located on
    // the sequence, but on the story, thus it couldn't have been
    // loaded correctly while editing in any other way.
    resource.isStartSeq = isStartSeq;
    return resource;
  };

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, resetForm }) => {
    const { story, sequence, onSuccess } = this.props;
    try {
      let seq = {};
      if (values.id) {
        // Don't send the scenePic on request if it hasn't been changed.
        if (values.scenePic === sequence.scenePic) {
          delete values.scenePic;
        }
        seq = await this.updateSequence(values);
      } else {
        seq = await this.saveSequence(values);
      }

      if (values.isStartSeq && story.startSeq !== values.id) {
        await this.updateStoryStartSeq(seq);
      }

      onSuccess && await onSuccess();
      resetForm();
      this.onClose();
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new SequenceModel(values);
    return model.checkErrors();
  };

  renderForm = formik => {
    const {
      classes,
      open,
      isStartSeq,
      storyViewStore: { chapters },
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={this.onClose}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle
          onClose={this.onClose}
        >
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent>
          <SaveSequenceForm
            formik={formik}
            isStartSeq={isStartSeq}
            chapters={chapters}
            getSequence={this.getSequence}
          />
        </DialogContent>
        <DialogActions>
          <BasicFormActions
            formik={formik}
            onClose={this.onClose}
          />
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    return (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={this.getInitialValues()}
          validateOnChange={false}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

SaveSequenceModal.propTypes = {
  classes: PropTypes.object,
  story: PropTypes.instanceOf(StoryModel).isRequired,
  selectedChapterId: PropTypes.string.isRequired,
  isStartSeq: PropTypes.bool.isRequired,
  sequence: PropTypes.instanceOf(SequenceModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(
  SaveSequenceModal,
);
