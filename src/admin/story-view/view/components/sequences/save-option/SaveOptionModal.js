import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar from '../../../../../../shared/components/snackbar/Snackbar';
import { inject } from 'mobx-react';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { optionService } from '../../../../../../infrastructure/services/OptionService';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import SaveOptionForm from './SaveOptionForm';
import { styles } from './SaveOption.css';
import { ConsequenceModel } from '../../../../../../infrastructure/models/ConsequenceModel';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';
import classNames from 'classnames';
import { debounced } from '../../../../../../shared/utilities';
import { sequenceService } from '../../../../../../infrastructure/services/SequenceService';

const debouncedSequenceList = debounced(sequenceService.list);

@inject('storyViewStore')
class SaveOptionModal extends Component {
  snackbarRef = React.createRef();

  onSearchRequest = async (searchQuery) => {
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
      optionService.save.bind(null, OptionModel.forApi(values)),
      { variant: 'success', message: 'Option saved!' }
    );
    this.props.storyViewStore.addOptionToSequence(
      this.props.sequenceId,
      option
    );
  };

  updateOption = async values => {
    this.setParams();
    const option = await this.snackbarRef.current.executeAndShowSnackbar(
      optionService.update.bind(null, values._id, OptionModel.forApi(values)),
      { variant: 'success', message: 'Option updated!' }
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
          nextSeq: {
            value: option.nextSeq._id,
            label: option.nextSeq.name,
          },
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
      // Change the nextSeq back to normal id which will be handled by the backend
      const finalValues = Object.assign(
        {},
        values,
        { nextSeq: values.nextSeq.value },
      );
      if (values._id) {
        await this.updateOption(finalValues);
      } else {
        await this.saveOption(finalValues);
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
            onClose={this.onClose(formik.resetForm)}
            attributes={storyViewStore.attributes}
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
      <Fragment>
        <Formik
          enableReinitialize={true}
          initialValues={this.getInitialValues()}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
        <Snackbar innerRef={this.snackbarRef}/>
      </Fragment>
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
