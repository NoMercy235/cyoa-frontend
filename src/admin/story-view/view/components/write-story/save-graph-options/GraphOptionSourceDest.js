import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import { Card } from '@material-ui/core';

import FormikAutocompleteContainer from '../../../../../../shared/components/form/Autocomplete/FormikAutocompleteContainer';

import styles from './GraphOptionSourceDest.module.scss';

class GraphOptionSourceDest extends Component {

  renderSequenceField = ({ field }) => {
    const { formik, disabled, onSearchRequest } = this.props;
    return (
      <FormikAutocompleteContainer
        formik={formik}
        field={field}
        disabled={disabled}
        label="From"
        placeholder="Search for sequences"
        searchOnFocus={true}
        onSearchRequest={onSearchRequest}
      />
    );
  };

  renderNextSeqField = ({ field }) => {
    const { formik, disabled, onSearchRequest } = this.props;
    return (
      <FormikAutocompleteContainer
        formik={formik}
        field={field}
        disabled={disabled}
        label="Leads to"
        placeholder="Search for sequences"
        searchOnFocus={true}
        onSearchRequest={onSearchRequest}
      />
    );
  };

  render() {
    return (
      <Card className={styles.container}>
        <Form noValidate>
          <Field
            name="sequence"
            required
            render={this.renderSequenceField}
          />
          <Field
            name="nextSeq"
            required
            render={this.renderNextSeqField}
          />
        </Form>
      </Card>
    );
  }
}

GraphOptionSourceDest.propTypes = {
  formik: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onSearchRequest: PropTypes.func.isRequired,
};

export default GraphOptionSourceDest;
