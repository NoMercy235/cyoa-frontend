import React, { Component } from 'react';
import classes from './StoryFilters.module.scss';
import Paper from '@material-ui/core/Paper';
import { Formik } from 'formik';
import StoryFiltersForm from './StoryFiltersForm';

class StoryFilters extends Component {
  getInitialValues = () => {
    return {
      tags: [],
      titleOrDescription: '',
      author: '',
    };
  };

  onSubmit = async (values, { setSubmitting }) => {
    // TODO: send the filters
    console.log(values);
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
};

export default StoryFilters;
