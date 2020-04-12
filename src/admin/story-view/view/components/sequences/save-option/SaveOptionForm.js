import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { FieldArray, Form } from 'formik';
import { withStyles, Typography } from '@material-ui/core';

import { ConsequenceModel } from '../../../../../../infrastructure/models/ConsequenceModel';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { renderAutocompleteInput, renderInput } from '../../../../../../shared/utils/formUtils';
import { RequirementModel } from '../../../../../../infrastructure/models/RequirementModel';
import OptionExtrasForm from './OptionExtrasForm';
import ClickToAddItem from '../../../../../../shared/components/form/ClickToAddItem/ClickToAddItem';

import { styles } from './SaveOption.css';

class SaveOptionForm extends Component {
  onAddConsequence = arrayHelpers => () => {
    const consequence = new ConsequenceModel();
    arrayHelpers.push(consequence);
  };

  onAddRequirement = arrayHelpers => () => {
    const requirement = new RequirementModel();
    arrayHelpers.push(requirement);
  };

  onRemoveConsequence = arrayHelpers => index => {
    arrayHelpers.remove(index);
  };

  onRemoveRequirement = arrayHelpers => index => {
    arrayHelpers.remove(index);
  };

  renderExtraSection = (names, callbacks) => arrayHelpers => {
    const { classes, formik, attributes } = this.props;

    if (!attributes.length) {
      return null;
    }

    return (
      <>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
        >
          <span>Add {names.plural}</span>
        </Typography>
        {formik.values[names.plural].map((extra, index) => (
          <OptionExtrasForm
            key={index}
            names={names}
            formik={formik}
            index={index}
            attributes={attributes}
            onRemoveExtra={callbacks.onRemoveExtra(arrayHelpers)}
          />
        ))}
        <ClickToAddItem
          className={classes.extraAddNewItem}
          label={`Click to add ${names.singular}`}
          onClick={callbacks.onAddExtra(arrayHelpers)}
        />
      </>
    );
  };

  renderExtras = () => {
    const { classes, story } = this.props;

    if (story.isAvailableOffline) {
      return <Typography>Consequences/Requirements cannot be added for stories that are available offline</Typography>
    }

    return (
      <div className={classes.extraSectionContainer}>
        <div>
          <FieldArray name="consequences">
            {this.renderExtraSection(
              {
                singular: 'consequence',
                plural: 'consequences',
                propName: 'changeValue',
                propLabel: 'Change Value',
              },
              {
                onAddExtra: this.onAddConsequence,
                onRemoveExtra: this.onRemoveConsequence,
              }
            )}
          </FieldArray>
        </div>
        <div>
          <FieldArray name="requirements">
            {this.renderExtraSection(
              {
                singular: 'requirement',
                plural: 'requirements',
                propName: 'value',
                propLabel: 'Value',
              },
              {
                onAddExtra: this.onAddRequirement,
                onRemoveExtra: this.onRemoveRequirement,
              }
            )}
          </FieldArray>
        </div>
      </div>
    );
  };

  render() {
    const { classes, formik, onSearchRequest } = this.props;

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
        {this.renderExtras()}
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
