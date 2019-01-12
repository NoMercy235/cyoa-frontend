import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import { inject } from 'mobx-react';
import { StoryModel } from '../../../../domain/models/StoryModel';
import { BaseModel } from '../../../../../../shared/domain/models/BaseModel';
import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar from '../../../../../../shared/components/snackbar/Snackbar';
import { styles } from './SaveStory.css';
import SaveStoryForm from './SaveStoryForm';
import SaveStoryActions from './SaveStoryActions';
import { storyService } from '../../../../domain/services/StoryService';

@inject('appStore')
class SaveStoryModal extends Component {
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
    return this.props.story ? 'Edit story' : 'Create story';
  }

  render() {
    return (
      <Fragment>
        <Formik
          initialValues={new StoryModel()}
          onSubmit={async (values, { setSubmitting }) => {
            let message = 'Story saved!';
            let variant = 'success';
            try {
              await storyService.save(StoryModel.forApi(values));
              this.props.onClose();
            } catch (e) {
              variant = 'error';
              message = BaseModel.handleError(e);
            } finally {
              setSubmitting(false);
              this.onChangeState({
                open: true,
                variant,
                message,
              })();
            }
          }}
          validate={values => {
            const model = new StoryModel(values);
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
                  <SaveStoryForm
                    formik={formik}
                    onClose={this.props.onClose}
                  />
                </DialogContent>
                <DialogActions>
                  <SaveStoryActions
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

SaveStoryModal.propTypes = {
  classes: PropTypes.object,
  story: PropTypes.shape(StoryModel),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(SaveStoryModal);
