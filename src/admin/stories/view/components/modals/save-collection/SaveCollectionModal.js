import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar from '../../../../../../shared/components/snackbar/Snackbar';
import { styles } from './SaveCollection.css';
import SaveCollectionForm from './SaveCollectionForm';
import SaveCollectionActions from './SaveCollectionActions';
import { collectionService } from '../../../../domain/services/CollectionService';
import { CollectionModel } from '../../../../domain/models/CollectionModel';
import { inject } from 'mobx-react';
import { storyStorePropTypes } from '../../../../domain/stores/StoryStore';
import { withSnackbar } from '../../../../../../shared/components/form/helpers';

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

  render() {
    const { open, onClose, classes } = this.props;

    return (
      <Fragment>
        <Formik
          initialValues={this.props.collection || new CollectionModel()}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (values._id) {
                await this.updateCollection(values);
              } else {
                await this.saveCollection(values);
              }
              onClose();
            } finally {
              setSubmitting(false);
            }
          }}
          validate={values => {
            const model = new CollectionModel(values);
            return model.checkErrors();
          }}
        >
          {formik => {
            return (
              <Dialog
                open={open}
                onClose={onClose}
                classes={{ paper: classes.dialogSize }}
              >
                <DialogTitle
                  onClose={onClose}
                >
                  {this.renderTitle()}
                </DialogTitle>
                <DialogContent>
                  <SaveCollectionForm
                    formik={formik}
                    onClose={onClose}
                  />
                </DialogContent>
                <DialogActions>
                  <SaveCollectionActions
                    formik={formik}
                    onClose={onClose}
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

SaveCollectionModal.propTypes = {
  classes: PropTypes.object,
  collection: PropTypes.instanceOf(CollectionModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyStore: storyStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(SaveCollectionModal);
