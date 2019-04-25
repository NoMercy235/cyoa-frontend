import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import classes from './StoryFilters.module.scss';
import Paper from '@material-ui/core/Paper';
import { Formik } from 'formik';
import StoryFiltersForm from './StoryFiltersForm';

class StoryFilters extends Component {
  onSubmit = async (values, { setSubmitting }) => {
    await this.props.onSearch(values);
    setSubmitting(false);
  };

  renderForm = formik => {
    return <StoryFiltersForm formik={formik}/>;
  };

  render() {
    const {initialValues} = this.props;

    return (
      <Paper className={classes.container}>
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
