import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, FieldArray, Form } from 'formik';
import { withStyles, IconButton, TextField, Tooltip, Typography } from '@material-ui/core';
import { hasError } from '../../../../../../shared/components/form/helpers';
import AddIcon from '@material-ui/icons/Add';

import ConsequenceForm from './ConsequenceForm';
import { ConsequenceModel } from '../../../../../../infrastructure/models/ConsequenceModel';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import FormikAutocompleteContainer from '../../../../../../shared/components/form/Autocomplete/FormikAutocompleteContainer';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';

import { styles } from './SaveOption.css';

class SaveOptionForm extends Component {
  onAddConsequence = arrayHelpers => () => {
    const consequence = new ConsequenceModel();
    arrayHelpers.push(consequence);
  };

  onRemoveConsequence = arrayHelpers => index => {
    arrayHelpers.remove(index);
  };

  renderActionField = ({ field }) => {
    const { formik } = this.props;
    return (
      <TextField
        {...field}
        label="Action"
        fullWidth
        value={formik.values.action}
        {...hasError(formik, 'action')}
      />
    );
  };

  renderNextSeqField = ({ field }) => {
    const { formik, onSearchRequest } = this.props;
    return (
      <FormikAutocompleteContainer
        formik={formik}
        field={field}
        label="Leads to"
        placeholder="Search for sequences"
        searchOnFocus={true}
        onSearchRequest={onSearchRequest}
      />
    );
  };

  renderConsequences = (arrayHelpers) => {
    const { classes, formik, attributes } = this.props;
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
    const { classes, story } = this.props;

    return (
      <Form noValidate className={classes.form}>
        <Field
          name="action"
          required
          render={this.renderActionField}
        />
        <Field
          name="nextSeq"
          required
          render={this.renderNextSeqField}
        />
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
  onSearchRequest: PropTypes.func.isRequired,
};

export default withStyles(styles)(SaveOptionForm);
