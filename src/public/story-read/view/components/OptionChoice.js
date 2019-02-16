import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { OptionModel } from '../../../../infrastructure/models/OptionModel';

class OptionChoice extends Component {
  onOptionClick = () => {
    this.props.onOptionClick(this.props.option);
  };

  render() {
    const { option } = this.props;

    return (
      <div onClick={this.onOptionClick}>
        {option.action}
      </div>
    );
  }
}

OptionChoice.propTypes = {
  option: PropTypes.shape(OptionModel).isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default OptionChoice;
