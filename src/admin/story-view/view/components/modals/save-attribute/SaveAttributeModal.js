import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar from '../../../../../../shared/components/snackbar/Snackbar';
import { styles } from './SaveAttribute.css';
import { inject } from 'mobx-react';
import { withSnackbar } from '../../../../../../shared/components/form/helpers';
import { attributeService } from '../../../../domain/services/AttributeService';
import { AttributeModel } from '../../../../domain/models/AttributeModel';
import { storyViewStorePropTypes } from '../../../../domain/stores/StoryViewStore';
import SaveAttributeForm from './SaveAttributeForm';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';

@inject('storyViewStore')
class SaveAttributeModal extends Component {
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
    return this.props.attribute ? 'Edit attribute' : 'Create attribute';
  }

  saveAttribute = async values => {
    const attribute = await withSnackbar.call(
      this,
      attributeService.save,
      [AttributeModel.forApi(values)],
      'Attribute saved!',
    );
    this.props.storyViewStore.addAttribute(attribute);
  };

  updateAttribute = async values => {
    const attribute = await withSnackbar.call(
      this,
      attributeService.update,
      [values._id, AttributeModel.forApi(values)],
      'Attribute updated!',
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

  render() {
    const { open, classes } = this.props;

    return (
      <Fragment>
        <Formik
          initialValues={this.getInitialValues()}
          validateOnChange={false}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
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
          }}
          validate={values => {
            const model = new AttributeModel(values);
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

SaveAttributeModal.propTypes = {
  classes: PropTypes.object,
  attribute: PropTypes.instanceOf(AttributeModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(SaveAttributeModal);
