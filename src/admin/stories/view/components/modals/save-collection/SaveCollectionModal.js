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

  render() {
    return (
      <Fragment>
        <Formik
          initialValues={new CollectionModel()}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const collection = await withSnackbar.call(
                this,
                collectionService.save,
                [CollectionModel.forApi(values)],
                'Collection saved!',
              );
              this.props.storyStore.addCollection(collection);
              this.props.onClose();
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
                open={this.props.open}
                onClose={this.props.onClose}
                classes={{ paper: this.props.classes.dialogSize }}
              >
                <DialogTitle
                  onClose={this.props.onClose}
                >
                  {this.renderTitle()}
                </DialogTitle>
                <DialogContent>
                  <SaveCollectionForm
                    formik={formik}
                    onClose={this.props.onClose}
                  />
                </DialogContent>
                <DialogActions>
                  <SaveCollectionActions
                    formik={formik}
                    onClose={this.props.onClose}
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
  collection: PropTypes.shape(CollectionModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  storyStore: storyStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(SaveCollectionModal);
