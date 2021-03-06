import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class BasicFormActions extends Component {
  static defaultProps = {
    disabled: false,
  };

  render() {
    const {
      formik,
      disabled,
      cancelLabel,
      saveLabel,
      variant,
      onSave,
      onClose,
    } = this.props;

    return (
      <>
        <Button
          color="secondary"
          onClick={onClose}
          disabled={disabled || formik.isSubmitting}
          variant={variant}
        >
          {cancelLabel || 'Cancel'}
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={disabled || formik.isSubmitting}
          onClick={onSave || formik.submitForm}
          variant={variant}
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
  variant: PropTypes.string,
  onSave: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default BasicFormActions;
