import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Dialog } from '@material-ui/core';
import { Formik } from 'formik';
import { inject } from 'mobx-react';
import classNames from 'classnames';

import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { optionService } from '../../../../../../infrastructure/services/OptionService';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import SaveOptionForm from './SaveOptionForm';
import { ConsequenceModel } from '../../../../../../infrastructure/models/ConsequenceModel';
import { appStorePropTypes } from '../../../../../../shared/store/AppStore';
import { getDebouncedSequences } from '../../../../../../shared/utils/sequencesUtils';

import { styles } from './SaveOption.css';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';
import { handleConflictError } from '../../../../../../shared/utils/formUtils';

@inject('storyViewStore', 'appStore')
class SaveOptionModal extends Component {
  onSearchRequest = async (searchQuery) => {
    const { storyViewStore: { currentStory: { _id: storyId } } } = this.props;
    return (await getDebouncedSequences(storyId, searchQuery))
      .map(s => ({ value: s._id, label: s.name }));
  };

  renderTitle() {
    return this.props.option ? 'Edit option' : 'Create option';
  }

  setParams = () => {
    const params = { ':sequence': this.props.sequenceId };
    optionService.setNextRouteParams(params);
  };

  saveOption = async values => {
    this.setParams();
    const { sequenceId, storyViewStore, appStore } = this.props;
    const option = await optionService.save(OptionModel.forApi(values));
    storyViewStore.addOptionToSequence(sequenceId, option);
    appStore.showSuccessSnackbar({
      message: 'Option saved!'
    });
  };

  updateOption = async values => {
    this.setParams();
    const { sequenceId, storyViewStore, appStore } = this.props;
    const option = await optionService.update(values._id, OptionModel.forApi(values));
    storyViewStore.updateOption(sequenceId, values._id, option);
    appStore.showSuccessSnackbar({
      message: 'Option saved!'
    });
  };

  getInitialValues = () => {
    const { option, storyViewStore } = this.props;

    // Here we don't need any parsing, because, by default, the nextSeq's value is an
    // empty string and that's a valid value.
    return option
      ? option
      : new OptionModel(
        {
          story: storyViewStore.currentStory._id,
          consequences: storyViewStore.currentStory.isAvailableOffline
            ? []
            : [new ConsequenceModel()],
        },
        { withFormikId: true },
      );
  };

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (values._id) {
        await this.updateOption(values);
      } else {
        await this.saveOption(values);
      }
      setSubmitting(false)
      this.onClose();
    } catch (e) {
      setErrors(handleConflictError(e));
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new OptionModel(values);
    return model.checkErrors();
  };

  renderForm = formik => {
    const { classes, storyViewStore, open } = this.props;

    return (
      <Dialog
        open={open}
        onClose={this.onClose}
        classes={{
          paper: classNames(classes.dialogSize, classes.saveOptionDialog),
        }}
        maxWidth="xl"
      >
        <DialogTitle
          onClose={this.onClose}
        >
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent>
          <SaveOptionForm
            formik={formik}
            story={storyViewStore.currentStory}
            attributes={storyViewStore.attributes}
            onSearchRequest={this.onSearchRequest}
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
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
      </>
    );
  }
}

SaveOptionModal.propTypes = {
  classes: PropTypes.object,
  option: PropTypes.instanceOf(OptionModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sequenceId: PropTypes.string.isRequired,
  storyViewStore: storyViewStorePropTypes,
  appStore: appStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(SaveOptionModal);
