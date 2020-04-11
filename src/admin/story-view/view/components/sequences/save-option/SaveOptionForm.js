import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { FieldArray, Form } from 'formik';
import { withStyles, Divider, IconButton, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { ConsequenceModel } from '../../../../../../infrastructure/models/ConsequenceModel';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { renderAutocompleteInput, renderInput } from '../../../../../../shared/formUtils';
import { RequirementModel } from '../../../../../../infrastructure/models/RequirementModel';

import { styles } from './SaveOption.css';
import OptionExtrasForm from './OptionExtrasForm';

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
          className={classes.extraHeader}
          variant="h6"
          color="inherit"
          noWrap
        >
          <span>Add {names.plural}</span>
          <Tooltip title={`New ${names.singular}`}>
            <IconButton
              onClick={callbacks.onAddExtra(arrayHelpers)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
      </>
    );
  };

  renderExtras = () => {
    const { classes, story } = this.props;

    if (story.isAvailableOffline) {
      return <Typography>Consequences/Requirements cannot be added for stories that are available offline</Typography>
    }

    return (
      <>
        <FieldArray
          name="consequences"
          render={this.renderExtraSection(
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
        />
        <Divider className={classes.divider}/>
        <FieldArray
          name="requirements"
          render={this.renderExtraSection(
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
        />
      </>
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
