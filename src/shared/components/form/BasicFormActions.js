import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class BasicFormActions extends Component {
  static defaultProps = {
    disabled: false,
  };

  render() {
    const { formik, disabled, onClose } = this.props;

    return (
      <>
        <Button
          color="secondary"
          onClick={onClose}
          disabled={disabled || formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={disabled || formik.isSubmitting}
          onClick={formik.submitForm}
        >
          Save
        </Button>
      </>
    );
  }
}

BasicFormActions.propTypes = {
  formik: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default BasicFormActions;
