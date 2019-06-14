import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Dialog } from '@material-ui/core';
import { Formik } from 'formik';
import { inject } from 'mobx-react';
import classNames from 'classnames';

import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar, { SnackbarEnum } from '../../../../../../shared/components/snackbar/Snackbar';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { optionService } from '../../../../../../infrastructure/services/OptionService';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import SaveOptionForm from './SaveOptionForm';
import { ConsequenceModel } from '../../../../../../infrastructure/models/ConsequenceModel';
import { debounced } from '../../../../../../shared/utilities';
import { sequenceService } from '../../../../../../infrastructure/services/SequenceService';

import { styles } from './SaveOption.css';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

const debouncedSequenceList = debounced(sequenceService.list);

@inject('storyViewStore')
class SaveOptionModal extends Component {
  snackbarRef = React.createRef();

  onSearchRequest = async (searchQuery) => {
    sequenceService.setNextRouteParams(
      { ':story': this.props.storyViewStore.currentStory._id }
    );
    return (await debouncedSequenceList({
      name: {
        op: 'ilike',
        value: searchQuery,
        options: {
          allowEmpty: true,
        },
      },
    })).map(s => {
      return { value: s._id, label: s.name };
    });
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
    const option = await this.snackbarRef.current.executeAndShowSnackbar(
      optionService.save,
      [OptionModel.forApi(values)],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Option saved!',
      }
    );
    this.props.storyViewStore.addOptionToSequence(
      this.props.sequenceId,
      option
    );
  };

  updateOption = async values => {
    this.setParams();
    const option = await this.snackbarRef.current.executeAndShowSnackbar(
      optionService.update,
      [values._id, OptionModel.forApi(values)],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Option updated!',
      }
    );
    this.props.storyViewStore.updateOption(
      this.props.sequenceId,
      values._id,
      option
    );
  };

  getInitialValues = () => {
    const { option, storyViewStore } = this.props;

    if (option) {
      // The nextSeq is populated on the list request, but it's not in the
      // format expected by the Autocomplete component. Here we parse it to that format
      return Object.assign(
        {},
        option,
        {
          // If there is no nextSeq, then it has been deleted at some point
          // We will require the user to select another one.
          nextSeq: option.nextSeq
            ? {
              value: option.nextSeq._id,
              label: option.nextSeq.name,
            }
            : '',
        },
      );
    }

    // Here we don't need any parsing, because, by default, the nextSeq's value is an
    // empty string and that's a valid value.
    return new OptionModel({
      story: storyViewStore.currentStory._id,
      consequences: [new ConsequenceModel()],
    });
  };

  onClose = (resetForm) => () => {
    resetForm(this.getInitialValues());
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (values._id) {
        await this.updateOption(values);
      } else {
        await this.saveOption(values);
      }
      this.onClose(resetForm)();
    } finally {
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
        onClose={this.onClose(formik.resetForm)}
        classes={{
          paper: classNames(classes.dialogSize, classes.saveOptionDialog),
        }}
      >
        <DialogTitle
          onClose={this.onClose(formik.resetForm)}
        >
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent>
          <SaveOptionForm
            formik={formik}
            story={storyViewStore.currentStory}
            attributes={storyViewStore.attributes}
            onClose={this.onClose(formik.resetForm)}
            onSearchRequest={this.onSearchRequest}
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

SaveOptionModal.propTypes = {
  classes: PropTypes.object,
  option: PropTypes.instanceOf(OptionModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sequenceId: PropTypes.string.isRequired,
  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(SaveOptionModal);
