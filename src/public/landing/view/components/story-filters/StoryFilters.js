import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import classes from './StoryFilters.module.scss';
import Paper from '@material-ui/core/Paper';
import { Formik } from 'formik';
import StoryFiltersForm from './StoryFiltersForm';

class StoryFilters extends Component {
  getInitialValues = () => {
    return {
      tags: [],
      titleOrDescription: '',
      authorShort: '',
    };
  };

  onSubmit = async (values, { setSubmitting }) => {
    await this.props.onSearch(values);
    setSubmitting(false);
  };

  renderForm = formik => {
    return <StoryFiltersForm formik={formik}/>;
  };

  render() {
    return (
      <Paper className={classes.container}>
        <Formik
          enableReinitialize={true}
          initialValues={this.getInitialValues()}
          onSubmit={this.onSubmit}
        >
          {this.renderForm}
        </Formik>
      </Paper>
    );
  }
}

StoryFilters.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default StoryFilters;
