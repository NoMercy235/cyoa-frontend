import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Paper } from '@material-ui/core';

import StoryFiltersForm from './StoryFiltersForm';

import styles from './StoryFilters.module.scss';

class StoryFilters extends Component {
  onSubmit = async (values, { setSubmitting }) => {
    await this.props.onSearch(values);
    setSubmitting(false);
  };

  renderForm = formik => {
    return <StoryFiltersForm formik={formik}/>;
  };

  render() {
    const { initialValues } = this.props;

    return (
      <Paper className={styles.container}>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={this.onSubmit}
        >
          {this.renderForm}
        </Formik>
      </Paper>
    );
  }
}

StoryFilters.propTypes = {
  initialValues: PropTypes.shape({
    tags: PropTypes.array.isRequired,
    titleOrDescription: PropTypes.string.isRequired,
    authorShort: PropTypes.string.isRequired,
  }).isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default StoryFilters;
