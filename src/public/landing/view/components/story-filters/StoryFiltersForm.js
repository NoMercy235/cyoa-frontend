import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import {
  Button,
  List,
  ListItem,
  ListSubheader,
  TextField,
} from '@material-ui/core';

import Select from '../../../../../shared/components/form/Select/Select';
import { TagModel } from '../../../../../infrastructure/models/TagModel';

import styles from './StoryFilters.module.scss';

class StoryFiltersForm extends Component {
  tags = TagModel.get();

  resetFilters = () => {
    const { formik } = this.props;
    formik.resetForm({
      tags: [],
      titleOrDescription: '',
      authorShort: '',
    });
    formik.submitForm();
  };

  renderTagsField = ({ field }) => {
    return (
      <Select
        className={styles.tagsFilter}
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
