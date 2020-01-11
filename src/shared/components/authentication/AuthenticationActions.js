import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class AuthenticationActions extends Component {
  render() {
    const {
      formik,
      cancelText,
      okText,
      registeredSuccessfully,
      onClose
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
        {!registeredSuccessfully && (
          <Button
            type="submit"
            disabled={formik.isSubmitting}
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
  registeredSuccessfully: PropTypes.bool.isRequired,
  formik: PropTypes.object.isRequired,
  okText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthenticationActions;
