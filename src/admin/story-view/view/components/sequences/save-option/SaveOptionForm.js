import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { FieldArray, Form } from 'formik';
import { withStyles, IconButton, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import ConsequenceForm from './ConsequenceForm';
import { ConsequenceModel } from '../../../../../../infrastructure/models/ConsequenceModel';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { renderAutocompleteInput, renderInput } from '../../../../../../shared/formUtils';

import { styles } from './SaveOption.css';

class SaveOptionForm extends Component {
  onAddConsequence = arrayHelpers => () => {
    const consequence = new ConsequenceModel();
    arrayHelpers.push(consequence);
  };

  onRemoveConsequence = arrayHelpers => index => {
    arrayHelpers.remove(index);
  };

  renderConsequences = (arrayHelpers) => {
    const { classes, formik, attributes } = this.props;

    if (!attributes.length) {
      return null;
    }

    return (
      <>
        <Typography
          className={classes.consequenceHeader}
          variant="h6"
          color="inherit"
          noWrap
        >
          <span>Add consequences</span>
          <Tooltip title="New consequence">
            <IconButton
              onClick={this.onAddConsequence(arrayHelpers)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        {formik.values.consequences.map((consequence, index) => (
          <ConsequenceForm
            key={index}
            formik={formik}
            index={index}
            attributes={attributes}
            onRemoveConsequence={this.onRemoveConsequence(arrayHelpers)}
          />
        ))}
      </>
    );
  };

  render() {
    const { classes, formik, story, onSearchRequest } = this.props;

    return (
      <Form noValidate className={classes.form}>
        {renderInput(formik, {
          label: 'Action',
          name: 'action',
          required: true,
        })}
        {onSearchRequest && renderAutocompleteInput(formik, {
          label: 'Leads to',
          name: 'nextSeq',
          placeholder: 'Search for sequences',
          onSearchRequest
        })}
        {!story.isAvailableOffline
          ? (
            <FieldArray
              name="consequences"
              render={this.renderConsequences}
            />
          )
          : (
            <Typography>Consequences cannot be added for stories that are available offline</Typography>
          )}
      </Form>
    );
  }
}

SaveOptionForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  story: PropTypes.instanceOf(StoryModel).isRequired,
  attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)).isRequired,
  onSearchRequest: PropTypes.func,
};

export default withStyles(styles)(SaveOptionForm);
