import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  Drawer,
  ExpansionPanel,
  ExpansionPanelSummary,
  Button,
  Divider,
} from '@material-ui/core';
import { Formik } from 'formik';

import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import { getDebouncedSequences } from '../../../../../../shared/utils/sequencesUtils';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import CollapsibleSaveGraphOption from './CollapsibleSaveGraphOption';
import GraphOptionSourceDest from './GraphOptionSourceDest';
import { GRAPH_SOURCE_DEST_PROPERTY } from '../../../../../../shared/constants/graph';
import { submitAndValidateForm } from '../../../../../../shared/formUtils';
import { ERRORS } from '../../../../../../shared/constants/errors';

import styles from './SaveGraphOptions.module.scss';

class SaveGraphOptions extends Component {
  state = {
    options: this.props.options,
  };
  formikRef = {};

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.options !== prevProps.options) {
      this.setState({ options: this.props.options });
    }
  }

  addOption = () => {
    const { story } = this.props;
    const { options } = this.state;
    const newOption = new OptionModel({
      action: 'New Option',
      story: story._id,
    });
    const newOptions = [...options, newOption];
    this.setState({ options: newOptions });
  };

  replaceOptionInArray = index => newOption => {
    const { options } = this.state;
    const newOptions = options.map((option, i) => {
      return i === index ? newOption : option;
    });
    this.setState({ options: newOptions });
  };

  removeOptionInArray = (index) => () => {
    const { options } = this.state;
    const newOptions = options.filter((option, i) => i !== index);
    this.setState({ options: newOptions });
  };

  onSearchRequest = extraFilters => async (searchQuery) => {
    const { story } = this.props;
    return (await getDebouncedSequences(story._id, searchQuery, extraFilters))
      .map(s => ({ value: s._id, label: s.name }));
  };

  onDrawerClose = () => {
    this.formikRef = {};
    this.props.onDrawerClose();
  };

  onSubmitAll = async () => {
    const {
      [GRAPH_SOURCE_DEST_PROPERTY]: sourceDestFormik,
      ...restFormik
    } = this.formikRef;

    const errors = await Promise.all([
      await submitAndValidateForm(sourceDestFormik),
      ...Object.values(restFormik).map(submitAndValidateForm),
    ]);

    if (errors.filter(Boolean).length) return ;

    const { onSubmitAll } = this.props;
    const { values: { sequence, nextSeq } } = this.formikRef[GRAPH_SOURCE_DEST_PROPERTY];

    const newOptions = Object
      .values(restFormik)
      .map(formik => {
        const option = new OptionModel(formik.values);
        option.sequence = sequence;
        option.nextSeq = nextSeq;
        return option;
      });
    await onSubmitAll(newOptions);
    this.onDrawerClose();
  };

  validate = values => {
    const model = new OptionModel(values);
    return model.checkErrors(['nextSeq']);
  };

  validateSourceDest = values => {
    let errors = {};
    if (!values.sequence) {
      errors.sequence = ERRORS.fieldRequired;
    }
    if (!values.nextSeq) {
      errors.nextSeq = ERRORS.fieldRequired;
    }
    return errors;
  };

  renderSourceDestForm = formik => {
    const { sourceDest } = this.props;
    this.formikRef[GRAPH_SOURCE_DEST_PROPERTY] = formik;
    return (
      <GraphOptionSourceDest
        formik={formik}
        disabled={!!Object.values(sourceDest).filter(Boolean).length}
        onSearchRequest={this.onSearchRequest}
      />
    );
  };

  renderSourceDestContainer = () => {
    const { sourceDest } = this.props;
    return (
      <Formik
        enableReinitialize={true}
        initialValues={sourceDest}
        validateOnChange={false}
        onSubmit={() => {}}
        validate={this.validateSourceDest}
      >
        {this.renderSourceDestForm}
      </Formik>
    );
  };

  renderCollapsibleOption = (option, index) => formik => {
    const {
      story,
      attributes,
    } = this.props;

    this.formikRef[index] = formik;

    return (
      <CollapsibleSaveGraphOption
        formik={formik}
        story={story}
        option={option}
        attributes={attributes}
        onRemoveOptionInArray={this.removeOptionInArray(index)}
      />
    )
  };

  renderNewOptionPanel = () => {
    return (
      <ExpansionPanel
        disabled={true}
        onClick={this.addOption}
        className={styles.addNewOptionPanel}
      >
        <ExpansionPanelSummary>
          Click to add a new option
        </ExpansionPanelSummary>
      </ExpansionPanel>
    );
  };

  renderActionButtons = () => {
    return (
      <div className={styles.buttons}>
        <Button
          onClick={this.onDrawerClose}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={this.onSubmitAll}
          color="primary"
        >
          Save
        </Button>
      </div>
    );
  };

  render () {
    const { open } = this.props;
    const { options = [] } = this.state;

    this.formikRef = {};

    return (
      <Drawer
        anchor="top"
        open={open}
        onClose={this.onDrawerClose}
      >
        {open && (
          <div className={styles.container}>
            {this.renderSourceDestContainer()}
            {options.map((option, index) => {
              return (
                <Formik
                  key={index}
                  enableReinitialize={true}
                  initialValues={option}
                  validateOnChange={false}
                  onSubmit={this.replaceOptionInArray(index)}
                  validate={this.validate}
                >
                  {this.renderCollapsibleOption(option, index)}
                </Formik>
              )
            })}
            {this.renderNewOptionPanel()}
            <Divider/>
            {this.renderActionButtons()}
          </div>
        )}
      </Drawer>
    );
  }
}

SaveGraphOptions.propTypes = {
  open: PropTypes.bool.isRequired,
  story: PropTypes.instanceOf(StoryModel),
  sourceDest: PropTypes.shape({
    sequence: PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
    nextSeq: PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  }),
  options: PropTypes.arrayOf(PropTypes.instanceOf(OptionModel)),
  attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)),

  onSubmitAll: PropTypes.func.isRequired,
  onDrawerClose: PropTypes.func.isRequired,
};

export default SaveGraphOptions;
