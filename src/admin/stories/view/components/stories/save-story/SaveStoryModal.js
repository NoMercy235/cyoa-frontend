import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Formik } from 'formik';
import { inject } from 'mobx-react';

import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import SaveStoryForm from './SaveStoryForm';
import { storyStorePropTypes } from '../../../../stores/StoryStore';
import { storyService } from '../../../../../../infrastructure/services/StoryService';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { TagModel } from '../../../../../../infrastructure/models/TagModel';
import { Dialog } from '../../../../../../shared/components/dialog/Dialog';
import { appStorePropTypes } from '../../../../../../shared/store/AppStore';
import { handleConflictError } from '../../../../../../shared/utils/formUtils';

import { styles } from './SaveStory.css';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

@inject('storyStore', 'appStore')
class SaveStoryModal extends Component {
  renderTitle() {
    return this.props.story ? 'Edit story' : 'Create story';
  }

  saveStory = async values => {
    const story = await storyService.save(StoryModel.forApi(values));
    this.props.appStore.showSuccessSnackbar({
      message: 'Story saved!',
    });
    return story;
  };

  updateStory = async values => {
    const { storyStore, appStore } = this.props;
    const story = await storyService.update(
      values._id,
      StoryModel.forApi(values)
    );
    appStore.showSuccessSnackbar({
      message: 'Story saved!',
    });
    storyStore.updateStory(values._id, story);
    return story;
  };

  getInitialValues = () => {
    const { story, storyStore: { selectedCollection: fromCollection } } = this.props;
    return story || new StoryModel({ fromCollection });
  };

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, setErrors }) => {
    const { onSuccess } = this.props;

    values.tagsName = TagModel.get()
      .filter(
        tt => values.tags.find(t => tt._id === t)
      )
      .map(tt => tt.name);
    try {
      const story = values._id
        ? await this.updateStory(values)
        : await this.saveStory(values);
      onSuccess && await onSuccess(story);
      setSubmitting(false);
      this.onClose();
    } catch (e) {
      setSubmitting(false);
      setErrors(handleConflictError(e));
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
        onClose={this.onClose}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle
          onClose={this.onClose}
        >
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent>
          <SaveStoryForm
            formik={formik}
            onClose={this.onClose}
            collections={storyStore.collections}
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
      </>
    );
  }
}

SaveStoryModal.propTypes = {
  classes: PropTypes.object,
  story: PropTypes.instanceOf(StoryModel),
  open: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  storyStore: storyStorePropTypes,
  appStore: appStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(SaveStoryModal);
