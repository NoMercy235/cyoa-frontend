import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Dialog } from '@material-ui/core';
import { Formik } from 'formik';
import { inject } from 'mobx-react';

import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import { chapterService } from '../../../../../../infrastructure/services/ChapterService';
import SaveChapterForm from './SaveChapterForm';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';
import { appStorePropTypes } from '../../../../../../shared/store/AppStore';
import { stopEvent } from '../../../../../../shared/utilities';
import { handleConflictError } from '../../../../../../shared/utils/formUtils';

import { styles } from './SaveChapter.css';

@inject('storyViewStore', 'appStore')
class SaveChapterModal extends Component {
  mounted = false;

  renderTitle() {
    return this.props.chapter ? 'Edit chapter' : 'Create chapter';
  }

  refreshChapters = async () => {
    const newChapters = await chapterService.list();
    this.props.storyViewStore.setChapters(newChapters);
  };

  saveChapter = async values => {
    await chapterService.save(ChapterModel.forApi(values));
    this.props.appStore.showSuccessSnackbar({
      message: 'Chapter saved!',
    });
    await this.refreshChapters();
  };

  updateChapter = async values => {
    await chapterService.update(values._id, ChapterModel.forApi(values));
    this.props.appStore.showSuccessSnackbar({
      message: 'Chapter updated!',
    });
    await this.refreshChapters();
  };

  getInitialValues = () => {
    return this.props.chapter || new ChapterModel();
  };

  onClose = (resetForm) => event => {
    event && event.stopPropagation();
    if (!this.mounted) return;
    resetForm(this.getInitialValues());
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      if (values._id) {
        await this.updateChapter(values);
      } else {
        await this.saveChapter(values);
      }
      this.onClose(resetForm)();
    } catch (e) {
      setErrors(handleConflictError(e));
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new ChapterModel(values);
    return model.checkErrors();
  };

  renderForm = formik => {
    const { classes, open } = this.props;
    const { chapters } = this.props.storyViewStore;
    return (
      <Dialog
        open={open}
        onClick={stopEvent}
        onClose={this.onClose(formik.resetForm)}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle
          onClose={this.onClose(formik.resetForm)}
        >
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent>
          <SaveChapterForm
            formik={formik}
            chapters={chapters}
            onClose={this.onClose(formik.resetForm)}
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

  componentDidMount () {
    this.mounted = true;
    const params = { ':story': this.props.storyViewStore.currentStory._id };
    chapterService.setNextRouteParams(params);
  }

  componentWillUnmount () {
    this.mounted = false;
  }

  render() {
    return (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={this.getInitialValues()}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
      </>
    );
  }
}

SaveChapterModal.propTypes = {
  classes: PropTypes.object,
  chapter: PropTypes.instanceOf(ChapterModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyViewStore: storyViewStorePropTypes,
  appStore: appStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(SaveChapterModal);
