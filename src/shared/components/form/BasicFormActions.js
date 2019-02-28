import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

class BasicFormActions extends Component {
  render() {
    const { formik, onClose } = this.props;

    return (
      <Fragment>
        <Button
          color="secondary"
          onClick={onClose}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          onClick={formik.submitForm}
        >
          Save
        </Button>
      </Fragment>
    );
  }
}

BasicFormActions.propTypes = {
  formik: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BasicFormActions;
