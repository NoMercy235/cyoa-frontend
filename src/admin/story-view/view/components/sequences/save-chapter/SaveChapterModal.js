import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar from '../../../../../../shared/components/snackbar/Snackbar';
import { styles } from './SaveChapter.css';
import { inject } from 'mobx-react';
import { withSnackbar } from '../../../../../../shared/components/form/helpers';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import { chapterService } from '../../../../../../infrastructure/services/ChapterService';
import SaveChapterForm from './SaveChapterForm';

@inject('storyViewStore')
class SaveChapterModal extends Component {
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
    return this.props.chapter ? 'Edit chapter' : 'Create chapter';
  }

  refreshChapters = async () => {
    const newChapters = await chapterService.list();
    this.props.storyViewStore.setChapters(newChapters);
  };

  saveChapter = async values => {
    await withSnackbar.call(
      this,
      chapterService.save,
      [ChapterModel.forApi(values)],
      'Chapter saved!',
    );
    await this.refreshChapters();
  };

  updateChapter = async values => {
    await withSnackbar.call(
      this,
      chapterService.update,
      [values._id, ChapterModel.forApi(values, ['_id'])],
      'Chapter updated!',
    );
    await this.refreshChapters();
  };

  getInitialValues = () => {
    return this.props.chapter || new ChapterModel();
  };

  onClose = (resetForm) => () => {
    resetForm(this.getInitialValues());
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (values._id) {
        await this.updateChapter(values);
      } else {
        await this.saveChapter(values);
      }
      this.onClose(resetForm)();
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

  render() {
    const { open, message, variant } = this.state;

    return (
      <Fragment>
        <Formik
          enableReinitialize={true}
          initialValues={this.getInitialValues()}
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

SaveChapterModal.propTypes = {
  classes: PropTypes.object,
  chapter: PropTypes.instanceOf(ChapterModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(SaveChapterModal);
