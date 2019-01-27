import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

class SaveAttributeActions extends Component {
  render() {
    const { formik } = this.props;

    return (
      <Fragment>
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
          Save
        </Button>
      </Fragment>
    );
  }
}

SaveAttributeActions.propTypes = {
  formik: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SaveAttributeActions;
