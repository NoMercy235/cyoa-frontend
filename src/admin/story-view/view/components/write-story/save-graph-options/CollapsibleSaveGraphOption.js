import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Tooltip
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import classNames from 'classnames';

import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import BasicFormActions from '../../../../../../shared/components/form/BasicFormActions';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import SaveOptionForm from '../../sequences/save-option/SaveOptionForm';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';

import styles from './CollapsibleSaveGraphOption.module.scss';

class CollapsibleSaveGraphOption extends Component {
  state = {
    expanded: false,
  };

  toggle = () => {
    const { expanded } = this.state;
    expanded
      ? this.collapse()
      : this.expand();
  };


  expand = () => {
    this.setState({ expanded: true });
  };

  collapse = () => {
    const { formik } = this.props;
    formik.submitForm();
    this.setState({ expanded: false });
  };

  afterFormSubmit = async ({ setSubmitting }) => {
    this.collapse();
    setSubmitting(false);
  };

  onRemoveOptionInArray = (e) => {
    this.props.onRemoveOptionInArray();
    e.stopPropagation();
  };

  onCancel = () => {
    const { formik } = this.props;
    formik.resetForm();
    this.collapse();
  };

  renderForm = () => {
    const { formik, story, attributes } = this.props;

    return (
      <div className={styles.formContainer}>
        <SaveOptionForm
          formik={formik}
          story={story}
          attributes={attributes}
        />
        <Divider/>
        <div className={styles.buttons}>
          <BasicFormActions
            formik={formik}
            saveLabel="Ok"
            afterFormSubmit={this.afterFormSubmit}
            onClose={this.onCancel}
          />
        </div>
      </div>
    );
  };

  render () {
    const { formik, option } = this.props;
    const { expanded } = this.state;

    return (
      <ExpansionPanel
        expanded={expanded}
      >
        <ExpansionPanelSummary
          onClick={this.toggle}
        >
          <div
            className={classNames(styles.summaryRow, {
              [styles.optionWithError]: formik.submitCount && Object.keys(formik.errors).length,
            })}
          >
            <span>{option.action}</span>
            <Tooltip title="Remove">
              <DeleteIcon onClick={this.onRemoveOptionInArray}/>
            </Tooltip>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {this.renderForm()}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

CollapsibleSaveGraphOption.propTypes = {
  formik: PropTypes.object.isRequired,
  story: PropTypes.instanceOf(StoryModel),
  option: PropTypes.instanceOf(OptionModel),
  attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)),

  onRemoveOptionInArray: PropTypes.func.isRequired,
};

export default CollapsibleSaveGraphOption;
