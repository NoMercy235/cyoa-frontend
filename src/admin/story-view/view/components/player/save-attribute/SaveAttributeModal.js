import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Dialog } from '@material-ui/core';
import { Formik } from 'formik';
import { inject } from 'mobx-react';

import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import { attributeService } from '../../../../../../infrastructure/services/AttributeService';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import SaveAttributeForm from './SaveAttributeForm';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { debounced } from '../../../../../../shared/utilities';
import { sequenceService } from '../../../../../../infrastructure/services/SequenceService';
import { appStorePropTypes } from '../../../../../../shared/store/AppStore';
import { handleConflictError } from '../../../../../../shared/utils/formUtils';

import { styles } from './SaveAttribute.css';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

const debouncedSequenceList = debounced(sequenceService.list);

@inject('storyViewStore', 'appStore')
class SaveAttributeModal extends Component {

  onSequenceSearch = async (searchQuery) => {
    sequenceService.setNextRouteParams(
      { ':story': this.props.storyViewStore.currentStory._id }
    );

    const { sequences } = (await debouncedSequenceList({
      filters: {
        name: {
          op: 'ilike',
          value: searchQuery,
          options: {
            allowEmpty: true,
          },
        },
        isEnding: {
          op: 'equals',
          value: true,
        },
      },
      pagination: {
        page: 0,
        limit: 20,
      },
    }));

    return sequences.map(s => {
      return { value: s._id, label: s.name };
    });
  };

  renderTitle() {
    return this.props.attribute ? 'Edit attribute' : 'Create attribute';
  }

  saveAttribute = async values => {
    const { storyViewStore, appStore } = this.props;
    const attribute = await attributeService.save(AttributeModel.forApi(values));
    storyViewStore.addAttribute(attribute);
    appStore.showSuccessSnackbar({
      message: 'Attribute saved!',
    });
  };

  updateAttribute = async values => {
    const { storyViewStore, appStore } = this.props;
    const attribute = await attributeService.update(values._id, AttributeModel.forApi(values));
    storyViewStore.updateAttribute(values._id, attribute);
    appStore.showSuccessSnackbar({
      message: 'Attribute updated!',
    });
  };

  getInitialValues = () => {
    return this.props.attribute || new AttributeModel({}, { withFormikId: true });
  };

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (values._id) {
        await this.updateAttribute(values);
      } else {
        await this.saveAttribute(values);
      }
      setSubmitting(false);
      this.onClose();
    } catch (e) {
      setErrors(handleConflictError(e));
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
        onClose={this.onClose}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle
          onClose={this.onClose}
        >
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent>
          <SaveAttributeForm
            formik={formik}
            onClose={this.onClose}
            onSequenceSearch={this.onSequenceSearch}
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
          validateOnChange={false}
          onSubmit={this.onSubmit}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
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
  appStore: appStorePropTypes,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(SaveAttributeModal);
