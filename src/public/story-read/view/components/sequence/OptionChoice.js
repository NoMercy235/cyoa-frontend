import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { OptionModel } from '../../../../../infrastructure/models/OptionModel';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import styles from './DisplaySequence.module.scss';

class OptionChoice extends Component {
  onOptionClick = () => {
    this.props.onOptionClick(this.props.option);
  };

  render() {
    const { option } = this.props;

    return (
      <Chip
        icon={<FaceIcon />}
        label={option.action}
        onClick={this.onOptionClick}
        className={styles.option}
      />
    );
  }
}

OptionChoice.propTypes = {
  option: PropTypes.shape(OptionModel).isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default OptionChoice;
