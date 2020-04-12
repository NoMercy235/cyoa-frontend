import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';
import { withStyles } from '@material-ui/core';

import {
  renderAutocompleteInput,
  renderCheckboxInput,
  renderInput
} from '../../../../../../shared/utils/formUtils';

import { styles } from './SaveAttribute.css';

class SaveAttributeForm extends Component {
  render() {
    const { classes, formik, onSequenceSearch } = this.props;

    return (
      <Form noValidate>
        <div className={classes.firstRowContainer}>
          {renderInput(formik, {
            label: 'Name',
            name: 'name',
            className: classes.name,
            fullWidth: true,
          })}
          {renderInput(formik, {
            label: 'Start value',
            name: 'startValue',
            fullWidth: true,
            type: 'number',
          })}
        </div>
        {renderCheckboxInput(formik, {
          label: 'Is important?',
          name: 'isImportant',
          defaultValue: formik.values.isImportant,
        })}
        {formik.values.isImportant && renderAutocompleteInput(formik, {
          label: 'Associated ending',
          name: 'linkedEnding',
          placeholder: 'Search for sequences',
          onSearchRequest: onSequenceSearch
        })}
        {renderInput(formik, {
          label: 'Description',
          name: 'description',
          fullWidth: true,
          textarea: {
            rows: 3,
          },
          required: false,
        })}
      </Form>
    );
  }
}

SaveAttributeForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  onSequenceSearch: PropTypes.func.isRequired,
};

export default withStyles(styles)(SaveAttributeForm);
