import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar from '../../../../../../shared/components/snackbar/Snackbar';
import { styles } from './SaveSequence.css';
import { inject } from 'mobx-react';
import { withSnackbar } from '../../../../../../shared/components/form/helpers';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { sequenceService } from '../../../../../../infrastructure/services/SequenceService';
import SaveSequenceForm from './SaveSequenceForm';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { storyService } from '../../../../../../infrastructure/services/StoryService';
import { withRouter } from 'react-router-dom';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';

@inject('storyViewStore')
class SaveSequenceModal extends Component {
  state = {
    // snackbar
    open: false,
    variant: 'success',
    message: '',
  };

  getSequence = async () => {
    const params = { ':story': this.props.story._id };
    sequenceService.setNextRouteParams(params);
    return await sequenceService.get(this.props.sequence._id);
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  renderTitle() {
    return this.props.sequence ? 'Edit sequence' : 'Create sequence';
  }

  sendRequest = async (values, method, args, message) => {
    const params = { ':story': this.props.story._id };
    sequenceService.setNextRouteParams(params);
    return await withSnackbar.call(
      this, method, args, message,
    );
  };

  saveSequence = async values => {
    const sequence = await this.sendRequest(
      values,
      sequenceService.save,
      [SequenceModel.forApi(values)],
      'Sequence saved!',
    );
    this.props.storyViewStore.addSequence(sequence);
    return sequence;
  };

  updateSequence = async values => {
    const sequence = await this.sendRequest(
      values,
      sequenceService.update,
      [values._id, SequenceModel.forApi(values)],
      'Sequence updated!',
    );
    this.props.storyViewStore.updateSequence(values._id, sequence);
    return sequence;
  };

  updateStoryStartSeq = async seq => {
    storyService.update(this.props.match.params.id, { startSeq: seq._id });
    // This does trigger the render function a second time (after the
    // update or addition of a new sequence) but it shouldn't affect
    // performance as there are not many things rendered and this
    // method should not be called often.
    this.props.storyViewStore.updateCurrentStory(
      { startSeq: seq._id }
    );
  };

  getInitialValues = () => {
    const resource = this.props.sequence || new SequenceModel();
    // This was done because the isStartSeq property is not located on
    // the sequence, but on the story, thus it couldn't have been
    // loaded correctly while editing in any other way.
    resource.isStartSeq = this.props.isStartSeq;
    return resource;
  };

  onClose = (resetForm) => () => {
    resetForm(this.getInitialValues());
    this.props.onClose();
  };

  render() {
    const { open, classes, sequence } = this.props;

    return (
      <Fragment>
        <Formik
          initialValues={this.getInitialValues()}
          validateOnChange={false}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              let seq = {};
              if (values._id) {
                // Don't send the scenePic on request if it hasn't been changed.
                if (values.scenePic === sequence.scenePic) {
                  delete values.scenePic;
                }
                seq = await this.updateSequence(values);
              } else {
                seq = await this.saveSequence(values);
              }

              if (values.isStartSeq) {
                await this.updateStoryStartSeq(seq);
              }

              this.onClose(resetForm)();
            } finally {
              setSubmitting(false);
            }
          }}
          validate={values => {
            const model = new SequenceModel(values);
            return model.checkErrors();
          }}
        >
          {formik => {
            return (
              <Dialog
                open={open}
                onClose={this.onClose(formik.resetForm)}
                classes={{ paper: classes.dialogSize }}
              >
                <DialogTitle
                  onClose={this.onClose(formik.resetForm)}
                >
                  {this.renderTitle()}
                </DialogTitle>
                <DialogContent>
                  <SaveSequenceForm
                    formik={formik}
                    isStartSeq={this.props.isStartSeq}
                    getSequence={this.getSequence}
                  />
                </DialogContent>
                <DialogActions>
                  <BasicFormActions
                    formik={formik}
                    onClose={this.onClose(formik.resetForm)}
                  />
                </DialogActions>
              </Dialog>
            );
          }}
        </Formik>
        <Snackbar
          open={this.state.open}
          onClose={this.onChangeState({ open: false })}
          message={this.state.message}
          variant={this.state.variant}
        />
      </Fragment>
    );
  }
}

SaveSequenceModal.propTypes = {
  match: PropTypes.object,
  classes: PropTypes.object,
  story: PropTypes.instanceOf(StoryModel).isRequired,
  isStartSeq: PropTypes.bool.isRequired,
  sequence: PropTypes.instanceOf(SequenceModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(
  withRouter(SaveSequenceModal),
);
