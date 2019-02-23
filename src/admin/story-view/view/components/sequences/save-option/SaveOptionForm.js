import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { Field, FieldArray, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import { hasError } from '../../../../../../shared/components/form/helpers';
import Select from '../../../../../../shared/components/form/Select/Select';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { styles } from './SaveOption.css';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import ConsequenceForm from './ConsequenceForm';
import { ConsequenceModel } from '../../../../../../infrastructure/models/ConsequenceModel';
import Tooltip from '@material-ui/core/Tooltip';

class SaveOptionForm extends Component {
  getSequences = () => {
    return this.props.sequences.map(s => {
      let name = s.name;
      if (s.authorNote) name += ' - ' + s.authorNote;
      return { _id: s._id, name };
    });
  };

  onAddConsequence = arrayHelpers => () => {
    const consequence = new ConsequenceModel();
    arrayHelpers.push(consequence);
  };

  onRemoveConsequence = arrayHelpers => index => {
    arrayHelpers.remove(index);
  };

  render() {
    const { formik, classes, attributes } = this.props;

    return (
      <Form noValidate className={classes.form}>
        <Field
          name="action"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              label="Action"
              fullWidth
              value={formik.values.action}
              {...hasError(formik, 'action')}
            />;
          }}
        />
        <Field
          name="nextSeq"
          required
          render={({ field }) => {
            return (
              <Select
                className={classes.nextSeq}
                formikField={field}
                label="Leads to"
                fullWidth
                items={this.getSequences()}
                {...hasError(formik, 'nextSeq')}
              />
            );
          }}
        />
        <FieldArray
          name="consequences"
          render={arrayHelpers => (
            <Fragment>
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
            </Fragment>
          )}
        />
      </Form>
    );
  }
}

SaveOptionForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  sequences: PropTypes.arrayOf(PropTypes.instanceOf(SequenceModel)).isRequired,
};

export default withStyles(styles)(SaveOptionForm);
