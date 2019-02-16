import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { OptionModel } from '../../../../infrastructure/models/OptionModel';

class OptionChoice extends Component {
  render() {
    const { option } = this.props;

    return (
      <div>
        {option.action}
      </div>
    );
  }
}

OptionChoice.propTypes = {
  option: PropTypes.shape(OptionModel),
};

export default OptionChoice;
