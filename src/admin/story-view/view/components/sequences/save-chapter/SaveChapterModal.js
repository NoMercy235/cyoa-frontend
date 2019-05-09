import React, { Component } from 'react';
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
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import { chapterService } from '../../../../../../infrastructure/services/ChapterService';
import SaveChapterForm from './SaveChapterForm';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

@inject('storyViewStore')
class SaveChapterModal extends Component {
  mounted = false;
  snackbarRef = React.createRef();

  renderTitle() {
    return this.props.chapter ? 'Edit chapter' : 'Create chapter';
  }

  refreshChapters = async () => {
    const newChapters = await chapterService.list();
    this.props.storyViewStore.setChapters(newChapters);
  };

  saveChapter = async values => {
    await this.snackbarRef.current.executeAndShowSnackbar(
      chapterService.save.bind(null, ChapterModel.forApi(values)),
      { variant: 'success', message: 'Chapter saved!' },
    );
    await this.refreshChapters();
  };

  updateChapter = async values => {
    await this.snackbarRef.current.executeAndShowSnackbar(
      chapterService.update.bind(
        null,
        values._id,
        ChapterModel.forApi(values, ['_id'])
      ),
      { variant: 'success', message: 'Chapter updated!' },
    );
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
        <Snackbar innerRef={this.snackbarRef}/>
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
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(SaveChapterModal);
