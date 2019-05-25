import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar, { SnackbarEnum } from '../../../../../../shared/components/snackbar/Snackbar';
import { styles } from './SaveAttribute.css';
import { inject } from 'mobx-react';
import { attributeService } from '../../../../../../infrastructure/services/AttributeService';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import SaveAttributeForm from './SaveAttributeForm';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

@inject('storyViewStore')
class SaveAttributeModal extends Component {
  snackbarRef = React.createRef();

  renderTitle() {
    return this.props.attribute ? 'Edit attribute' : 'Create attribute';
  }

  saveAttribute = async values => {
    const attribute = await this.snackbarRef.current.executeAndShowSnackbar(
      attributeService.save,
      [AttributeModel.forApi(values)],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Attribute saved!',
      },
    );
    this.props.storyViewStore.addAttribute(attribute);
  };

  updateAttribute = async values => {
    const attribute = await this.snackbarRef.current.executeAndShowSnackbar(
      attributeService.update,
      [values._id, AttributeModel.forApi(values)],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Attribute updated!',
      },
    );
    this.props.storyViewStore.updateAttribute(values._id, attribute);
  };

  getInitialValues = () => {
    return this.props.attribute || new AttributeModel();
  };

  onClose = (resetForm) => () => {
    resetForm(this.getInitialValues());
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (values._id) {
        await this.updateAttribute(values);
      } else {
        await this.saveAttribute(values);
      }
      this.onClose(resetForm)();
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new AttributeModel(values);
    return model.checkErrors();
  };

  renderForm = formik => {
    const { classes, open } = this.props;
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
          <SaveAttributeForm
            formik={formik}
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
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

SaveAttributeModal.propTypes = {
  classes: PropTypes.object,
  attribute: PropTypes.instanceOf(AttributeModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(SaveAttributeModal);
