import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class BasicFormActions extends Component {
  render() {
    const { formik, onClose } = this.props;

    return (
      <>
        <Button
          color="secondary"
          onClick={onClose}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={formik.isSubmitting}
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
  onClose: PropTypes.func.isRequired,
};

export default BasicFormActions;
