import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';
import { Card } from '@material-ui/core';

import { renderAutocompleteInput } from '../../../../../../shared/utils/formUtils';

import styles from './GraphOptionSourceDest.module.scss';

class GraphOptionSourceDest extends Component {
  render() {
    const { formik, disabled, onSearchRequest } = this.props;
    return (
      <Card className={styles.container}>
        <Form noValidate>
          {renderAutocompleteInput(formik, {
            label: 'From',
            name: 'sequence',
            placeholder: 'Search for sequences',
            onSearchRequest: onSearchRequest({
              isEnding: { op: 'equals', value: false },
            }),
            disabled
          })}
          {renderAutocompleteInput(formik, {
            label: 'Leads to',
            name: 'nextSeq',
            placeholder: 'Search for sequences',
            onSearchRequest: onSearchRequest(),
            disabled
          })}
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
