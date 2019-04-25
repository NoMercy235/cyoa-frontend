import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar from '../../../../../../shared/components/snackbar/Snackbar';
import SaveCollectionForm from './SaveCollectionForm';
import { collectionService } from '../../../../../../infrastructure/services/CollectionService';
import { CollectionModel } from '../../../../../../infrastructure/models/CollectionModel';
import { inject } from 'mobx-react';
import { storyStorePropTypes } from '../../../../stores/StoryStore';
import { withSnackbar } from '../../../../../../shared/components/form/helpers';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

@inject('storyStore')
class SaveCollectionModal extends Component {
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
    return this.props.collection ? 'Edit collection' : 'Create collection';
  }

  saveCollection = async values => {
    const collection = await withSnackbar.call(
      this,
      collectionService.save,
      [CollectionModel.forApi(values)],
      'Collection saved!',
    );
    this.props.storyStore.addCollection(collection);
  };

  updateCollection = async values => {
    const collection = await withSnackbar.call(
      this,
      collectionService.update,
      [values._id, CollectionModel.forApi(values)],
      'Collection updated!',
    );
    this.props.storyStore.updateCollection(values._id, collection);
  };

  getInitialValues = () => {
    return this.props.collection || new CollectionModel();
  };

  onClose = (resetForm) => () => {
    resetForm(this.getInitialValues());
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (values._id) {
        await this.updateCollection(values);
      } else {
        await this.saveCollection(values);
      }
      this.onClose(resetForm)();
    } finally {
      setSubmitting(false);
    }
  };

  validate = values => {
    const model = new CollectionModel(values);
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
          <SaveCollectionForm
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

SaveCollectionModal.propTypes = {
  classes: PropTypes.object,
  collection: PropTypes.instanceOf(CollectionModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyStore: storyStorePropTypes,
};

export default withStyles(dialogDefaultCss)(SaveCollectionModal);
