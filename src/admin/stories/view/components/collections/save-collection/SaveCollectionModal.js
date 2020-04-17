import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Dialog } from '@material-ui/core';
import { Formik } from 'formik';
import { inject } from 'mobx-react';

import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import SaveCollectionForm from './SaveCollectionForm';
import { collectionService } from '../../../../../../infrastructure/services/CollectionService';
import { CollectionModel } from '../../../../../../infrastructure/models/CollectionModel';
import { storyStorePropTypes } from '../../../../stores/StoryStore';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { appStorePropTypes } from '../../../../../../shared/store/AppStore';
import { handleConflictError } from '../../../../../../shared/utils/formUtils';

import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

@inject('storyStore', 'appStore')
class SaveCollectionModal extends Component {
  renderTitle() {
    return this.props.collection ? 'Edit collection' : 'Create collection';
  }

  saveCollection = async values => {
    const { storyStore, appStore } = this.props;
    const collection = await collectionService.save(CollectionModel.forApi(values));
    storyStore.addCollection(collection);
    appStore.showSuccessSnackbar({
      message: 'Collection saved!',
    });
  };

  updateCollection = async values => {
    const { storyStore, appStore } = this.props;
    const collection = await collectionService.update(
      values._id,
      CollectionModel.forApi(values)
    );
    storyStore.updateCollection(values._id, collection);
    appStore.showSuccessSnackbar({
      message: 'Collection updated!',
    });
  };

  getInitialValues = () => {
    return this.props.collection || new CollectionModel();
  };

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (values._id) {
        await this.updateCollection(values);
      } else {
        await this.saveCollection(values);
      }
      setSubmitting(false)
      this.onClose();
    } catch (e) {
      setSubmitting(false);
      setErrors(handleConflictError(e));
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
        onClose={this.onClose}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle
          onClose={this.onClose}
        >
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent>
          <SaveCollectionForm
            formik={formik}
            onClose={this.onClose}
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

SaveCollectionModal.propTypes = {
  classes: PropTypes.object,
  collection: PropTypes.instanceOf(CollectionModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyStore: storyStorePropTypes,
  appStore: appStorePropTypes,
};

export default withStyles(dialogDefaultCss)(SaveCollectionModal);
