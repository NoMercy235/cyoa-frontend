import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Dialog } from '@material-ui/core';
import { Formik } from 'formik';
import { inject } from 'mobx-react';

import { DialogTitle } from '../../../../../../shared/components/dialog/Title';
import { DialogContent } from '../../../../../../shared/components/dialog/Content';
import { DialogActions } from '../../../../../../shared/components/dialog/Actions';
import Snackbar, { SnackbarEnum } from '../../../../../../shared/components/snackbar/Snackbar';
import { attributeService } from '../../../../../../infrastructure/services/AttributeService';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import SaveAttributeForm from './SaveAttributeForm';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { debounced } from '../../../../../../shared/utilities';
import { sequenceService } from '../../../../../../infrastructure/services/SequenceService';

import { styles } from './SaveAttribute.css';
import { dialogDefaultCss } from '../../../../../../shared/components/dialog/Dialog.css';

const debouncedSequenceList = debounced(sequenceService.list);

@inject('storyViewStore')
class SaveAttributeModal extends Component {
  snackbarRef = React.createRef();

  onSequenceSearch = async (searchQuery) => {
    sequenceService.setNextRouteParams(
      { ':story': this.props.storyViewStore.currentStory.id }
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
      }
    }));

    return sequences.map(s => {
      return { value: s.id, label: s.name };
    });
  };

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
      [values.id, AttributeModel.forApi(values)],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Attribute updated!',
      },
    );
    this.props.storyViewStore.updateAttribute(values.id, attribute);
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
      if (values.id) {
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
            onSequenceSearch={this.onSequenceSearch}
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
