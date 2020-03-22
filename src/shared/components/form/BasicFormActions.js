import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class BasicFormActions extends Component {
  static defaultProps = {
    disabled: false,
  };

  onSave = () => {
    const { formik, afterFormSubmit } = this.props;
    formik.submitForm();
    if (formik.isValid) {
      afterFormSubmit && afterFormSubmit(formik);
    }
  };

  render() {
    const { formik, disabled, cancelLabel, saveLabel, onClose } = this.props;

    return (
      <>
        <Button
          color="secondary"
          onClick={onClose}
          disabled={disabled || formik.isSubmitting}
        >
          {cancelLabel || 'Cancel'}
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={disabled || formik.isSubmitting}
          onClick={this.onSave}
        >
          {saveLabel || 'Save'}
        </Button>
      </>
    );
  }
}

BasicFormActions.propTypes = {
  formik: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  cancelLabel: PropTypes.string,
  saveLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  afterFormSubmit: PropTypes.func,
};

export default BasicFormActions;
