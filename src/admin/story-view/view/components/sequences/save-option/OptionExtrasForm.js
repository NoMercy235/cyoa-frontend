import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, IconButton, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import { arrayToSelectFieldOptions, renderInput, renderSelectInput } from '../../../../../../shared/utils/formUtils';

import { styles } from './SaveOption.css';

class OptionExtrasForm extends Component {
  onRemoveExtra = () => {
    this.props.onRemoveExtra(this.props.index);
  };

  render() {
    const { formik, attributes, index, names, classes } = this.props;
    return (
      <div className={classes.extraRow}>
        {renderSelectInput(formik, {
          required: true,
          label: 'Attribute',
          name: `${names.plural}.${index}.attribute`,
          className: classes.chapterField,
          fullWidth: true,
          items: arrayToSelectFieldOptions(attributes, { idProp: 'name' }),
        })}
        {renderInput(formik, {
          label: names.propLabel,
          name: `${names.plural}.${index}.${names.propName}`,
          fullWidth: true,
        })}
        <Tooltip title={`Remove ${names.singular}`}>
          <div className={classes.extraRemoveBtn}>
            <IconButton
              onClick={this.onRemoveExtra}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      </div>
    );
  }
}

OptionExtrasForm.propTypes = {
  classes: PropTypes.object.isRequired,
  names: PropTypes.shape({
    singular: PropTypes.string.isRequired,
    plural: PropTypes.string.isRequired,
    propName: PropTypes.string.isRequired,
    propLabel: PropTypes.string.isRequired,
  }).isRequired,
  formik: PropTypes.object.isRequired,
  attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)).isRequired,
  index: PropTypes.number.isRequired,
  onRemoveExtra: PropTypes.func.isRequired,
};

export default withStyles(styles)(OptionExtrasForm);
