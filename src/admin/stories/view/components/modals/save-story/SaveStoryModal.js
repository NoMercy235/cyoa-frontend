import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { inject } from 'mobx-react';
import { StoryModel } from '../../../../domain/models/StoryModel';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar from '../../../../../../shared/components/snackbar/Snackbar';
import { styles } from './SaveStory.css';
import SaveStoryForm from './SaveStoryForm';
import SaveStoryActions from './SaveStoryActions';
import { storyStorePropTypes } from '../../../../domain/stores/StoryStore';
import { withSnackbar } from '../../../../../../shared/components/form/helpers';
import { storyService } from '../../../../domain/services/StoryService';

@inject('storyStore')
class SaveStoryModal extends Component {
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
    return this.props.story ? 'Edit story' : 'Create story';
  }

  saveStory = async values => {
    const story = await withSnackbar.call(
      this,
      storyService.save,
      [StoryModel.forApi(values)],
      'Story saved!',
    );
    this.props.storyStore.addStory(story);
  };

  updateStory = async values => {
    const story = await withSnackbar.call(
      this,
      storyService.update,
      [values._id, StoryModel.forApi(values)],
      'Story updated!',
    );
    this.props.storyStore.updateStory(values._id, story);
  };

  render() {
    const { open, onClose, classes, storyStore } = this.props;

    return (
      <Fragment>
        <Formik
          initialValues={this.props.story || new StoryModel()}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (values._id) {
                await this.updateStory(values);
              } else {
                await this.saveStory(values);
              }
              onClose();
            } finally {
              setSubmitting(false);
            }
          }}
          validate={values => {
            const model = new StoryModel(values);
            return model.checkErrors();
          }}
        >
          {formik => {
            return (
              <Dialog
                open={open}
                onClose={onClose}
                classes={{ paper: classes.dialogSize }}
              >
                <DialogTitle
                  onClose={onClose}
                >
                  {this.renderTitle()}
                </DialogTitle>
                <DialogContent>
                  <SaveStoryForm
                    formik={formik}
                    onClose={onClose}
                    collections={storyStore.collections}
                  />
                </DialogContent>
                <DialogActions>
                  <SaveStoryActions
                    formik={formik}
                    onClose={onClose}
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

SaveStoryModal.propTypes = {
  classes: PropTypes.object,
  story: PropTypes.shape(StoryModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyStore: storyStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(SaveStoryModal);
