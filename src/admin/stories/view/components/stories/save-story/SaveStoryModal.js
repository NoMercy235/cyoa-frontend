import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { inject } from 'mobx-react';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar from '../../../../../../shared/components/snackbar/Snackbar';
import { styles } from './SaveStory.css';
import SaveStoryForm from './SaveStoryForm';
import { storyStorePropTypes } from '../../../../stores/StoryStore';
import { withSnackbar } from '../../../../../../shared/components/form/helpers';
import { storyService } from '../../../../../../infrastructure/services/StoryService';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { TagModel } from '../../../../../../infrastructure/models/TagModel';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

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
    if (story.fromCollection === this.props.storyStore.getSelectedCollection) {
      this.props.storyStore.addStory(story);
    }
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

  getInitialValues = () => {
    return this.props.story ||
      new StoryModel({ fromCollection: this.props.storyStore.getSelectedCollection });
  };

  onClose = (resetForm) => () => {
    resetForm(this.getInitialValues());
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, resetForm }) => {
    values.tagsName = TagModel.get()
      .filter(
        tt => values.tags.find(t => tt._id === t)
      )
      .map(tt => tt.name);
    try {
      if (values._id) {
        await this.updateStory(values);
      } else {
        await this.saveStory(values);
      }
      this.onClose(resetForm)();
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new StoryModel(values);
    return model.checkErrors();
  };

  renderForm = formik => {
    const { classes, storyStore, open } = this.props;
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
          <SaveStoryForm
            formik={formik}
            onClose={this.onClose(formik.resetForm)}
            collections={storyStore.collections}
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
  };

  render() {
    const { open, message, variant } = this.state;

    return (
      <Fragment>
        <Formik
          enableReinitialize={true}
          initialValues={this.getInitialValues()}
          validateOnChange={false}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
        <Snackbar
          open={open}
          onClose={this.onChangeState({ open: false })}
          message={message}
          variant={variant}
        />
      </Fragment>
    );
  }
}

SaveStoryModal.propTypes = {
  classes: PropTypes.object,
  story: PropTypes.instanceOf(StoryModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyStore: storyStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(SaveStoryModal);
