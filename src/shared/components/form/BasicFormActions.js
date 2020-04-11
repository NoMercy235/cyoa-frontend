import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import { submitAndValidateForm } from '../../utils/formUtils';

class BasicFormActions extends Component {
  static defaultProps = {
    disabled: false,
  };

  onSave = async () => {
    const { formik, afterFormSubmit } = this.props;
    const errors = await submitAndValidateForm(formik);
    if (!errors) {
      afterFormSubmit && await afterFormSubmit(formik);
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
