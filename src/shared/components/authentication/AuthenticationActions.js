import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class AuthenticationActions extends Component {
  render() {
    const {
      formik,
      cancelText,
      okText,
      showAsConfirm,
      onClose,
      disableSubmit,
    } = this.props;

    return (
      <>
        <Button
          color="secondary"
          onClick={onClose}
          disabled={formik.isSubmitting}
        >
          {cancelText}
        </Button>
        {!showAsConfirm && (
          <Button
            type="submit"
            disabled={disableSubmit || formik.isSubmitting}
            onClick={formik.submitForm}
          >
            {okText}
          </Button>
        )}
      </>
    );
  }
}

AuthenticationActions.propTypes = {
  showAsConfirm: PropTypes.bool.isRequired,
  formik: PropTypes.object.isRequired,
  okText: PropTypes.string,
  cancelText: PropTypes.string.isRequired,
  disableSubmit: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default AuthenticationActions;
