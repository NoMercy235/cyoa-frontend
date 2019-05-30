import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class AuthenticationActions extends Component {
  render() {
    const { formik } = this.props;

    return (
      <>
        <Button
          color="secondary"
          onClick={this.props.onClose}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          onClick={formik.submitForm}
        >
          {this.props.okText}
        </Button>
      </>
    );
  }
}

AuthenticationActions.propTypes = {
  formik: PropTypes.object.isRequired,
  okText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthenticationActions;
