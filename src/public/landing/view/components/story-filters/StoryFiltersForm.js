import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';
import {
  List,
  ListItem,
  ListSubheader,
} from '@material-ui/core';

import { TagModel } from '../../../../../infrastructure/models/TagModel';
import { renderInput, renderSelectInput } from '../../../../../shared/utils/formUtils';
import BasicFormActions from '../../../../../shared/components/form/BasicFormActions';

import styles from './StoryFilters.module.scss';

class StoryFiltersForm extends Component {
  tags = TagModel.get();

  resetFilters = async () => {
    const { formik } = this.props;
    await formik.setValues({
      tags: [],
      titleOrDescription: '',
      authorShort: '',
    });
    await formik.submitForm();
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
            {renderSelectInput(formik, {
              label: 'Tags',
              name: 'tags',
              fullWidth: true,
              items: this.tags,
            })}
          </ListItem>
          <ListItem>
            {renderInput(formik, {
              label: 'Title or description',
              name: 'titleOrDescription',
              fullWidth: true,
              required: false,
            })}
          </ListItem>
          <ListItem>
            {renderInput(formik, {
              label: 'Author',
              name: 'authorShort',
              fullWidth: true,
              required: false,
            })}
          </ListItem>
          <ListItem className={styles.buttons}>
            <BasicFormActions
              formik={formik}
              onClose={this.resetFilters}
              variant="outlined"
              saveLabel="Search"
              cancelLabel="Reset filters"
            />
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
