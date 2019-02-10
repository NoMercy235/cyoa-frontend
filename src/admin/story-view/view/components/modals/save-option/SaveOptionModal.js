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
import { withSnackbar } from '../../../../../../shared/components/form/helpers';
import { storyViewStorePropTypes } from '../../../../domain/stores/StoryViewStore';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { optionService } from '../../../../domain/services/OptionService';
import { OptionModel } from '../../../../domain/models/OptionModel';
import SaveOptionForm from './SaveOptionForm';
import { styles } from './SaveOption.css';
import { ConsequenceModel } from '../../../../domain/models/ConsequenceModel';

@inject('storyViewStore')
class SaveOptionModal extends Component {
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
    return this.props.option ? 'Edit option' : 'Create option';
  }

  setParams = () => {
    const params = { ':sequence': this.props.sequenceId };
    optionService.setNextRouteParams(params);
  };

  saveOption = async values => {
    this.setParams();
    const option = await withSnackbar.call(
      this,
      optionService.save,
      [OptionModel.forApi(values)],
      'Option saved!',
    );
    this.props.storyViewStore.addOptionToSequence(
      this.props.sequenceId,
      option
    );
  };

  updateOption = async values => {
    this.setParams();
    const option = await withSnackbar.call(
      this,
      optionService.update,
      [values._id, OptionModel.forApi(values)],
      'Option updated!',
    );
    this.props.storyViewStore.updateOption(
      this.props.sequenceId,
      values._id,
      option
    );
  };

  getInitialValues = () => {
    return this.props.option ||
      new OptionModel({ consequences: [new ConsequenceModel()] });
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
                await this.updateOption(values);
              } else {
                await this.saveOption(values);
              }
              this.onClose(resetForm)();
            } finally {
              setSubmitting(false);
            }
          }}
          validate={values => {
            const model = new OptionModel(values);
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
                  <SaveOptionForm
                    formik={formik}
                    onClose={this.onClose(formik.resetForm)}
                    sequences={this.props.storyViewStore.sequences}
                    attributes={this.props.storyViewStore.attributes}
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

SaveOptionModal.propTypes = {
  classes: PropTypes.object,
  option: PropTypes.instanceOf(OptionModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sequenceId: PropTypes.string.isRequired,
  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(SaveOptionModal);
