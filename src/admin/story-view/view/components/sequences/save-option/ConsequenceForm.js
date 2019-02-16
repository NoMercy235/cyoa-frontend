import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import { hasError } from '../../../../../../shared/components/form/helpers';
import Select from '../../../../../../shared/components/form/Select/Select';
import { styles } from './SaveOption.css';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';

class ConsequenceForm extends Component {
  getAttributes = () => {
    return this.props.attributes.map(a => {
      return { _id: a.name, name: a.name };
    });
  };

  onRemoveConsequence = () => {
    this.props.onRemoveConsequence(this.props.index);
  };

  render() {
    const { formik, index, classes } = this.props;

    return (
      <div className={classes.consequenceRow}>
        <Field
          name={`consequences.${index}.attribute`}
          required
          render={({ field }) => {
            return (
              <Select
                formikField={field}
                className={classes.consequenceAttribute}
                label="Attribute"
                fullWidth
                items={this.getAttributes()}
                {...hasError(formik, `consequences.${index}.attribute`)}
              />
            );
          }}
        />
        <Field
          name={`consequences.${index}.changeValue`}
          required
          render={({ field }) => {
            return <TextField
              {...field}
              className={classes.consequenceChangeValue}
              label="Change value"
              type="number"
              fullWidth
              value={formik.values.consequences[index].changeValue}
              {...hasError(formik, `consequences.${index}.changeValue`)}
            />;
          }}
        />
        <Tooltip title="Remove consequence">
          <div className={classes.consequenceRemoveBtn}>
            <IconButton
              onClick={this.onRemoveConsequence}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      </div>
    );
  }
}

ConsequenceForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)).isRequired,
  index: PropTypes.number.isRequired,
  onRemoveConsequence: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(ConsequenceForm);
