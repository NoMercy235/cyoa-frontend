import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';
import { withStyles, Typography } from '@material-ui/core';

import { TagModel } from '../../../../../../infrastructure/models/TagModel';
import { CollectionModel } from '../../../../../../infrastructure/models/CollectionModel';
import {
  arrayToSelectFieldOptions,
  renderInput,
  renderSelectInput,
  renderSwitchInput
} from '../../../../../../shared/utils/formUtils';

import { styles } from './SaveStory.css';

class SaveStoryForm extends Component {
  tags = TagModel.get();

  renderIsAvailableOfflineInfo = () => {
    const { formik } = this.props;

    return !!formik.values._id && (
      <i>
        <Typography
          variant="caption"
          color="secondary"
        >
          (cannot edit)
        </Typography>
      </i>
    );
  };

  renderIsAvailableOfflineWarning = () => {
    const { formik: { values } } = this.props;

    return values.isAvailableOffline && !values._id && (
      <Typography
        variant="caption"
        color="secondary"
      >
        Warning. If the story is available offline, you will not be able to add attributes to it (the story will not have a player) and the actions (options) chosen by the reader cannot have consequences.
      </Typography>
    );
  };

  render() {
    const { classes, formik, collections } = this.props;

    return (
      <Form noValidate>
        <div className={classes.firstRowContainer}>
          {renderSelectInput(formik, {
            label: 'Tags',
            name: 'tags',
            required: true,
            fullWidth: true,
            multiple: true,
            items: this.tags,
          })}
          {!!collections.length && renderSelectInput(formik, {
            label: 'Collection',
            name: 'fromCollection',
            className: classes.fromCollection,
            fullWidth: true,
            items: arrayToSelectFieldOptions(collections),
          })}
        </div>
        {renderInput(formik, {
          label: 'Name',
          name: 'name',
          fullWidth: true,
        })}
        {renderSwitchInput(formik, {
          label: 'Make this story available offline?',
          name: 'isAvailableOffline',
          className: classes.isAvailableOfflineContainer,
          extraInfo: this.renderIsAvailableOfflineInfo(),
          disabled: !!formik.values._id,
        })}
        {this.renderIsAvailableOfflineWarning()}
        {renderInput(formik, {
          label: 'Short Description',
          name: 'shortDescription',
          fullWidth: true,
          textarea: {
            rows: 2,
          },
        })}
        {renderInput(formik, {
          label: 'Long Description',
          name: 'longDescription',
          fullWidth: true,
          textarea: {
            rows: 5,
          },
        })}
      </Form>
    );
  }
}

SaveStoryForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  collections: PropTypes.arrayOf(PropTypes.instanceOf(CollectionModel)),
};

export default withStyles(styles)(SaveStoryForm);
