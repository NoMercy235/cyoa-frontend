import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import { Field, Form } from 'formik';
import Select from '../../../../../shared/components/form/Select/Select';
import { TagModel } from '../../../../../infrastructure/models/TagModel';
import classes from './StoryFilters.module.scss';
import Button from '@material-ui/core/Button';

class StoryFiltersForm extends Component {
  tags = TagModel.get();

  resetFilters = () => {
    const { formik } = this.props;
    formik.resetForm();
    formik.submitForm();
  };

  renderTagsField = ({ field }) => {
    return (
      <Select
        className={classes.tagsFilter}
        formikField={field}
        label="Tags"
        items={this.tags}
        multiple={true}
      />
    );
  };

  renderTitleOrDescriptionField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        label="Title or description"
        fullWidth
        value={formik.values.titleOrDescription}
      />
    );
  };

  renderAuthorField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        label="Author"
        fullWidth
        value={formik.values.authorShort}
      />
    );
  };

  render() {
    const { formik } = this.props;

    return (
      <Form noValidate>
        <List
          subheader={
            <ListSubheader>
              Filter stories
            </ListSubheader>
          }
        >
          <ListItem>
            <Field
              name="tags"
              required
              render={this.renderTagsField}
            />
          </ListItem>
          <ListItem>
            <Field
              name="titleOrDescription"
              required
              render={this.renderTitleOrDescriptionField}
            />
          </ListItem>
          <ListItem>
            <Field
              name="authorShort"
              required
              render={this.renderAuthorField}
            />
          </ListItem>
          <ListItem>
            <Button
              type="submit"
              color="primary"
              variant="outlined"
              fullWidth={true}
              disabled={formik.isSubmitting}
            >
              Search
            </Button>
          </ListItem>
          <ListItem>
            <Button
              color="secondary"
              variant="outlined"
              fullWidth={true}
              disabled={formik.isSubmitting}
              onClick={this.resetFilters}
            >
              Reset filters
            </Button>
          </ListItem>
        </List>
      </Form>
    );
  }
}

StoryFiltersForm.propTypes = {
  formik: PropTypes.object,
};

export default StoryFiltersForm;
