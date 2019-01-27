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
import { storyViewStorePropTypes } from '../../../../domain/stores/StoryViewStore';
import { SequenceModel } from '../../../../domain/models/SequenceModel';
import { sequenceService } from '../../../../domain/services/SequenceService';
import SaveSequenceForm from './SaveSequenceForm';
import SaveSequenceActions from './SaveSequenceActions';

@inject('storyViewStore')
class SaveSequenceModal extends Component {
  state = {
    // snackbar
    open: false,
    variant: 'success',
    message: '',
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  renderTitle() {
    return this.props.sequence ? 'Edit sequence' : 'Create sequence';
  }

  saveSequence = async values => {
    const sequence = await withSnackbar.call(
      this,
      sequenceService.save,
      [SequenceModel.forApi(values)],
      'Sequence saved!',
    );
    this.props.storyViewStore.addSequence(sequence);
  };

  updateSequence = async values => {
    const sequence = await withSnackbar.call(
      this,
      sequenceService.update,
      [values._id, SequenceModel.forApi(values)],
      'Sequence updated!',
    );
    this.props.storyViewStore.updateSequence(values._id, sequence);
  };

  getInitialValues = () => {
    return this.props.sequence || new SequenceModel();
  };

  onClose = (resetForm) => () => {
    resetForm(this.getInitialValues());
    this.props.onClose();
  };

  render() {
    const { open, classes } = this.props;

    return (
      <Fragment>
        <Formik
          initialValues={this.getInitialValues()}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              if (values._id) {
                await this.updateSequence(values);
              } else {
                await this.saveSequence(values);
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
                    onClose={this.onClose(formik.resetForm)}
                  />
                </DialogContent>
                <DialogActions>
                  <SaveSequenceActions
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
  classes: PropTypes.object,
  sequence: PropTypes.instanceOf(SequenceModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(SaveSequenceModal);
