import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';

import { renderInput } from '../../../../../../shared/utils/formUtils';

class SaveCollectionForm extends Component {
  render() {
    const { formik } = this.props;
    return (
      <Form noValidate>
        {renderInput(formik, {
          label: 'Name',
          name: 'name',
          fullWidth: true,
        })}
        {renderInput(formik, {
          label: 'Description',
          name: 'description',
          fullWidth: true,
          textarea: {
            rows: 3,
          },
        })}
      </Form>
    );
  }
}

SaveCollectionForm.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default SaveCollectionForm;
